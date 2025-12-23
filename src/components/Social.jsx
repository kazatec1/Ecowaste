import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Heart, MessageCircle, Share2, Trophy, 
  UserPlus, Search, Bell, Camera, Send, Smile,
  MoreHorizontal, Bookmark, Flag, MapPin, Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Social = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [showComments, setShowComments] = useState(null);

  // Mock data
  const posts = [
    {
      id: 1,
      user: {
        name: 'Maria Silva',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
        level: 15,
        badge: '🌟'
      },
      content: 'Acabei de completar o desafio semanal de reciclagem! 🎉 50 itens reciclados em uma semana. Vamos juntos salvar o planeta! 🌍♻️',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600',
      likes: 127,
      comments: 23,
      shares: 8,
      timestamp: '2 horas atrás',
      liked: true,
      achievement: 'Eco Warrior'
    },
    {
      id: 2,
      user: {
        name: 'João Santos',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
        level: 22,
        badge: '🏆'
      },
      content: 'Dica do dia: Sabia que uma garrafa PET pode levar até 400 anos para se decompor na natureza? Por isso é tão importante reciclar! Compartilhem essa informação! 📢',
      likes: 89,
      comments: 15,
      shares: 34,
      timestamp: '5 horas atrás',
      liked: false
    },
    {
      id: 3,
      user: {
        name: 'Ana Costa',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
        level: 8,
        badge: '🌱'
      },
      content: 'Primeira semana usando o EcoWaste Green e já estou viciada! Gamificação da reciclagem é genial. Quem quer ser meu amigo no app? 😊',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
      likes: 256,
      comments: 42,
      shares: 12,
      timestamp: '1 dia atrás',
      liked: true
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Carlos Mendes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos', xp: 15420, level: 28 },
    { rank: 2, name: 'Lucia Ferreira', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucia', xp: 14890, level: 27 },
    { rank: 3, name: 'Pedro Alves', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro', xp: 13200, level: 25 },
    { rank: 4, name: 'Maria Silva', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria', xp: 12100, level: 23 },
    { rank: 5, name: 'João Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao', xp: 11500, level: 22 },
  ];

  const friends = [
    { id: 1, name: 'Maria Silva', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria', status: 'online', lastActivity: 'Reciclou 5 itens' },
    { id: 2, name: 'João Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao', status: 'online', lastActivity: 'Ganhou badge Eco Warrior' },
    { id: 3, name: 'Ana Costa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana', status: 'offline', lastActivity: 'Há 2 horas' },
    { id: 4, name: 'Pedro Alves', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro', status: 'online', lastActivity: 'Completou desafio' },
  ];

  const challenges = [
    { id: 1, name: 'Desafio da Semana', description: 'Recicle 30 itens', participants: 1247, prize: '500 EcoCoins', endsIn: '3 dias' },
    { id: 2, name: 'Maratona Verde', description: 'Escaneie 50 materiais diferentes', participants: 856, prize: '1000 EcoCoins', endsIn: '5 dias' },
    { id: 3, name: 'Social Star', description: 'Faça 10 novos amigos', participants: 2341, prize: '300 EcoCoins', endsIn: '7 dias' },
  ];

  const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(post.liked);
    const [likesCount, setLikesCount] = useState(post.likes);

    const handleLike = () => {
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
      >
        {/* Post Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-12 h-12 rounded-full border-2 border-green-500"
              />
              <span className="absolute -bottom-1 -right-1 text-lg">{post.user.badge}</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Nível {post.user.level}
                </span>
              </div>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Achievement Badge */}
        {post.achievement && (
          <div className="px-4 pb-2">
            <span className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 text-sm px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 mr-1" />
              Desbloqueou: {post.achievement}
            </span>
          </div>
        )}

        {/* Post Content */}
        <div className="px-4 pb-4">
          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Post Image */}
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="w-full h-64 object-cover"
          />
        )}

        {/* Post Stats */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>{likesCount} curtidas</span>
          <span>{post.comments} comentários • {post.shares} compartilhamentos</span>
        </div>

        {/* Post Actions */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-around">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
              liked ? 'text-red-500' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span>{t('like')}</span>
          </motion.button>
          <button
            onClick={() => setShowComments(showComments === post.id ? null : post.id)}
            className="flex items-center space-x-2 py-2 px-4 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t('comment')}</span>
          </button>
          <button className="flex items-center space-x-2 py-2 px-4 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <Share2 className="w-5 h-5" />
            <span>{t('share')}</span>
          </button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments === post.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Comment Input */}
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt="You"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <input
                      type="text"
                      placeholder="Escreva um comentário..."
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                    <button className="p-1 hover:bg-gray-200 rounded-full">
                      <Smile className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded-full ml-1">
                      <Send className="w-5 h-5 text-green-500" />
                    </button>
                  </div>
                </div>

                {/* Sample Comments */}
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=comment1"
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <p className="font-semibold text-sm">Lucas Oliveira</p>
                        <p className="text-sm text-gray-700">Parabéns! Continue assim! 🎉</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <button className="hover:text-gray-700">Curtir</button>
                        <button className="hover:text-gray-700">Responder</button>
                        <span>1h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 pt-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t('social')}</h1>
                <p className="text-blue-200">Conecte-se com outros eco-heróis</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="relative p-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">5</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex space-x-2">
          {['feed', 'leaderboard', 'friends', 'challenges'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab === 'feed' && 'Feed'}
              {tab === 'leaderboard' && t('leaderboard')}
              {tab === 'friends' && t('friends')}
              {tab === 'challenges' && 'Desafios'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'feed' && (
              <>
                {/* Create Post */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-4 mb-6"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                      alt="You"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Compartilhe sua jornada verde..."
                        className="w-full p-3 bg-gray-100 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Camera className="w-5 h-5" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                            <MapPin className="w-5 h-5" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                            <Smile className="w-5 h-5" />
                          </button>
                        </div>
                        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                          Publicar
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Posts Feed */}
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </>
            )}

            {activeTab === 'leaderboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">{t('leaderboard')}</h2>
                  <p className="text-gray-500">Os maiores eco-heróis da comunidade</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {leaderboard.map((player, index) => (
                    <div key={player.rank} className={`p-4 flex items-center ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${
                        player.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                        player.rank === 2 ? 'bg-gray-300 text-gray-700' :
                        player.rank === 3 ? 'bg-orange-400 text-orange-900' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {player.rank}
                      </div>
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{player.name}</h3>
                        <p className="text-sm text-gray-500">Nível {player.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">{player.xp.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'friends' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{t('friends')}</h2>
                    <p className="text-gray-500">{friends.length} amigos</p>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                    <UserPlus className="w-5 h-5" />
                    <span>Adicionar</span>
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {friends.map((friend) => (
                    <div key={friend.id} className="p-4 flex items-center">
                      <div className="relative mr-4">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                        <p className="text-sm text-gray-500">{friend.lastActivity}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'challenges' && (
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{challenge.name}</h3>
                        <p className="text-gray-500 mt-1">{challenge.description}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {challenge.prize}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {challenge.participants} participantes
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Termina em {challenge.endsIn}
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                        Participar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Sua Posição</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">#42</div>
                <p className="text-gray-500">no ranking global</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                  <p className="text-sm text-gray-500">XP Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-sm text-gray-500">Amigos</p>
                </div>
              </div>
            </motion.div>

            {/* Suggested Friends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Sugestões de Amigos</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=suggest${i}`}
                      alt="Suggestion"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Usuário {i}</p>
                      <p className="text-xs text-gray-500">3 amigos em comum</p>
                    </div>
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
