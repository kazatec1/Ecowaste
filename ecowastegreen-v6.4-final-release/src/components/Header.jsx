import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Scan, 
  Coins, 
  Users, 
  ShoppingBag, 
  User, 
  LogOut, 
  Settings,
  Menu,
  X,
  Globe
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const Header = () => {
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  
  const userMenuRef = useRef(null)
  const languageMenuRef = useRef(null)
  const mobileMenuRef = useRef(null)

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fechar menus com ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
        setIsLanguageMenuOpen(false)
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [])

  const navigationItems = [
    { path: '/', icon: Home, label: t('dashboard'), ariaLabel: 'Ir para o dashboard' },
    { path: '/scanner', icon: Scan, label: t('scanner'), ariaLabel: 'Abrir scanner de IA' },
    { path: '/blockchain', icon: Coins, label: t('blockchain'), ariaLabel: 'Acessar carteira blockchain' },
    { path: '/community', icon: Users, label: t('community'), ariaLabel: 'Entrar na comunidade' },
    { path: '/marketplace', icon: ShoppingBag, label: t('marketplace'), ariaLabel: 'Visitar marketplace' }
  ]

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ]

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode)
    setIsLanguageMenuOpen(false)
    // Anunciar mudança para leitores de tela
    const announcement = `Idioma alterado para ${languages.find(l => l.code === langCode)?.name}`
    const ariaLive = document.createElement('div')
    ariaLive.setAttribute('aria-live', 'polite')
    ariaLive.setAttribute('aria-atomic', 'true')
    ariaLive.className = 'sr-only'
    ariaLive.textContent = announcement
    document.body.appendChild(ariaLive)
    setTimeout(() => document.body.removeChild(ariaLive), 1000)
  }

  const NavLink = ({ item, isMobile = false }) => {
    const isActive = location.pathname === item.path
    const Icon = item.icon

    return (
      <Link
        to={item.path}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          ${isActive 
            ? 'bg-green-100 text-green-700 shadow-sm' 
            : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
          }
          ${isMobile ? 'w-full justify-start' : ''}
        `}
        aria-label={item.ariaLabel}
        aria-current={isActive ? 'page' : undefined}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <Icon 
          className="w-5 h-5" 
          aria-hidden="true"
        />
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <header 
      className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50"
      role="banner"
    >
      <nav 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Navegação principal"
      >
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg"
            aria-label="EcoWaste Green - Ir para página inicial"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg" aria-hidden="true">E</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">EcoWaste Green</h1>
              <p className="text-xs text-gray-500">V6.1 Ultimate</p>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          {/* Controles do usuário */}
          <div className="flex items-center space-x-4">
            {/* Seletor de idioma */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Selecionar idioma"
                aria-expanded={isLanguageMenuOpen}
                aria-haspopup="true"
              >
                <Globe className="w-5 h-5" aria-hidden="true" />
                <span className="hidden sm:inline">
                  {languages.find(l => l.code === language)?.flag}
                </span>
              </button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                    role="menu"
                    aria-label="Opções de idioma"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`
                          w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                          ${language === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'}
                        `}
                        role="menuitem"
                        aria-current={language === lang.code ? 'true' : undefined}
                      >
                        <span className="mr-3" aria-hidden="true">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu do usuário */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label={`Menu do usuário ${user?.name}`}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm" aria-hidden="true">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="hidden sm:inline text-gray-700 font-medium">
                  {user?.name}
                </span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                    role="menu"
                    aria-label="Menu do usuário"
                  >
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 flex items-center space-x-2"
                      role="menuitem"
                    >
                      <User className="w-4 h-4" aria-hidden="true" />
                      <span>Perfil</span>
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 flex items-center space-x-2"
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4" aria-hidden="true" />
                      <span>{t('settings')}</span>
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50 flex items-center space-x-2"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      <span>{t('logout')}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botão menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Abrir menu de navegação"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
              role="menu"
              aria-label="Menu de navegação mobile"
            >
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <NavLink key={item.path} item={item} isMobile={true} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Header
