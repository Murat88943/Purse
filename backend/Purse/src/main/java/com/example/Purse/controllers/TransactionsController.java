package com.example.Purse.controllers;

import com.example.Purse.dto.BalanceRequest;
import com.example.Purse.dto.TransactionRequest;
import com.example.Purse.entity.Transaction;
import com.example.Purse.entity.Users;
import com.example.Purse.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionsController {

    private final TransactionService transactionService;

    @PostMapping("/income")
    public ResponseEntity<Transaction> createIncome(
            @RequestHeader("User-ID") Long userId,
            @RequestBody TransactionRequest request) {

        Transaction transaction = transactionService.createIncome(userId, request);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/expense")
    public ResponseEntity<Transaction> createExpense(
            @RequestHeader("User-ID") Long userId,
            @RequestBody TransactionRequest request) {

        Transaction transaction = transactionService.createExpense(userId, request);
        return ResponseEntity.ok(transaction);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @RequestHeader("User-ID") Long userId,
            @PathVariable Long id) {

        transactionService.deleteTransaction(userId, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/set/balance")
    public ResponseEntity<Users> setBalance(
            @RequestHeader("User-ID") Long userId,
            @RequestBody BalanceRequest request) {

        Users user = transactionService.setInitialBalance(userId, request);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/balance")
    public ResponseEntity<BigDecimal> getCurrentBalance(
            @RequestHeader("User-ID") Long userId) {

        BigDecimal balance = transactionService.calculateCurrentBalance(userId);
        return ResponseEntity.ok(balance);
    }
    @GetMapping("/history")
    public ResponseEntity<List<Transaction>> getTransactionHistory(
            @RequestHeader("User-ID") Long userId) {

        List<Transaction> transactions = transactionService.getUserTransactions(userId);
        return ResponseEntity.ok(transactions);
    }
}