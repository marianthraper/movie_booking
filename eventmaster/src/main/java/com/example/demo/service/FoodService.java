package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodService {
    private final FoodOrderRepository foodOrderRepository;
    private final FoodItemRepository foodItemRepository;
    private final BookingRepository bookingRepository;
    private final FoodComboRepository foodComboRepository;
    private final FoodComboFactory foodComboFactory;
    public FoodService(FoodOrderRepository foodOrderRepository, 
                     FoodItemRepository foodItemRepository,
                     BookingRepository bookingRepository,
                     FoodComboRepository foodComboRepository,
                     FoodComboFactory foodComboFactory) {
        this.foodOrderRepository = foodOrderRepository;
        this.foodItemRepository = foodItemRepository;
        this.bookingRepository = bookingRepository;
        this.foodComboRepository = foodComboRepository;
        this.foodComboFactory = foodComboFactory;
    }

    public List<FoodItemDto> getAllFoodItems() {
        return foodItemRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public List<FoodComboDto> getAllFoodCombos() {
        List<FoodCombo> combos = foodComboRepository.findAllWithItems();  
        return combos.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public void createFoodOrder(FoodOrderRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
            .orElseThrow(() -> new RuntimeException("Booking not found"));
            
        FoodOrder foodOrder = new FoodOrder();
        foodOrder.setBooking(booking);
        
        // Process individual items
        List<FoodOrderItem> items = request.getItems().stream()
            .map(itemRequest -> createOrderItem(itemRequest, foodOrder))
            .collect(Collectors.toList());
        
        // Process combo items using prototype pattern
        if (request.getCombos() != null) {
            request.getCombos().forEach(comboRequest -> {

                FoodCombo orderCombo = foodComboFactory.createCombo(comboRequest.getComboId());

                // FoodCombo comboPrototype = foodComboRepository.findByIdWithItems(comboRequest.getComboId())
                //     .orElseThrow(() -> new RuntimeException("Combo not found"));
                
                // // Clone the prototype for this order
                // FoodCombo orderCombo = comboPrototype.clone();
                
                // Create order items from the cloned combo
                orderCombo.getItems().forEach(foodItem -> {
                    FoodOrderItem orderItem = new FoodOrderItem();
                    orderItem.setFoodItem(foodItem);
                    orderItem.setQuantity(comboRequest.getQuantity());
                    orderItem.setPrice(foodItem.getPrice() * (1 - orderCombo.getDiscount()/100));
                    orderItem.setOrder(foodOrder);
                    orderItem.setComboId(orderCombo.getId());
                    items.add(orderItem);
                });
            });
        }
            
        foodOrder.setItems(items);
        foodOrder.setTotalPrice(calculateTotalPrice(items));
        foodOrderRepository.save(foodOrder);
    }

    private double calculateTotalPrice(List<FoodOrderItem> items) {
        return items.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
    }

    private FoodOrderItem createOrderItem(FoodItemRequest itemRequest, FoodOrder order) {
        FoodItem foodItem = foodItemRepository.findById(itemRequest.getFoodItemId())
            .orElseThrow(() -> new RuntimeException("Food item not found"));
        
        FoodOrderItem orderItem = new FoodOrderItem();
        orderItem.setFoodItem(foodItem);
        orderItem.setQuantity(itemRequest.getQuantity());
        orderItem.setPrice(foodItem.getPrice());
        orderItem.setOrder(order);
        return orderItem;
    }

    private FoodItemDto convertToDto(FoodItem foodItem) {
        FoodItemDto dto = new FoodItemDto();
        dto.setId(foodItem.getId());
        dto.setName(foodItem.getName());
        dto.setDescription(foodItem.getDescription());
        dto.setPrice(foodItem.getPrice());
        dto.setImagePath(foodItem.getImagePath());
        return dto;
    }

    private FoodComboDto convertToDto(FoodCombo combo) {
        FoodComboDto dto = new FoodComboDto();
        dto.setId(combo.getId());
        dto.setName(combo.getName());
        dto.setDescription(combo.getDescription());
        dto.setImagePath(combo.getImagePath());
        dto.setDiscount(combo.getDiscount());
        dto.setTotalPrice(combo.getTotalPrice());
        dto.setItems(combo.getItems().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList()));
        return dto;
    }
}