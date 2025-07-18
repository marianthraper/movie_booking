package com.example.demo.model;

import jakarta.persistence.*; 

import java.time.LocalDate;

@Entity
@Table(name = "events")  
 
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false )
    private double price;

    @Column(nullable = false)
    private String imagePath;

    protected Event() {}

    // --- Builder Setup ---
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String name;
        private String location;
        private LocalDate date;
        private double price;
        private String imagePath;

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public Builder date(LocalDate date) {
            this.date = date;
            return this;
        }

        public Builder price(double price) {
            this.price = price;
            return this;
        }

        public Builder imagePath(String imagePath) {
            this.imagePath = imagePath;
            return this;
        }

        public Event build() {
            // Validate required fields
            if (name == null || location == null || date == null || imagePath == null) {
                throw new IllegalStateException("Missing required fields");
            }

            Event event = new Event();
            event.setName(name);
            event.setLocation(location);
            event.setDate(date);
            event.setPrice(price);
            event.setImagePath(imagePath);
            return event;
        }
    }


    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}
