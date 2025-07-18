package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FoodItemRequest {
    private Long foodItemId;
    private int quantity;
}