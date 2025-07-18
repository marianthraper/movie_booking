package com.example.demo.service;

import com.example.demo.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatAvailabilityService {

    private final BookingRepository bookingRepository;

    @Autowired
    public SeatAvailabilityService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<String> getBookedSeatsForEvent(Long eventId) {
        return bookingRepository.findByEventId(eventId)
                .stream()
                .filter(booking -> booking.getSeatNumbers() != null)
                .flatMap(booking -> Arrays.stream(booking.getSeatNumbers().split(",")))
                .map(String::trim)
                .collect(Collectors.toList());
    }

    public boolean isSeatAvailable(Long eventId, String seatNumber) {
        return !getBookedSeatsForEvent(eventId).contains(seatNumber);
    }
}
