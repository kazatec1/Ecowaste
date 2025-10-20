import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Leaf, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import SEOHead from './SEOHead'

const Login = () => {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  
  // Refs para gerenciamento de foco
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const nameRef = useRef(null)
  const submitRef = useRef(null)

  // Focar no primeiro campo quando o componente monta
  useEffect(() => {
    if (isLogin) {
      emailRef.current?.focus()
    } else {
      nameRef.current?.focus()
    }
  }, [isLogin])

  // Validação de formulário
  const validateForm = () => {
    const newErrors = {}

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Focar no primeiro campo com erro
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField === 'name') nameRef.current?.focus()
      else if (firstErrorField === 'email') emailRef.current?.focus()
      else if (firstErrorField === 'password') passwordRef.current?.focus()
      return
    }

    setLoading(true)
    setErrors({})
    setSuccessMessage('')

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        setSuccessMessage('Login realizado com sucesso!')
        setTimeout(() => navigate('/'), 1000)
      } else {
        await register(formData.name, formData.email, formData.password)
        setSuccessMessage('Conta criada com sucesso!')
        setTimeout(() => navigate('/'), 1000)
      }
    } catch (error) {
      setErrors({ submit: error.message })
      // Anunciar erro para leitores de tela
      const errorAnnouncement = document.createElement('div')
      errorAnnouncement.setAttribute('aria-live', 'assertive')
      errorAnnouncement.setAttribute('aria-atomic', 'true')
      errorAnnouncement.className = 'sr-only'
      errorAnnouncement.textContent = `Erro: ${error.message}`
      document.body.appendChild(errorAnnouncement)
      setTimeout(() => document.body.removeChild(errorAnnouncement), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ name: '', email: '', password: '' })
    setErrors({})
    setSuccessMessage('')
  }

  // Componente de campo de entrada acessível
  const InputField = ({ 
    id, 
    name, 
    type, 
    label, 
    placeholder, 
    icon: Icon, 
    ref, 
    required = true,
    autoComplete,
    ...props 
  }) => {
    const hasError = errors[name]
    const fieldId = `${name}-field`
    const errorId = `${name}-error`
    const descriptionId = `${name}-description`

    return (
      <div className="space-y-2">
        <label 
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="obrigatório">*</span>}
        </label>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon 
              className={`h-5 w-5 ${hasError ? 'text-red-400' : 'text-gray-400'}`}
              aria-hidden="true"
            />
          </div>
          
          <input
            id={fieldId}
            name={name}
            type={type}
            ref={ref}
            value={formData[name]}
            onChange={handleInputChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? errorId : descriptionId}
            className={`
              block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
              ${hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
              }
            `}
            {...props}
          />
          
          {name === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
        
        {hasError && (
          <div 
            id={errorId}
            className="flex items-center text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
            {hasError}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <SEOHead 
        title={isLogin ? "Login" : "Criar Conta"}
        description="Acesse sua conta EcoWaste Green e comece a transformar resíduos em recompensas."
        path="/login"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto h-20 w-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6"
            >
              <Leaf className="h-10 w-10 text-white" aria-hidden="true" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              EcoWaste Green
            </h1>
            <p className="text-lg text-gray-600">
              {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
            </p>
          </div>

          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Mensagem de sucesso */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" aria-hidden="true" />
                  <span className="text-green-700">{successMessage}</span>
                </div>
              </motion.div>
            )}

            {/* Erro geral */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                role="alert"
                aria-live="assertive"
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" aria-hidden="true" />
                  <span className="text-red-700">{errors.submit}</span>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Campo Nome (apenas no registro) */}
              {!isLogin && (
                <InputField
                  id="name"
                  name="name"
                  type="text"
                  label="Nome completo"
                  placeholder="Digite seu nome"
                  icon={Mail}
                  ref={nameRef}
                  autoComplete="name"
                />
              )}

              {/* Campo Email */}
              <InputField
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="Digite seu email"
                icon={Mail}
                ref={emailRef}
                autoComplete="email"
              />

              {/* Campo Senha */}
              <InputField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Senha"
                placeholder="Digite sua senha"
                icon={Lock}
                ref={passwordRef}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />

              {/* Botão Submit */}
              <motion.button
                ref={submitRef}
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`
                  w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                  }
                `}
                aria-describedby={loading ? "loading-description" : undefined}
              >
                {loading ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span id="loading-description">
                      {isLogin ? 'Entrando...' : 'Criando conta...'}
                    </span>
                  </>
                ) : (
                  <span>{isLogin ? 'Entrar' : 'Criar conta'}</span>
                )}
              </motion.button>
            </form>

            {/* Toggle entre login e registro */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                {' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:underline"
                >
                  {isLogin ? 'Criar conta' : 'Fazer login'}
                </button>
              </p>
            </div>
          </motion.div>

          {/* Informações adicionais */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-gray-500"
          >
            <p>
              Ao continuar, você concorda com nossos{' '}
              <a href="#" className="text-green-600 hover:text-green-500 focus:outline-none focus:underline">
                Termos de Uso
              </a>
              {' '}e{' '}
              <a href="#" className="text-green-600 hover:text-green-500 focus:outline-none focus:underline">
                Política de Privacidade
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default Login
