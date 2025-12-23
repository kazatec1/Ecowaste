import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Navigation, Search, Filter, Star, 
  Clock, Phone, ExternalLink, Recycle, Leaf,
  ChevronRight, X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Map = () => {
  const { t } = useLanguage();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [userLocation, setUserLocation] = useState(null);

  // Mock collection points
  const collectionPoints = [
    {
      id: 1,
      name: 'EcoPonto Central',
      type: 'ecoponto',
      address: 'Av. Paulista, 1000 - Bela Vista',
      distance: '0.5 km',
      rating: 4.8,
      reviews: 127,
      hours: '08:00 - 18:00',
      phone: '(11) 3456-7890',
      materials: ['plastic', 'paper', 'glass', 'metal'],
      coordinates: { lat: -23.5629, lng: -46.6544 }
    },
    {
      id: 2,
      name: 'Supermercado Verde',
      type: 'partner',
      address: 'Rua Augusta, 500 - Consolação',
      distance: '1.2 km',
      rating: 4.5,
      reviews: 89,
      hours: '07:00 - 22:00',
      phone: '(11) 3456-7891',
      materials: ['plastic', 'electronic'],
      coordinates: { lat: -23.5550, lng: -46.6620 }
    },
    {
      id: 3,
      name: 'Praça da Reciclagem',
      type: 'public',
      address: 'Praça da República, s/n - República',
      distance: '2.0 km',
      rating: 4.2,
      reviews: 56,
      hours: '24 horas',
      phone: null,
      materials: ['all'],
      coordinates: { lat: -23.5430, lng: -46.6430 }
    },
    {
      id: 4,
      name: 'Coleta Eletrônicos Tech',
      type: 'electronic',
      address: 'Rua Santa Ifigênia, 200 - Centro',
      distance: '2.5 km',
      rating: 4.9,
      reviews: 234,
      hours: '09:00 - 19:00',
      phone: '(11) 3456-7892',
      materials: ['electronic'],
      coordinates: { lat: -23.5400, lng: -46.6380 }
    },
    {
      id: 5,
      name: 'Cooperativa ReciclaVida',
      type: 'cooperative',
      address: 'Rua da Mooca, 800 - Mooca',
      distance: '3.8 km',
      rating: 4.7,
      reviews: 178,
      hours: '07:00 - 17:00',
      phone: '(11) 3456-7893',
      materials: ['plastic', 'paper', 'metal'],
      coordinates: { lat: -23.5600, lng: -46.5900 }
    }
  ];

  const filters = [
    { id: 'all', name: 'Todos', icon: MapPin },
    { id: 'ecoponto', name: 'EcoPontos', icon: Recycle },
    { id: 'partner', name: 'Parceiros', icon: Star },
    { id: 'electronic', name: 'Eletrônicos', icon: Leaf },
    { id: 'cooperative', name: 'Cooperativas', icon: Leaf }
  ];

  const materialIcons = {
    plastic: '🔴',
    paper: '🔵',
    glass: '🟢',
    metal: '🟡',
    electronic: '🟠',
    all: '♻️'
  };

  const filteredPoints = collectionPoints.filter(point => {
    const matchesFilter = activeFilter === 'all' || point.type === activeFilter;
    const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         point.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  const PointCard = ({ point, compact = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: compact ? 1 : 1.02 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer ${
        compact ? 'p-3' : 'p-4'
      }`}
      onClick={() => setSelectedPoint(point)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${
              point.type === 'ecoponto' ? 'bg-green-500' :
              point.type === 'partner' ? 'bg-blue-500' :
              point.type === 'electronic' ? 'bg-orange-500' :
              point.type === 'cooperative' ? 'bg-purple-500' :
              'bg-gray-500'
            }`} />
            <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : ''}`}>
              {point.name}
            </h3>
          </div>
          <p className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>
            {point.address}
          </p>
          
          {!compact && (
            <>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  {point.rating}
                </span>
                <span className="text-gray-400">({point.reviews} avaliações)</span>
              </div>
              
              <div className="flex items-center space-x-2 mt-3">
                {point.materials.map((material, index) => (
                  <span key={index} className="text-lg" title={material}>
                    {materialIcons[material]}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="text-right">
          <span className="text-green-600 font-semibold">{point.distance}</span>
          {!compact && (
            <ChevronRight className="w-5 h-5 text-gray-400 mt-2 ml-auto" />
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 pt-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('map')}</h1>
              <p className="text-green-100">Encontre pontos de coleta próximos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-6"
        >
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pontos de coleta..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <filter.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{filter.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
        >
          <div className="relative h-64 md:h-96 bg-gradient-to-br from-green-100 to-blue-100">
            {/* Map placeholder with markers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Mapa Interativo</p>
                <p className="text-sm text-gray-400">
                  {filteredPoints.length} pontos de coleta encontrados
                </p>
              </div>
            </div>

            {/* Mock markers */}
            {filteredPoints.slice(0, 5).map((point, index) => (
              <motion.div
                key={point.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute cursor-pointer"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + (index % 3) * 20}%`
                }}
                onClick={() => setSelectedPoint(point)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                  point.type === 'ecoponto' ? 'bg-green-500' :
                  point.type === 'partner' ? 'bg-blue-500' :
                  point.type === 'electronic' ? 'bg-orange-500' :
                  'bg-purple-500'
                }`}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            ))}

            {/* User location */}
            {userLocation && (
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg">
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50" />
                </div>
              </div>
            )}

            {/* Location button */}
            <button className="absolute bottom-4 right-4 p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Navigation className="w-5 h-5 text-green-600" />
            </button>
          </div>
        </motion.div>

        {/* Collection Points List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900">Pontos de Coleta Próximos</h2>
          
          {filteredPoints.map((point) => (
            <PointCard key={point.id} point={point} />
          ))}

          {filteredPoints.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600">Nenhum ponto encontrado</h3>
              <p className="text-gray-400">Tente ajustar os filtros ou a busca</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Point Detail Modal */}
      {selectedPoint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
          onClick={() => setSelectedPoint(null)}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{selectedPoint.name}</h2>
              <button
                onClick={() => setSelectedPoint(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{selectedPoint.address}</p>
                  <p className="text-sm text-green-600">{selectedPoint.distance} de você</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Horário de Funcionamento</p>
                  <p className="text-sm text-gray-500">{selectedPoint.hours}</p>
                </div>
              </div>

              {/* Phone */}
              {selectedPoint.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Telefone</p>
                    <p className="text-sm text-gray-500">{selectedPoint.phone}</p>
                  </div>
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold text-gray-900 ml-2">{selectedPoint.rating}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {selectedPoint.reviews} avaliações
                </div>
              </div>

              {/* Materials Accepted */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Materiais Aceitos</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPoint.materials.map((material, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg"
                    >
                      <span className="text-lg">{materialIcons[material]}</span>
                      <span className="text-sm text-gray-700 capitalize">{material === 'all' ? 'Todos' : material}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Navegar</span>
                </motion.button>
                <button className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Map;
