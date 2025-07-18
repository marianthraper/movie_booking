package com.example.demo.repository;

import com.example.demo.model.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {
    @Query("SELECT fo FROM FoodOrder fo WHERE fo.booking.id = :bookingId")
    FoodOrder findByBookingId(@Param("bookingId") Long bookingId);

    @Modifying
    @Transactional
    @Query("DELETE FROM FoodOrderItem foi WHERE foi.order.id = :orderId")
    void deleteFoodOrderItemsByOrderId(@Param("orderId") Long orderId);
}