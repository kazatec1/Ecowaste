import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, Scan, CheckCircle, XCircle, 
  Recycle, Trash2, AlertTriangle, Info, MapPin,
  Sparkles, Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Scanner = () => {
  const { addXP, addEcoCoins } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  // Mock waste database
  const wasteDatabase = {
    plastic: {
      name: 'Plástico',
      recyclable: true,
      color: 'Vermelho',
      bin: 'Lixeira Vermelha',
      tips: [
        'Lave antes de descartar',
        'Remova rótulos quando possível',
        'Amasse para economizar espaço'
      ],
      xp: 10,
      coins: 5,
      icon: '♻️'
    },
    paper: {
      name: 'Papel/Papelão',
      recyclable: true,
      color: 'Azul',
      bin: 'Lixeira Azul',
      tips: [
        'Não molhe o papel',
        'Remova grampos e clipes',
        'Dobre para economizar espaço'
      ],
      xp: 8,
      coins: 4,
      icon: '📄'
    },
    glass: {
      name: 'Vidro',
      recyclable: true,
      color: 'Verde',
      bin: 'Lixeira Verde',
      tips: [
        'Cuidado com cacos',
        'Lave antes de descartar',
        'Não misture com cerâmica'
      ],
      xp: 15,
      coins: 8,
      icon: '🫙'
    },
    metal: {
      name: 'Metal',
      recyclable: true,
      color: 'Amarelo',
      bin: 'Lixeira Amarela',
      tips: [
        'Lave latas antes de descartar',
        'Amasse para economizar espaço',
        'Separe tampas de materiais diferentes'
      ],
      xp: 12,
      coins: 6,
      icon: '🥫'
    },
    organic: {
      name: 'Orgânico',
      recyclable: false,
      color: 'Marrom',
      bin: 'Lixeira Marrom/Composteira',
      tips: [
        'Pode ser compostado',
        'Evite misturar com outros resíduos',
        'Considere fazer compostagem em casa'
      ],
      xp: 5,
      coins: 2,
      icon: '🍂'
    },
    electronic: {
      name: 'Eletrônico',
      recyclable: true,
      color: 'Laranja',
      bin: 'Ponto de Coleta Especial',
      tips: [
        'Nunca descarte no lixo comum',
        'Procure pontos de coleta específicos',
        'Remova baterias antes de descartar'
      ],
      xp: 25,
      coins: 15,
      icon: '📱'
    }
  };

  const nearbyCollectionPoints = [
    { name: 'EcoPonto Centro', distance: '0.5 km', types: ['plastic', 'paper', 'glass', 'metal'] },
    { name: 'Supermercado Verde', distance: '1.2 km', types: ['electronic', 'plastic'] },
    { name: 'Praça da Reciclagem', distance: '2.0 km', types: ['all'] },
  ];

  const simulateAIScan = () => {
    setScanning(true);
    setResult(null);

    // Simulate AI processing
    setTimeout(() => {
      const wasteTypes = Object.keys(wasteDatabase);
      const randomType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
      const wasteInfo = wasteDatabase[randomType];
      
      setResult({
        type: randomType,
        ...wasteInfo,
        confidence: Math.floor(Math.random() * 15) + 85, // 85-99% confidence
        timestamp: new Date().toISOString()
      });
      
      // Award XP and coins
      addXP(wasteInfo.xp);
      addEcoCoins(wasteInfo.coins);
      
      setScanning(false);
    }, 2500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        simulateAIScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    setShowCamera(true);
    // In a real app, this would access the device camera
    setTimeout(() => {
      setShowCamera(false);
      setSelectedImage('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400');
      simulateAIScan();
    }, 1500);
  };

  const resetScanner = () => {
    setResult(null);
    setSelectedImage(null);
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Scan className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('scanner')}</h1>
              <p className="text-blue-100">Identifique resíduos com Inteligência Artificial</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Scanner Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Image Preview / Camera Area */}
          <div className="relative aspect-video bg-gray-900 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {selectedImage ? (
                <motion.img
                  key="image"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  src={selectedImage}
                  alt="Scanned item"
                  className="w-full h-full object-cover"
                />
              ) : showCamera ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-white"
                >
                  <div className="w-16 h-16 border-4 border-white rounded-full mx-auto mb-4 animate-pulse" />
                  <p>Capturando imagem...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-400"
                >
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Tire uma foto ou faça upload de uma imagem</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanning Overlay */}
            <AnimatePresence>
              {scanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <div className="text-center text-white">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 border-4 border-t-green-400 border-r-green-400 border-b-transparent border-l-transparent rounded-full mx-auto mb-4"
                    />
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-5 h-5 text-green-400" />
                      <span className="text-lg font-medium">Analisando com IA...</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-2">Identificando tipo de resíduo</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scan Frame Overlay */}
            {!result && !scanning && selectedImage && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!result && (
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCameraCapture}
                  disabled={scanning}
                  className="flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  <Camera className="w-5 h-5" />
                  <span>{t('takePhoto')}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={scanning}
                  className="flex items-center justify-center space-x-2 py-4 bg-white text-green-600 border-2 border-green-500 rounded-xl font-semibold hover:bg-green-50 transition-all disabled:opacity-50"
                >
                  <Upload className="w-5 h-5" />
                  <span>{t('uploadImage')}</span>
                </motion.button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
        </motion.div>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Result Header */}
              <div className={`p-6 ${result.recyclable ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">{result.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{result.name}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        {result.recyclable ? (
                          <CheckCircle className="w-5 h-5 text-green-200" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-200" />
                        )}
                        <span className="text-white/90">
                          {result.recyclable ? t('recyclable') : t('notRecyclable')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/80">Confiança</div>
                    <div className="text-2xl font-bold text-white">{result.confidence}%</div>
                  </div>
                </div>
              </div>

              {/* Result Details */}
              <div className="p-6 space-y-6">
                {/* Disposal Info */}
                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <div 
                    className="w-12 h-12 rounded-xl mr-4 flex items-center justify-center text-white font-bold"
                    style={{ 
                      backgroundColor: result.color === 'Vermelho' ? '#ef4444' :
                                       result.color === 'Azul' ? '#3b82f6' :
                                       result.color === 'Verde' ? '#22c55e' :
                                       result.color === 'Amarelo' ? '#eab308' :
                                       result.color === 'Marrom' ? '#92400e' :
                                       '#f97316'
                    }}
                  >
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t('howToDispose')}</h3>
                    <p className="text-gray-600">{result.bin}</p>
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-500" />
                    Dicas de Descarte
                  </h3>
                  <ul className="space-y-2">
                    {result.tips.map((tip, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rewards Earned */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Recompensas Ganhas</h3>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">XP</p>
                        <p className="font-bold text-purple-600">+{result.xp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🪙</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">EcoCoins</p>
                        <p className="font-bold text-yellow-600">+{result.coins}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nearby Collection Points */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                    Pontos de Coleta Próximos
                  </h3>
                  <div className="space-y-2">
                    {nearbyCollectionPoints.map((point, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{point.name}</p>
                          <p className="text-sm text-gray-500">{point.distance}</p>
                        </div>
                        <button className="text-green-600 text-sm font-medium hover:text-green-700">
                          Ver no mapa
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetScanner}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Escanear Outro Item
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-3 px-6 bg-white text-green-600 border-2 border-green-500 rounded-xl font-semibold hover:bg-green-50 transition-all"
                  >
                    Compartilhar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-green-600">127</div>
            <div className="text-sm text-gray-500">Itens Escaneados</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-blue-600">89%</div>
            <div className="text-sm text-gray-500">Precisão Média</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-purple-600">45kg</div>
            <div className="text-sm text-gray-500">CO₂ Evitado</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Scanner;
