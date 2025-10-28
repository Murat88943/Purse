import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Home.css'

const HomePage = () => {
  const navigate = useNavigate()
  const [balance, setBalance] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showBalanceForm, setShowBalanceForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [formType, setFormType] = useState('')
  const [transactions, setTransactions] = useState([])
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
  })
  const [initialBalance, setInitialBalance] = useState('')
  const [balancePulse, setBalancePulse] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const API_BASE_URL = 'http://localhost:8080/api'
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user.userId

  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  })

  useEffect(() => {
    if (!userId) {
      navigate('/')
      return
    }
    loadBalance()
  }, [userId, navigate])

  const loadBalance = async () => {
    try {
      const response = await api.get('/transactions/balance', {
        headers: { 'User-ID': userId },
      })
      setBalance(response.data)
    } catch (error) {
      console.error('Ошибка загрузки баланса:', error)
    }
  }

  const loadTransactions = async () => {
    try {
      const response = await api.get('/transactions/history', {
        headers: { 'User-ID': userId },
      })
      setTransactions(response.data)
    } catch (error) {
      console.error('Ошибка загрузки транзакций:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleAddTransaction = (type) => {
    setFormType(type)
    setShowAddForm(true)
    setNewTransaction({ description: '', amount: '' })
  }

  const handleSetBalance = async (e) => {
    e.preventDefault()

    const amount = parseFloat(initialBalance)
    if (isNaN(amount) || amount < 0) {
      alert('Пожалуйста, введите корректную сумму')
      return
    }

    setIsLoading(true)

    try {
      await api.post(
        '/transactions/set/balance',
        {
          balance: amount,
        },
        {
          headers: { 'User-ID': userId },
        },
      )

      await loadBalance()
      setShowBalanceForm(false)
      setInitialBalance('')
      alert('Баланс установлен!')
    } catch (error) {
      console.error('Ошибка установки баланса:', error)
      alert('Ошибка установки баланса')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitTransaction = async (e) => {
    e.preventDefault()

    if (!newTransaction.description.trim() || !newTransaction.amount) {
      alert('Пожалуйста, заполните все поля')
      return
    }

    const amount = parseFloat(newTransaction.amount)
    if (isNaN(amount) || amount <= 0) {
      alert('Пожалуйста, введите корректную сумму')
      return
    }

    setIsLoading(true)

    try {
      const endpoint =
        formType === 'income' ? '/transactions/income' : '/transactions/expense'

      await api.post(
        endpoint,
        {
          amount: amount,
          description: newTransaction.description.trim(),
        },
        {
          headers: { 'User-ID': userId },
        },
      )

      await loadBalance()
      setShowAddForm(false)
      setNewTransaction({ description: '', amount: '' })
      alert('Транзакция добавлена!')
    } catch (error) {
      console.error('Ошибка добавления транзакции:', error)
      alert('Ошибка добавления транзакции')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      return
    }

    try {
      await api.delete(`/transactions/delete/${id}`, {
        headers: { 'User-ID': userId },
      })

      await loadTransactions()
      await loadBalance()
      alert('Транзакция удалена!')
    } catch (error) {
      console.error('Ошибка удаления транзакции:', error)
      alert('Ошибка удаления транзакции')
    }
  }

  const handleShowHistory = async () => {
    await loadTransactions()
    setShowHistory(true)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Purse 💰</h1>
          </div>
          <div className="header-actions">
            <button
              className="balance-btn"
              onClick={() => setShowBalanceForm(true)}
              title="Установить начальный баланс"
            >
              💵 Баланс
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="home-main">
        {/* Карточка с балансом и статистикой */}
        <div className={`balance-card ${balancePulse ? 'pulse' : ''}`}>
          <div className="balance-header">
            <h2>ОБЩИЙ БАЛАНС</h2>
            <div className="balance-amount">{formatCurrency(balance)}</div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="action-buttons">
          <button
            className="action-btn income-btn"
            onClick={() => handleAddTransaction('income')}
            disabled={isLoading}
          >
            <span className="btn-icon">+</span>
            <span>Доход</span>
          </button>

          <button
            className="action-btn expense-btn"
            onClick={() => handleAddTransaction('expense')}
            disabled={isLoading}
          >
            <span className="btn-icon">-</span>
            <span>Расход</span>
          </button>
        </div>

        {/* Центральная кнопка истории */}
        <div className="history-section">
          <button className="history-btn" onClick={handleShowHistory}>
            📊 История транзакций
          </button>
        </div>

        {/* Форма установки баланса */}
        {showBalanceForm && (
          <div
            className="modal-overlay"
            onClick={() => setShowBalanceForm(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>💵 Установить начальный баланс</h3>
              <form onSubmit={handleSetBalance}>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Сумма в рублях"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    autoFocus
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowBalanceForm(false)}
                    className="cancel-btn"
                  >
                    Отмена
                  </button>
                  <button type="submit" className="submit-btn">
                    Установить
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Форма добавления транзакции */}
        {showAddForm && (
          <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>
                {formType === 'income'
                  ? '➕ Добавить доход'
                  : '➖ Добавить расход'}
              </h3>
              <form onSubmit={handleSubmitTransaction}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Описание"
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                    }
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Сумма"
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        amount: e.target.value,
                      })
                    }
                    required
                    min="1"
                    step="0.01"
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="cancel-btn"
                  >
                    Отмена
                  </button>
                  <button type="submit" className="submit-btn">
                    {formType === 'income'
                      ? 'Добавить доход'
                      : 'Добавить расход'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Модальное окно истории транзакций */}
        {showHistory && (
          <div
            className="modal-overlay history-overlay"
            onClick={() => setShowHistory(false)}
          >
            <div
              className="modal history-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="history-header">
                <h3>📊 История транзакций</h3>
                <button
                  className="close-history-btn"
                  onClick={() => setShowHistory(false)}
                >
                  ✕
                </button>
              </div>

              <div className="transactions-list">
                {transactions.length === 0 ? (
                  <div className="no-transactions">
                    <p>Транзакций пока нет</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`transaction-item ${
                        transaction.type === 'INCOME' ? 'income' : 'expense'
                      }`}
                    >
                      <div className="transaction-info">
                        <div className="transaction-name">
                          {transaction.description}
                        </div>
                        <div className="transaction-date">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                      <div className="transaction-amount">
                        <span
                          className={`amount ${
                            transaction.type === 'INCOME'
                              ? 'positive'
                              : 'negative'
                          }`}
                        >
                          {transaction.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </span>
                        <button
                          className="delete-transaction-btn"
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                          title="Удалить транзакцию"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="history-summary">
                <div className="summary-item">
                  <span>Всего доходов:</span>
                  <span className="positive">
                    +{formatCurrency(totalIncome)}
                  </span>
                </div>
                <div className="summary-item">
                  <span>Всего расходов:</span>
                  <span className="negative">
                    -{formatCurrency(totalExpenses)}
                  </span>
                </div>
                <div className="summary-item total">
                  <span>Текущий баланс:</span>
                  <span className={balance >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(balance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default HomePage
