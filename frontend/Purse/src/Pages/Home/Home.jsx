import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const HomePage = () => {
  const navigate = useNavigate()
  const [balance, setBalance] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formType, setFormType] = useState('') // 'income' или 'expense'
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: 'Зарплата',
      amount: 0,
      type: 'income',
      date: '2024-01-15',
    },
    {
      id: 2,
      name: 'Продукты',
      amount: 0,
      type: 'expense',
      date: '2024-01-14',
    },
    { id: 3, name: 'Кафе', amount: 0, type: 'expense', date: '2024-01-13' },
    {
      id: 4,
      name: 'Фриланс',
      amount: 0,
      type: 'income',
      date: '2024-01-12',
    },
  ])
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    amount: '',
    type: '',
  })

  const handleLogout = () => {
    navigate('/')
  }

  const handleAddTransaction = (type) => {
    setFormType(type)
    setShowAddForm(true)
    setNewTransaction({ name: '', amount: '', type: type })
  }

  const handleSubmitTransaction = (e) => {
    e.preventDefault()
    if (!newTransaction.name || !newTransaction.amount) return

    const transaction = {
      id: Date.now(),
      name: newTransaction.name,
      amount: parseFloat(newTransaction.amount),
      type: formType,
      date: new Date().toISOString().split('T')[0],
    }

    setTransactions([transaction, ...transactions])

    // Обновляем баланс
    if (formType === 'income') {
      setBalance(balance + transaction.amount)
    } else {
      setBalance(balance - transaction.amount)
    }

    setShowAddForm(false)
    setNewTransaction({ name: '', amount: '', type: '' })
  }

  const handleDeleteTransaction = (id, amount, type) => {
    setTransactions(transactions.filter((t) => t.id !== id))

    // Обновляем баланс
    if (type === 'income') {
      setBalance(balance - amount)
    } else {
      setBalance(balance + amount)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(amount)
  }

  return (
    <div className="home-page">
      {/* Шапка */}
      <header className="home-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Purse 💰</h1>
            <p>Ваш финансовый помощник</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Выйти
          </button>
        </div>
      </header>

      <main className="home-main">
        {/* Карточка баланса */}
        <div className="balance-card">
          <div className="balance-header">
            <h2>Общий баланс</h2>
            <div className="balance-amount">{formatCurrency(balance)}</div>
          </div>
          <div className="balance-stats">
            <div className="stat-item">
              <span className="stat-label">Доходы</span>
              <span className="stat-amount income">
                +
                {formatCurrency(
                  transactions
                    .filter((t) => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0),
                )}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Расходы</span>
              <span className="stat-amount expense">
                -
                {formatCurrency(
                  transactions
                    .filter((t) => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0),
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки добавления */}
        <div className="action-buttons">
          <button
            className="action-btn income-btn"
            onClick={() => handleAddTransaction('income')}
          >
            <span className="btn-icon">+</span>
            <span>Добавить доход</span>
          </button>
          <button
            className="action-btn expense-btn"
            onClick={() => handleAddTransaction('expense')}
          >
            <span className="btn-icon">-</span>
            <span>Добавить расход</span>
          </button>
        </div>

        {/* Форма добавления транзакции */}
        {showAddForm && (
          <div className="add-form-overlay">
            <div className="add-form">
              <h3>
                {formType === 'income' ? 'Добавить доход' : 'Добавить расход'}
              </h3>
              <form onSubmit={handleSubmitTransaction}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Название"
                    value={newTransaction.name}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        name: e.target.value,
                      })
                    }
                    required
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
                    Добавить
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Список транзакций */}
        <div className="transactions-section">
          <div className="section-header">
            <h3>Последние транзакции</h3>
            <button className="view-all-btn">Посмотреть всю историю</button>
          </div>

          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-name">{transaction.name}</div>
                  <div className="transaction-date">{transaction.date}</div>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDeleteTransaction(
                      transaction.id,
                      transaction.amount,
                      transaction.type,
                    )
                  }
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
