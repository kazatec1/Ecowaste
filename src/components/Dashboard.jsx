import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, Trophy, Coins, Recycle, Target, TrendingUp, 
  Award, Star, Zap, Gift, Users, MapPin, Bell,
  ChevronRight, Calendar, Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const { user, addXP, addEcoCoins } = useAuth();
  const { t, formatCurrency } = useLanguage();
  const [showNotification, setShowNotification] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(7);

  // Mock data for charts
  const weeklyData = [
    { day: 'Seg', recycled: 12, xp: 120 },
    { day: 'Ter', recycled: 19, xp: 190 },
    { day: 'Qua', recycled: 8, xp: 80 },
    { day: 'Qui', recycled: 25, xp: 250 },
    { day: 'Sex', recycled: 15, xp: 150 },
    { day: 'Sáb', recycled: 30, xp: 300 },
    { day: 'Dom', recycled: 22, xp: 220 },
  ];

  const achievements = [
    { id: 1, name: 'Primeiro Passo', icon: '🌱', description: 'Recicle seu primeiro item', completed: true },
    { id: 2, name: 'Eco Warrior', icon: '⚔️', description: 'Recicle 100 itens', completed: true },
    { id: 3, name: 'Mestre Verde', icon: '🏆', description: 'Alcance o nível 10', completed: false, progress: 60 },
    { id: 4, name: 'Social Star', icon: '⭐', description: 'Faça 10 amigos', completed: false, progress: 30 },
    { id: 5, name: 'Blockchain Pro', icon: '🔗', description: 'Verifique 50 transações', completed: false, progress: 45 },
  ];

  const recentActivities = [
    { id: 1, type: 'recycle', item: 'Garrafa PET', xp: 10, coins: 5, time: '2 min atrás' },
    { id: 2, type: 'achievement', item: 'Eco Warrior desbloqueado!', xp: 100, coins: 50, time: '1 hora atrás' },
    { id: 3, type: 'social', item: 'Novo amigo: Maria Silva', xp: 20, coins: 10, time: '3 horas atrás' },
    { id: 4, type: 'challenge', item: 'Desafio semanal completado', xp: 200, coins: 100, time: '1 dia atrás' },
  ];

  const dailyChallenges = [
    { id: 1, name: 'Recicle 5 itens', progress: 3, total: 5, reward: 50 },
    { id: 2, name: 'Escaneie 3 novos materiais', progress: 2, total: 3, reward: 30 },
    { id: 3, name: 'Compartilhe uma conquista', progress: 0, total: 1, reward: 20 },
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-green-500 text-sm font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mt-4">{value}</h3>
      <p className="text-gray-500 text-sm mt-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </motion.div>
  );

  const xpProgress = ((user?.xp || 0) % 100);
  const xpToNextLevel = 100 - xpProgress;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-8 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl border-4 border-white/30 shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {t('welcome')}, {user?.name || 'Usuário'}!
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                    {t('level')} {user?.level || 1}
                  </span>
                  <span className="text-white/80 text-sm">
                    {dailyStreak} dias de sequência 🔥
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-colors"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
              </motion.button>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-6 bg-white/20 rounded-xl p-4">
            <div className="flex items-center justify-between text-white text-sm mb-2">
              <span>XP: {user?.xp || 0}</span>
              <span>{xpToNextLevel} XP para o próximo nível</span>
            </div>
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Coins}
            title={t('ecoCoins')}
            value={user?.ecoCoins || 0}
            subtitle="Disponível para resgatar"
            color="from-yellow-400 to-orange-500"
            trend="+12%"
          />
          <StatCard
            icon={Recycle}
            title={t('totalRecycled')}
            value={`${user?.totalRecycled || 0} kg`}
            subtitle="Este mês"
            color="from-green-400 to-green-600"
            trend="+8%"
          />
          <StatCard
            icon={Trophy}
            title={t('achievements')}
            value={`${achievements.filter(a => a.completed).length}/${achievements.length}`}
            subtitle="Conquistas desbloqueadas"
            color="from-purple-400 to-purple-600"
          />
          <StatCard
            icon={Users}
            title={t('friends')}
            value="24"
            subtitle="Na sua rede"
            color="from-blue-400 to-blue-600"
            trend="+3"
          />
        </div>

        {/* Charts and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('weeklyProgress')}</h2>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Esta semana</option>
                <option>Última semana</option>
                <option>Este mês</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorRecycled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="recycled" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRecycled)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Daily Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Desafios Diários</h2>
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                12h restantes
              </span>
            </div>
            <div className="space-y-4">
              {dailyChallenges.map((challenge) => (
                <div key={challenge.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{challenge.name}</span>
                    <span className="text-sm text-green-600 font-medium">+{challenge.reward} 🪙</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{challenge.progress}/{challenge.total}</span>
                    <span>{Math.round((challenge.progress / challenge.total) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Achievements and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('achievements')}</h2>
              <button className="text-green-600 text-sm font-medium flex items-center hover:text-green-700">
                Ver todas <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`flex items-center p-4 rounded-xl transition-colors ${
                    achievement.completed ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-3xl mr-4">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${achievement.completed ? 'text-green-700' : 'text-gray-900'}`}>
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                    {!achievement.completed && achievement.progress && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {achievement.completed && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('recentActivity')}</h2>
              <button className="text-green-600 text-sm font-medium flex items-center hover:text-green-700">
                Ver histórico <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                    activity.type === 'recycle' ? 'bg-green-100 text-green-600' :
                    activity.type === 'achievement' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'social' ? 'bg-blue-100 text-blue-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {activity.type === 'recycle' && <Recycle className="w-5 h-5" />}
                    {activity.type === 'achievement' && <Trophy className="w-5 h-5" />}
                    {activity.type === 'social' && <Users className="w-5 h-5" />}
                    {activity.type === 'challenge' && <Target className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.item}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+{activity.xp} XP</p>
                    <p className="text-xs text-yellow-600">+{activity.coins} 🪙</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
