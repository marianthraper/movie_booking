package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.FoodService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/api/food")
public class FoodController {
    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping
    public List<FoodItemDto> getAllFoodItems() {
        return foodService.getAllFoodItems();
    }

    @PostMapping("/order")
public ResponseEntity<String> createFoodOrder(@RequestBody FoodOrderRequest request) {
    try {
        foodService.createFoodOrder(request);
        return ResponseEntity.ok("Food order created successfully");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
               .body("Error creating food order: " + e.getMessage());
    }
}

    @GetMapping("/combos")
    public List<FoodComboDto> getAllFoodCombos() {
        return foodService.getAllFoodCombos();
    }
}