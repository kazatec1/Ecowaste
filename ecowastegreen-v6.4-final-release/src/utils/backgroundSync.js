// Background Sync para EcoWaste Green
export class BackgroundSync {
  constructor() {
    this.queue = [];
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  addToQueue(request) {
    this.queue.push(request);
    if (this.isOnline) {
      this.processQueue();
    }
  }

  async processQueue() {
    while (this.queue.length > 0 && this.isOnline) {
      const request = this.queue.shift();
      try {
        await fetch(request);
        console.log('Background sync: Request processada', request.url);
      } catch (error) {
        console.error('Background sync: Erro', error);
        this.queue.unshift(request); // Recolocar na fila
        break;
      }
    }
  }
}

// Instância global
export const backgroundSync = new BackgroundSync();