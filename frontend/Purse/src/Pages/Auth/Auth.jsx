import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают!')
      return
    }

    console.log('Отправка данных:', {
      email: formData.email,
      password: formData.password,
      username: formData.username,
    })

    // Перенаправление на /home после успешной отправки
    navigate('/home')

    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
    })
  }

  return (
    <div className="auth-page">
      {/* Левая часть - декоративная */}
      <div className="auth-hero">
        <div className="hero-content">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <h1>Purse</h1>
          </div>
          <h2>Добро пожаловать в наше сообщество</h2>
          <p>
            Присоединяйтесь к тысячам пользователей, которые уже используют наш
            сервис
          </p>
          <div className="features">
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Безопасность</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Скорость</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>Простота</span>
            </div>
          </div>
        </div>
        <div className="floating-elements">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
        </div>
      </div>

      {/* Правая часть - форма */}
      <div className="auth-section">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>{isLogin ? 'С возвращением!' : 'Создать аккаунт'}</h2>
              <p className="auth-subtitle">
                {isLogin
                  ? 'Войдите в свой аккаунт'
                  : 'Зарегистрируйтесь для начала работы'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="username">Имя пользователя</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="Ваше имя"
                    className="modern-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="modern-input"
                />
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
                  className="modern-input"
                />
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
                    className="modern-input"
                  />
                </div>
              )}

              {isLogin && (
                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Запомнить меня
                  </label>
                  <a href="#forgot" className="forgot-link">
                    Забыли пароль?
                  </a>
                </div>
              )}

              <button type="submit" className="submit-btn modern-btn">
                {isLogin ? 'Войти' : 'Создать аккаунт'}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                {isLogin ? 'Еще нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                <button
                  className="switch-link"
                  onClick={() => setIsLogin(!isLogin)}
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
