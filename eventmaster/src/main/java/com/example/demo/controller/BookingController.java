package com.example.demo.controller;

import com.example.demo.model.Booking;
import com.example.demo.service.BookingService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);

    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable Long userId) {
    List<Booking> bookings = bookingService.getBookingsByUser(userId);
    return ResponseEntity.ok(bookings);

    }

    @DeleteMapping("/{id}")
public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
    try {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok().build();
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error cancelling booking: " + e.getMessage());
    }
}
}