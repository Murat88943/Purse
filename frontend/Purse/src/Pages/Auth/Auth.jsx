import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Auth.css'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  })
  const navigate = useNavigate()

  // Базовый URL для API
  const API_BASE_URL = 'http://localhost:8080/api'

  // Создаем axios instance с настройками
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно'
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Подтверждение пароля обязательно'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async () => {
    try {
      const response = await api.post('/auth/register', {
        username: formData.username,
        password: formData.password,
      })

      if (response.status === 200) {
        return response.data.userId
      }
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data)
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error(
          'Нет соединения с сервером. Проверьте запущен ли бэкенд.',
        )
      } else {
        throw new Error('Ошибка при регистрации. Попробуйте снова.')
      }
    }
  }

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', {
        username: formData.username,
        password: formData.password,
      })

      if (response.status === 200) {
        const userData = response.data

        // Сохраняем данные пользователя в localStorage
        const userStorage = {
          userId: userData.id,
          username: userData.username,
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem('user', JSON.stringify(userStorage))

        return userData
      }
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Неверное имя пользователя или пароль')
      } else if (error.response?.data) {
        throw new Error(error.response.data)
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error(
          'Нет соединения с сервером. Проверьте запущен ли бэкенд.',
        )
      } else {
        throw new Error('Ошибка при входе. Попробуйте снова.')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      let result
      if (isLogin) {
        // Логин
        result = await handleLogin()
        alert('Вход выполнен успешно!')
      } else {
        // Регистрация
        result = await handleRegister()
        alert('Регистрация прошла успешно!')

        // После регистрации автоматически логинимся
        if (result) {
          await handleLogin()
        }
      }

      // Перенаправление на /home после успешной аутентификации
      navigate('/home')

      // Сброс формы
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Ошибка аутентификации:', error)
      setErrors({ submit: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
    })
  }

  return (
    <div className="auth-page">
      {/* Левая часть - декоративная */}
      <div className="auth-hero">
        <div className="hero-content">
          <div className="logo">
            <div className="logo-icon">💰</div>
            <h1>Purse</h1>
          </div>
          <h2>Управляйте своими финансами</h2>
          <p>
            Присоединяйтесь к нашему сервису для удобного учета доходов и
            расходов
          </p>
          <div className="features">
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Учет финансов</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Простота</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Безопасность</span>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть - форма */}
      <div className="auth-section">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>{isLogin ? 'Вход в систему' : 'Регистрация'}</h2>
              <p className="auth-subtitle">
                {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Имя пользователя</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Введите имя пользователя"
                  className={`modern-input ${errors.username ? 'error' : ''}`}
                />
                {errors.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Минимум 6 символов"
                  minLength="6"
                  className={`modern-input ${errors.password ? 'error' : ''}`}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Подтвердите пароль</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="Повторите пароль"
                    minLength="6"
                    className={`modern-input ${
                      errors.confirmPassword ? 'error' : ''
                    }`}
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              )}

              {/* Общая ошибка */}
              {errors.submit && (
                <div className="error-message submit-error">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                className="submit-btn modern-btn"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Загрузка...'
                  : isLogin
                  ? 'Войти'
                  : 'Зарегистрироваться'}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                {isLogin ? 'Еще нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                <button
                  className="switch-link"
                  onClick={switchMode}
                  type="button"
                >
                  {isLogin ? 'Зарегистрироваться' : 'Войти'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
