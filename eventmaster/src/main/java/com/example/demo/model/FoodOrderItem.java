package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "food_order_items")
@Getter @Setter
public class FoodOrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    private FoodOrder order;
    
    @ManyToOne
    @JoinColumn(name = "food_item_id")
    private FoodItem foodItem;

    @Column(name = "combo_id")   
    private Long comboId;  
    
    private int quantity;
    private double price;
}