package com.example.Purse.service;

import com.example.Purse.dto.BalanceRequest;
import com.example.Purse.dto.TransactionRequest;
import com.example.Purse.entity.Transaction;
import com.example.Purse.entity.Users;
import com.example.Purse.repository.TransactionRepository;
import com.example.Purse.repository.UsersRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UsersRepository usersRepository;

    public Transaction createIncome(Long userId, TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setAmount(request.getAmount());
        transaction.setType("INCOME");
        transaction.setDescription(request.getDescription());

        return transactionRepository.save(transaction);
    }

    public Transaction createExpense(Long userId, TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setAmount(request.getAmount().negate());
        transaction.setType("EXPENSE");
        transaction.setDescription(request.getDescription());

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long userId, Long transactionId) {
        // Ищем транзакцию по ID и UserId (проверяем что пользователь удаляет свою транзакцию)
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found or access denied"));

        // Удаляем транзакцию
        transactionRepository.delete(transaction);
    }

    public Users setInitialBalance(Long userId, BalanceRequest request) {
        // 1. Находим пользователя по ID
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Устанавливаем новый баланс
        user.setBalance(request.getBalance());

        // 3. Сохраняем пользователя с новым балансом
        return usersRepository.save(user);
    }

    public BigDecimal calculateCurrentBalance(Long userId) {
        // 1. Получаем начальный баланс пользователя
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        BigDecimal initialBalance = user.getBalance();

        // 2. Получаем все транзакции пользователя
        List<Transaction> transactions = transactionRepository.findByUserId(userId);

        // 3. Считаем сумму всех транзакций
        BigDecimal transactionsSum = transactions.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Итоговый баланс = начальный баланс + сумма транзакций
        BigDecimal currentBalance = initialBalance.add(transactionsSum);

        // 5. Баланс не может быть меньше 0
        return currentBalance.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : currentBalance;
    }
}