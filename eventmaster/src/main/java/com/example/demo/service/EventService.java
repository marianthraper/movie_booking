package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.repository.EventRepository;
import org.springframework.stereotype.Service;
//import java.time.LocalDate;
import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

 
    public Event createEvent(Event event) {
        // Builder already validated the object
        return eventRepository.save(event);
    }
    
    
}