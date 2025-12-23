import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, ShoppingBag, Star, Tag, Filter, Search,
  Heart, ShoppingCart, Check, Sparkles, Coins,
  Coffee, Ticket, Smartphone, TreePine, Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Marketplace = () => {
  const { user, spendEcoCoins } = useAuth();
  const { t, formatCurrency, currency } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRedeemModal, setShowRedeemModal] = useState(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const categories = [
    { id: 'all', name: 'Todos', icon: Gift },
    { id: 'vouchers', name: 'Vouchers', icon: Ticket },
    { id: 'food', name: 'Alimentação', icon: Coffee },
    { id: 'tech', name: 'Tecnologia', icon: Smartphone },
    { id: 'eco', name: 'Eco Produtos', icon: TreePine },
    { id: 'exclusive', name: 'Exclusivos', icon: Award },
  ];

  const rewards = [
    {
      id: 1,
      name: 'Vale Café Starbucks',
      description: 'Um café de qualquer tamanho na Starbucks',
      category: 'food',
      price: 100,
      originalPrice: 150,
      image: '☕',
      stock: 50,
      popular: true,
      rating: 4.8,
      redeemed: 1247
    },
    {
      id: 2,
      name: 'Ingresso Cinema',
      description: 'Ingresso para qualquer filme em cinemas parceiros',
      category: 'vouchers',
      price: 200,
      originalPrice: 250,
      image: '🎬',
      stock: 30,
      popular: true,
      rating: 4.9,
      redeemed: 892
    },
    {
      id: 3,
      name: 'Desconto iFood 20%',
      description: 'Cupom de 20% de desconto no iFood',
      category: 'food',
      price: 80,
      originalPrice: 100,
      image: '🍔',
      stock: 100,
      popular: false,
      rating: 4.5,
      redeemed: 2341
    },
    {
      id: 4,
      name: 'Plante uma Árvore',
      description: 'Doação para plantar uma árvore em seu nome',
      category: 'eco',
      price: 150,
      originalPrice: null,
      image: '🌳',
      stock: 999,
      popular: true,
      rating: 5.0,
      redeemed: 5678
    },
    {
      id: 5,
      name: 'Fone Bluetooth Eco',
      description: 'Fone de ouvido feito com materiais reciclados',
      category: 'tech',
      price: 500,
      originalPrice: 600,
      image: '🎧',
      stock: 10,
      popular: false,
      rating: 4.7,
      redeemed: 156
    },
    {
      id: 6,
      name: 'Badge Exclusivo',
      description: 'Badge dourado exclusivo para seu perfil',
      category: 'exclusive',
      price: 300,
      originalPrice: null,
      image: '🏅',
      stock: 50,
      popular: true,
      rating: 4.9,
      redeemed: 423
    },
    {
      id: 7,
      name: 'Kit Ecobag',
      description: '3 sacolas reutilizáveis premium',
      category: 'eco',
      price: 120,
      originalPrice: 150,
      image: '👜',
      stock: 75,
      popular: false,
      rating: 4.6,
      redeemed: 789
    },
    {
      id: 8,
      name: 'Garrafa Térmica Eco',
      description: 'Garrafa térmica de aço inox 500ml',
      category: 'eco',
      price: 180,
      originalPrice: 220,
      image: '🫗',
      stock: 40,
      popular: true,
      rating: 4.8,
      redeemed: 567
    },
    {
      id: 9,
      name: 'Crédito Uber R$20',
      description: 'Crédito de R$20 para corridas Uber',
      category: 'vouchers',
      price: 150,
      originalPrice: 180,
      image: '🚗',
      stock: 60,
      popular: false,
      rating: 4.4,
      redeemed: 1023
    },
    {
      id: 10,
      name: 'Avatar Premium',
      description: 'Pacote de avatares exclusivos animados',
      category: 'exclusive',
      price: 250,
      originalPrice: null,
      image: '🎭',
      stock: 100,
      popular: false,
      rating: 4.7,
      redeemed: 345
    },
    {
      id: 11,
      name: 'Spotify 1 Mês',
      description: 'Assinatura Spotify Premium por 1 mês',
      category: 'tech',
      price: 350,
      originalPrice: 400,
      image: '🎵',
      stock: 25,
      popular: true,
      rating: 4.9,
      redeemed: 678
    },
    {
      id: 12,
      name: 'Composteira Doméstica',
      description: 'Kit completo para compostagem em casa',
      category: 'eco',
      price: 400,
      originalPrice: 500,
      image: '🪴',
      stock: 15,
      popular: false,
      rating: 4.8,
      redeemed: 234
    }
  ];

  const filteredRewards = rewards.filter(reward => {
    const matchesCategory = activeCategory === 'all' || reward.category === activeCategory;
    const matchesSearch = reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRedeem = (reward) => {
    if ((user?.ecoCoins || 0) >= reward.price) {
      spendEcoCoins(reward.price);
      setRedeemSuccess(true);
      setTimeout(() => {
        setRedeemSuccess(false);
        setShowRedeemModal(null);
      }, 2000);
    }
  };

  const RewardCard = ({ reward }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
      onClick={() => setShowRedeemModal(reward)}
    >
      {/* Image/Icon */}
      <div className="relative h-40 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <span className="text-6xl">{reward.image}</span>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {reward.popular && (
            <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Popular
            </span>
          )}
          {reward.originalPrice && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              -{Math.round((1 - reward.price / reward.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>

        {/* Stock Warning */}
        {reward.stock < 20 && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Apenas {reward.stock} restantes!
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {categories.find(c => c.id === reward.category)?.name}
          </span>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs ml-1 text-gray-600">{reward.rating}</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-1">{reward.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{reward.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-green-600">{reward.price}</span>
            <span className="text-lg">🪙</span>
            {reward.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{reward.originalPrice}</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>

        <p className="text-xs text-gray-400 mt-2">{reward.redeemed.toLocaleString()} resgatados</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 pt-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t('marketplace')}</h1>
                <p className="text-yellow-100">Troque seus EcoCoins por recompensas</p>
              </div>
            </div>
            
            {/* Balance */}
            <div className="bg-white/20 rounded-xl px-6 py-3">
              <p className="text-sm text-yellow-100">Seu saldo</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">{user?.ecoCoins || 0}</span>
                <span className="text-2xl">🪙</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar recompensas..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎉 Oferta Especial!</h2>
              <p className="text-green-100">
                Ganhe 2x EcoCoins em todas as reciclagens este fim de semana!
              </p>
            </div>
            <div className="text-6xl">🌟</div>
          </div>
        </motion.div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>

        {filteredRewards.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">Nenhuma recompensa encontrada</h3>
            <p className="text-gray-400">Tente ajustar os filtros ou a busca</p>
          </div>
        )}
      </div>

      {/* Redeem Modal */}
      <AnimatePresence>
        {showRedeemModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !redeemSuccess && setShowRedeemModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {redeemSuccess ? (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Resgate Confirmado!</h2>
                  <p className="text-gray-500">
                    Seu código foi enviado para seu email.
                  </p>
                </div>
              ) : (
                <>
                  {/* Modal Header */}
                  <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <span className="text-8xl">{showRedeemModal.image}</span>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 uppercase tracking-wide">
                        {categories.find(c => c.id === showRedeemModal.category)?.name}
                      </span>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm ml-1 text-gray-600">{showRedeemModal.rating}</span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{showRedeemModal.name}</h2>
                    <p className="text-gray-500 mb-6">{showRedeemModal.description}</p>

                    {/* Price */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                      <span className="text-gray-600">Preço</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">{showRedeemModal.price}</span>
                        <span className="text-2xl">🪙</span>
                      </div>
                    </div>

                    {/* Balance Check */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                      <span className="text-gray-600">Seu saldo</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xl font-bold ${(user?.ecoCoins || 0) >= showRedeemModal.price ? 'text-green-600' : 'text-red-500'}`}>
                          {user?.ecoCoins || 0}
                        </span>
                        <span className="text-xl">🪙</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowRedeemModal(null)}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Cancelar
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRedeem(showRedeemModal)}
                        disabled={(user?.ecoCoins || 0) < showRedeemModal.price}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                          (user?.ecoCoins || 0) >= showRedeemModal.price
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {(user?.ecoCoins || 0) >= showRedeemModal.price ? 'Resgatar' : 'Saldo Insuficiente'}
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;
