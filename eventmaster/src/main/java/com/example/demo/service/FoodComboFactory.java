// File: com.example.demo.service.FoodComboFactory.java

package com.example.demo.service;

import com.example.demo.model.FoodCombo;
import org.springframework.stereotype.Component;

@Component
public class FoodComboFactory {
    private final FoodComboRegistry registry;

    public FoodComboFactory(FoodComboRegistry registry) {
        this.registry = registry;
    }

    public FoodCombo createCombo(Long comboId) {
        return registry.getPrototype(comboId);
    }
}
