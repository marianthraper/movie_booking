package com.example.demo.dto;

public class BookingRequestDto {
    private Long userId;
    private Long eventId;
    private int seats;
    private String seatNumbers;
    private double totalPrice;

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getEventId() {
        return eventId;
    }
    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
    public int getSeats() {
        return seats;
    }
    public void setSeats(int seats) {
        this.seats = seats;
    }
    public String getSeatNumbers() {
        return seatNumbers;
    }
    public void setSeatNumbers(String seatNumbers) {
        this.seatNumbers = seatNumbers;
    }
    public double getTotalPrice() {
        return totalPrice;
    }
    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
