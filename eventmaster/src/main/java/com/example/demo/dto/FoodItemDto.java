package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FoodItemDto {
    private Long id;
    private String name;
    private String description;
    private double price;
    private String imagePath;
}