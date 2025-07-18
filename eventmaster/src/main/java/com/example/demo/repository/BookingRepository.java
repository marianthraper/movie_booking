package com.example.demo.repository;

import com.example.demo.model.Booking;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @EntityGraph(attributePaths = {"event"}) // This ensures event data is loaded
    List<Booking> findByUserId(Long userId);
    List<Booking> findByEventId(Long eventId);
}