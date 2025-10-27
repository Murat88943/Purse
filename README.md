```markdown
# Purse Finance API

Simple REST API for personal finance management.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Transactions  
- `POST /api/transactions/income` - Add income
- `POST /api/transactions/expense` - Add expense
- `DELETE /api/transactions/delete/{id}` - Delete transaction
- `POST /api/transactions/set/balance` - Set initial balance
- `GET /api/transactions/balance` - Get current balance

## Quick Start

1. Register user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
```

2. Login (save user ID):
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
```

3. Set balance:
```bash
curl -X POST http://localhost:8080/api/transactions/set/balance \
  -H "User-ID: 1" \
  -H "Content-Type: application/json" \
  -d '{"balance":50000}'
```

4. Add income:
```bash
curl -X POST http://localhost:8080/api/transactions/income \
  -H "User-ID: 1" \
  -H "Content-Type: application/json" \
  -d '{"amount":200,"description":"Salary"}'
```

5. Add expense:
```bash
curl -X POST http://localhost:8080/api/transactions/expense \
  -H "User-ID: 1" \
  -H "Content-Type: application/json" \
  -d '{"amount":150,"description":"Food"}'
```

6. Check balance:
```bash
curl -X GET http://localhost:8080/api/transactions/balance \
  -H "User-ID: 1"
```

## Features
- User registration and authentication
- Income/expense tracking  
- Balance calculation
- Secure transaction deletion
- Balance protection (no negative values)

## Tech Stack
- Java 25
- Spring Boot 3.5.7
- SQLite database
- JPA/Hibernate
- Maven
```
