package com.example.demo.commands;
import com.example.demo.model.FoodOrder;
import com.example.demo.model.Booking;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.FoodOrderRepository;
import org.springframework.transaction.annotation.Transactional;

public class CancelBookingCommand implements BookingCommand {
    private final Booking booking;
    private final BookingRepository bookingRepository;
    private final FoodOrderRepository foodOrderRepository;

    public CancelBookingCommand(Booking booking, 
                              BookingRepository bookingRepository,
                              FoodOrderRepository foodOrderRepository) {
        this.booking = booking;
        this.bookingRepository = bookingRepository;
        this.foodOrderRepository = foodOrderRepository;
    }

    @Override
    @Transactional
    public void execute() {
        // First find and delete all food order items for this booking
        FoodOrder foodOrder = foodOrderRepository.findByBookingId(booking.getId());
        if (foodOrder != null) {
            // Delete all food order items first
            foodOrderRepository.deleteFoodOrderItemsByOrderId(foodOrder.getId());
            
            // Then delete the food order
            foodOrderRepository.delete(foodOrder);
        }
        
        // Finally delete the booking
        bookingRepository.delete(booking);
    }

    @Override
    public void undo() {
        // Implementation not needed for cancellation
        throw new UnsupportedOperationException("Undo not supported for cancellations");
    }
}