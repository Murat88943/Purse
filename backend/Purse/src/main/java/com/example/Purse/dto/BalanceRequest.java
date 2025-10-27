package com.example.Purse.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BalanceRequest {
    private BigDecimal balance;
}