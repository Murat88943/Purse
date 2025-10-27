package com.example.Purse.controllers;

import com.example.Purse.dto.AuthRequest;
import com.example.Purse.entity.Users;
import com.example.Purse.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<Long> login(@RequestBody AuthRequest request) {
        Optional<Users> user = authService.authenticate(request);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get().getId()); // возвращаем ID пользователя
        }
        return ResponseEntity.status(401).build(); // Unauthorized
    }
}