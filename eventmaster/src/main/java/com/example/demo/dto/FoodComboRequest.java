package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FoodComboRequest {
    private Long comboId;
    private int quantity;
}