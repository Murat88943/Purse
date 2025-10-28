```markdown
# 💰 Purse - Личный финансовый менеджер

Простое и удобное REST API для учета личных финансов.

## 🚀 Быстрый старт

### 1. Регистрация пользователя
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'
```

### 2. Вход в систему
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'
```
*Сохраните полученный ID пользователя*

### 3. Установка начального баланса
```bash
curl -X POST http://localhost:8080/api/transactions/set/balance \
  -H "User-ID: 1" \
  -H "Content-Type: application/json" \
  -d '{"balance": 50000}'
```

### 4. Добавление дохода
```bash
curl -X POST http://localhost:8080/api/transactions/income \
  -H "User-ID: 1" \
  -H "Content-Type: application/json" \
  -d '{"amount": 200, "description": "Подработка"}'
```

### 5. Добавление расхода
```bash
curl -X POST http://localhost:8080/api/transactions/expense \
  -H "User-ID: 1" \
  -H "Content-Type: application/json" \
  -d '{"amount": 150, "description": "Кафе"}'
```

### 6. Проверка баланса
```bash
curl -X GET http://localhost:8080/api/transactions/balance \
  -H "User-ID: 1"
```

### 7. Получение истории транзакций
```bash
curl -X GET http://localhost:8080/api/transactions/history \
  -H "User-ID: 1"
```

### 8. Удаление операции
```bash
curl -X DELETE http://localhost:8080/api/transactions/delete/1 \
  -H "User-ID: 1"
```

## 📊 Пример расчета баланса
```
Начальный баланс: 50000
+ Доход: 200
- Расход: 150
Итоговый баланс: 50050
```

## 🎯 Frontend приложение

### Веб-интерфейс доступен по адресу:
```
http://localhost:5173
```

### Основные возможности фронтенда:
- ✅ **Стеклянный дизайн** (glassmorphism)
- ✅ **Просмотр баланса** в реальном времени
- ✅ **Добавление доходов/расходов** через модальные окна
- ✅ **Полная история транзакций** с фильтрацией
- ✅ **Удаление операций** в один клик
- ✅ **Адаптивный дизайн** для мобильных устройств
- ✅ **Красивая анимация** и интерактивность

### Технологии фронтенда:
- React 18 + Vite
- CSS3 с Glassmorphism эффектами
- Axios для API запросов
- React Router для навигации

## 📋 Полная документация API

### Аутентификация

#### `POST /api/auth/register`
Регистрация нового пользователя
```json
{
  "username": "string",
  "password": "string"
}
```

#### `POST /api/auth/login`
Авторизация пользователя
```json
{
  "username": "string", 
  "password": "string"
}
```

### Транзакции

#### `POST /api/transactions/income`
Добавление дохода
```json
{
  "amount": number,
  "description": "string"
}
```

#### `POST /api/transactions/expense`
Добавление расхода
```json
{
  "amount": number,
  "description": "string"
}
```

#### `GET /api/transactions/balance`
Получение текущего баланса

#### `GET /api/transactions/history`
Получение истории транзакций (сортировка по дате)

#### `DELETE /api/transactions/delete/{id}`
Удаление транзакции по ID

#### `POST /api/transactions/set/balance`
Установка начального баланса
```json
{
  "balance": number
}
```

## ⚙️ Настройка окружения

### Требования:
- Java 17+
- Node.js 16+
- Maven 3.6+

### Запуск backend:
```bash
cd backend
mvn spring-boot:run
```

### Запуск frontend:
```bash
cd frontend
npm install
npm run dev
```

## 🛠 Технологии

### Backend:
- **Java 17** - основной язык
- **Spring Boot 3.5.7** - фреймворк
- **SQLite** - база данных
- **JPA/Hibernate** - ORM
- **Maven** - управление зависимостями
- **Lombok** - сокращение boilerplate кода

### Frontend:
- **React 18** - UI фреймворк
- **Vite** - сборка и dev сервер
- **Axios** - HTTP клиент
- **CSS3** - стили с Glassmorphism

## 🔐 Особенности безопасности

- ✅ **Password Encoding** - пароли хэшируются через BCrypt
- ✅ **User-ID валидация** - проверка прав доступа к операциям
- ✅ **CORS настройка** - разрешены запросы с localhost:5173
- ✅ **Баланс защита** - баланс не может уйти в минус
- ✅ **Валидация данных** - проверка входных параметров

## 📊 База данных

### Таблица Users:
- `id` - первичный ключ
- `username` - уникальное имя пользователя
- `password` - хэшированный пароль
- `balance` - начальный баланс
- `createdAt` - дата создания

### Таблица Transactions:
- `id` - первичный ключ
- `userId` - внешний ключ на пользователя
- `amount` - сумма операции
- `type` - тип операции (INCOME/EXPENSE)
- `description` - описание операции
- `createdAt` - дата создания

## 🐛 Отладка и логи

### Полезные эндпоинты для разработки:
```bash
# Проверка всех пользователей
curl http://localhost:8080/api/debug/users

# Проверка всех транзакций
curl http://localhost:8080/api/debug/transactions
```

### Типичные ошибки и решения:
- **401 Unauthorized** - неверный User-ID заголовок
- **400 Bad Request** - некорректные данные в запросе
- **404 Not Found** - транзакция не найдена или нет доступа

## 📈 Дальнейшее развитие

### Планируемые функции:
- [ ] Категории расходов/доходов
- [ ] Статистика и графики
- [ ] Экспорт данных в CSV
- [ ] Уведомления о низком балансе
- [ ] Мобильное приложение

---

**Purse** - ваш надежный помощник в управлении личными финансами! 💫
```
