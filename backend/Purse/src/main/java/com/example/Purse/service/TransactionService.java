package com.example.Purse.service;

import com.example.Purse.dto.TransactionRequest;
import com.example.Purse.entity.Transaction;
import com.example.Purse.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;

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
}