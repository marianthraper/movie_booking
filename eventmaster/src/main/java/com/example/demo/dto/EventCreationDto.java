package com.example.demo.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class EventCreationDto {
    @NotBlank(message = "Event name is required")
    private String name;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @Future(message = "Event date must be in the future")
    private LocalDate date;
    
    @Positive(message = "Price must be positive")
    private double price;
    
    private String imagePath;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}