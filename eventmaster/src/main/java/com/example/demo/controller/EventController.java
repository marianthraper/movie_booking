package com.example.demo.controller; 
import com.example.demo.model.Event;
import com.example.demo.service.BookingService;
import com.example.demo.service.EventService;
import com.example.demo.dto.EventCreationDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {
    private final EventService eventService;
    private final BookingService bookingService;   

    public EventController(EventService eventService, BookingService bookingService) {
        this.eventService = eventService;
        this.bookingService = bookingService;   
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody EventCreationDto dto) {
        Event event = Event.builder()
            .name(dto.getName())
            .location(dto.getLocation())
            .date(dto.getDate())
            .price(dto.getPrice())
            .imagePath(dto.getImagePath())
            .build();
        
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @GetMapping("/{id}/booked-seats")
    public List<String> getBookedSeatsForEvent(@PathVariable Long id) {
        return bookingService.getBookedSeatsForEvent(id);
    }

    
}