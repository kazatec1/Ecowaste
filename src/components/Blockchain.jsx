import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Link2, Shield, CheckCircle, Clock, Hash, 
  ArrowRight, Eye, Copy, ExternalLink, Blocks,
  TrendingUp, Activity, Lock
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Blockchain = () => {
  const { t } = useLanguage();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  // Mock blockchain transactions
  const transactions = [
    {
      id: 1,
      hash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
      type: 'recycle',
      item: 'Garrafa PET (500ml)',
      quantity: 5,
      xp: 50,
      coins: 25,
      timestamp: '2024-01-15T14:30:00Z',
      status: 'verified',
      blockNumber: 18234567,
      gasUsed: '21000',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f',
      to: '0xEcoWaste...Contract'
    },
    {
      id: 2,
      hash: '0x3e8fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91abc',
      type: 'reward',
      item: 'Resgate: Vale Café',
      quantity: 1,
      xp: 0,
      coins: -100,
      timestamp: '2024-01-15T12:15:00Z',
      status: 'verified',
      blockNumber: 18234500,
      gasUsed: '45000',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f',
      to: '0xMarketplace...Contract'
    },
    {
      id: 3,
      hash: '0x9a1fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91def',
      type: 'achievement',
      item: 'Badge: Eco Warrior',
      quantity: 1,
      xp: 100,
      coins: 50,
      timestamp: '2024-01-14T18:45:00Z',
      status: 'verified',
      blockNumber: 18234123,
      gasUsed: '32000',
      from: '0xSystem...Contract',
      to: '0x742d35Cc6634C0532925a3b844Bc9e7595f'
    },
    {
      id: 4,
      hash: '0x5b2fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91ghi',
      type: 'recycle',
      item: 'Papelão (2kg)',
      quantity: 1,
      xp: 20,
      coins: 10,
      timestamp: '2024-01-14T10:20:00Z',
      status: 'pending',
      blockNumber: null,
      gasUsed: null,
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f',
      to: '0xEcoWaste...Contract'
    }
  ];

  const stats = [
    { label: 'Total de Transações', value: '1,247', icon: Activity, color: 'from-blue-400 to-blue-600' },
    { label: 'Verificadas', value: '1,245', icon: CheckCircle, color: 'from-green-400 to-green-600' },
    { label: 'Blocos Processados', value: '18.2M', icon: Blocks, color: 'from-purple-400 to-purple-600' },
    { label: 'Taxa de Sucesso', value: '99.8%', icon: TrendingUp, color: 'from-yellow-400 to-orange-500' }
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 pt-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('blockchain')}</h1>
              <p className="text-purple-200">Rastreamento transparente e imutável</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Security Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-8 text-white"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Suas transações estão seguras</h2>
              <p className="text-green-100 mt-1">
                Todas as ações são registradas em blockchain, garantindo transparência e imutabilidade.
                Cada reciclagem, recompensa e conquista é verificada e permanente.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('transactions')}</h2>
              <div className="flex items-center space-x-2">
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Todas</option>
                  <option>Reciclagem</option>
                  <option>Recompensas</option>
                  <option>Conquistas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-6 cursor-pointer transition-colors"
                onClick={() => setSelectedTransaction(tx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      tx.type === 'recycle' ? 'bg-green-100 text-green-600' :
                      tx.type === 'reward' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {tx.type === 'recycle' && '♻️'}
                      {tx.type === 'reward' && '🎁'}
                      {tx.type === 'achievement' && '🏆'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tx.item}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 font-mono">{truncateHash(tx.hash)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(tx.hash, tx.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {copiedHash === tx.id ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      {tx.xp > 0 && <p className="text-sm font-medium text-purple-600">+{tx.xp} XP</p>}
                      <p className={`text-sm font-medium ${tx.coins >= 0 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {tx.coins >= 0 ? '+' : ''}{tx.coins} 🪙
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {tx.status === 'verified' ? (
                        <span className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {t('verified')}
                        </span>
                      ) : (
                        <span className="flex items-center text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 mr-1" />
                          {t('pending')}
                        </span>
                      )}
                    </div>

                    <div className="text-right text-sm text-gray-500">
                      {formatDate(tx.timestamp)}
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Detalhes da Transação</h2>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-center">
                  {selectedTransaction.status === 'verified' ? (
                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-6 py-3 rounded-full">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-semibold">Transação Verificada</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-6 py-3 rounded-full">
                      <Clock className="w-6 h-6" />
                      <span className="font-semibold">Aguardando Verificação</span>
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Hash da Transação</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-mono text-sm text-gray-900 break-all">{selectedTransaction.hash}</p>
                      <button
                        onClick={() => copyToClipboard(selectedTransaction.hash, 'modal')}
                        className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Bloco</p>
                      <p className="font-semibold text-gray-900">
                        {selectedTransaction.blockNumber || 'Pendente'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Gas Usado</p>
                      <p className="font-semibold text-gray-900">
                        {selectedTransaction.gasUsed || 'Pendente'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">De</p>
                    <p className="font-mono text-sm text-gray-900">{selectedTransaction.from}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Para</p>
                    <p className="font-mono text-sm text-gray-900">{selectedTransaction.to}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Data/Hora</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedTransaction.timestamp)}</p>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all">
                  <ExternalLink className="w-5 h-5" />
                  <span>Ver no Explorer</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blockchain;
