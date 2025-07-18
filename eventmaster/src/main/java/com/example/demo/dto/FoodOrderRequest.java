package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class FoodOrderRequest {
    private Long bookingId;
    private List<FoodItemRequest> items;
    private List<FoodComboRequest> combos;
}