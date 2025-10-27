package com.example.Purse.controllers;

import com.example.Purse.dto.TransactionRequest;
import com.example.Purse.entity.Transaction;
import com.example.Purse.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}