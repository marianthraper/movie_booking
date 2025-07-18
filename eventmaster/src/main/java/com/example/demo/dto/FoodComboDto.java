package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class FoodComboDto {
    private Long id;
    private String name;
    private String description;
    private String imagePath;
    private double discount;
    private double totalPrice;
    private List<FoodItemDto> items;
}
 