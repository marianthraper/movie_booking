package com.example.demo.service;

import com.example.demo.model.FoodCombo;
import com.example.demo.repository.FoodComboRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class FoodComboRegistry {
    private final FoodComboRepository foodComboRepository;
    private final Map<Long, FoodCombo> registry = new HashMap<>();

    public FoodComboRegistry(FoodComboRepository foodComboRepository) {
        this.foodComboRepository = foodComboRepository;
    }

    @PostConstruct
    public void loadPrototypes() {
        foodComboRepository.findAllWithItems()
            .forEach(combo -> registry.put(combo.getId(), combo));
    }

    public FoodCombo getPrototype(Long id) {
        FoodCombo prototype = registry.get(id);
        if (prototype == null) {
            throw new RuntimeException("Prototype not found for id: " + id);
        }
        return prototype.clone();
    }
}
