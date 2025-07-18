package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "food_combos")
@Getter @Setter
public class FoodCombo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private String imagePath;
    private double discount; // percentage discount
    
    @ManyToMany
    @JoinTable(
        name = "combo_items",
        joinColumns = @JoinColumn(name = "combo_id"),
        inverseJoinColumns = @JoinColumn(name = "food_item_id")
    )
    private List<FoodItem> items;
    
    // Prototype pattern implementation
    public FoodCombo clone() {
        FoodCombo clone = new FoodCombo();
        //clone.setId(this.id);
        clone.setName(this.name);
        clone.setDescription(this.description);
        clone.setDiscount(this.discount);
        clone.setImagePath(this.imagePath);
        clone.setItems(new ArrayList<>(this.items)); // Shallow copy is okay for items
        return clone;
    }

    // Calculates the discounted price
    public double getTotalPrice() {
        if (items == null || items.isEmpty()) {
            return 0.0;
        }
        double sum = items.stream().mapToDouble(FoodItem::getPrice).sum();
        return sum * (1 - discount/100);
    }
}