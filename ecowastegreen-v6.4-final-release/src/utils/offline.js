// Utilitários para gerenciamento offline
// Implementa armazenamento local e sincronização de dados

class OfflineManager {
  constructor() {
    this.dbName = 'EcoWasteGreenDB';
    this.dbVersion = 1;
    this.db = null;
    this.init();
  }

  async init() {
    try {
      this.db = await this.openDB();
      console.log('OfflineManager: Database initialized');
    } catch (error) {
      console.error('OfflineManager: Failed to initialize database', error);
    }
  }

  openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store para dados de usuário
        if (!db.objectStoreNames.contains('userData')) {
          const userStore = db.createObjectStore('userData', { keyPath: 'id' });
          userStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store para transações blockchain
        if (!db.objectStoreNames.contains('transactions')) {
          const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
          txStore.createIndex('userId', 'userId', { unique: false });
        }

        // Store para posts sociais
        if (!db.objectStoreNames.contains('socialPosts')) {
          const socialStore = db.createObjectStore('socialPosts', { keyPath: 'id' });
          socialStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store para dados pendentes de sincronização
        if (!db.objectStoreNames.contains('pendingSync')) {
          const syncStore = db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveUserData(data) {
    try {
      const transaction = this.db.transaction(['userData'], 'readwrite');
      const store = transaction.objectStore('userData');
      
      const userData = {
        id: 'current_user',
        ...data,
        timestamp: Date.now(),
        synced: navigator.onLine
      };

      await store.put(userData);
      console.log('OfflineManager: User data saved');
      return userData;
    } catch (error) {
      console.error('OfflineManager: Failed to save user data', error);
      throw error;
    }
  }

  async getUserData() {
    try {
      const transaction = this.db.transaction(['userData'], 'readonly');
      const store = transaction.objectStore('userData');
      const request = store.get('current_user');

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('OfflineManager: Failed to get user data', error);
      return null;
    }
  }

  async saveTransaction(transaction) {
    try {
      const tx = this.db.transaction(['transactions'], 'readwrite');
      const store = tx.objectStore('transactions');
      
      const txData = {
        ...transaction,
        timestamp: Date.now(),
        synced: navigator.onLine
      };

      await store.put(txData);
      
      // Se offline, adicionar à fila de sincronização
      if (!navigator.onLine) {
        await this.addToSyncQueue('transaction', txData);
      }

      console.log('OfflineManager: Transaction saved');
      return txData;
    } catch (error) {
      console.error('OfflineManager: Failed to save transaction', error);
      throw error;
    }
  }

  async getTransactions(userId) {
    try {
      const transaction = this.db.transaction(['transactions'], 'readonly');
      const store = transaction.objectStore('transactions');
      const index = store.index('userId');
      const request = index.getAll(userId);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('OfflineManager: Failed to get transactions', error);
      return [];
    }
  }

  async saveSocialPost(post) {
    try {
      const transaction = this.db.transaction(['socialPosts'], 'readwrite');
      const store = transaction.objectStore('socialPosts');
      
      const postData = {
        ...post,
        timestamp: Date.now(),
        synced: navigator.onLine
      };

      await store.put(postData);
      
      // Se offline, adicionar à fila de sincronização
      if (!navigator.onLine) {
        await this.addToSyncQueue('socialPost', postData);
      }

      console.log('OfflineManager: Social post saved');
      return postData;
    } catch (error) {
      console.error('OfflineManager: Failed to save social post', error);
      throw error;
    }
  }

  async getSocialPosts() {
    try {
      const transaction = this.db.transaction(['socialPosts'], 'readonly');
      const store = transaction.objectStore('socialPosts');
      const index = store.index('timestamp');
      const request = index.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const posts = request.result.sort((a, b) => b.timestamp - a.timestamp);
          resolve(posts);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('OfflineManager: Failed to get social posts', error);
      return [];
    }
  }

  async addToSyncQueue(type, data) {
    try {
      const transaction = this.db.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');
      
      const syncData = {
        type,
        data,
        timestamp: Date.now(),
        retries: 0
      };

      await store.add(syncData);
      console.log('OfflineManager: Added to sync queue', type);
    } catch (error) {
      console.error('OfflineManager: Failed to add to sync queue', error);
    }
  }

  async getPendingSyncData() {
    try {
      const transaction = this.db.transaction(['pendingSync'], 'readonly');
      const store = transaction.objectStore('pendingSync');
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('OfflineManager: Failed to get pending sync data', error);
      return [];
    }
  }

  async removeSyncData(id) {
    try {
      const transaction = this.db.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');
      await store.delete(id);
      console.log('OfflineManager: Sync data removed', id);
    } catch (error) {
      console.error('OfflineManager: Failed to remove sync data', error);
    }
  }

  async syncPendingData() {
    if (!navigator.onLine) {
      console.log('OfflineManager: Cannot sync - offline');
      return;
    }

    try {
      const pendingData = await this.getPendingSyncData();
      
      for (const item of pendingData) {
        try {
          await this.syncItem(item);
          await this.removeSyncData(item.id);
          console.log('OfflineManager: Item synced successfully', item.id);
        } catch (error) {
          console.error('OfflineManager: Failed to sync item', item.id, error);
          // Incrementar contador de tentativas
          item.retries = (item.retries || 0) + 1;
          
          // Remover após muitas tentativas falhadas
          if (item.retries > 5) {
            await this.removeSyncData(item.id);
            console.log('OfflineManager: Item removed after max retries', item.id);
          }
        }
      }
    } catch (error) {
      console.error('OfflineManager: Sync failed', error);
    }
  }

  async syncItem(item) {
    const { type, data } = item;
    
    switch (type) {
      case 'transaction':
        // Implementar sincronização de transação
        return fetch('/api/blockchain/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
      case 'socialPost':
        // Implementar sincronização de post social
        return fetch('/api/social/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
      default:
        throw new Error(`Unknown sync type: ${type}`);
    }
  }

  // Verificar status de conectividade
  isOnline() {
    return navigator.onLine;
  }

  // Registrar listeners para mudanças de conectividade
  setupConnectivityListeners() {
    window.addEventListener('online', () => {
      console.log('OfflineManager: Back online - syncing data');
      this.syncPendingData();
    });

    window.addEventListener('offline', () => {
      console.log('OfflineManager: Gone offline');
    });
  }
}

// Instância singleton
const offlineManager = new OfflineManager();

export default offlineManager;
