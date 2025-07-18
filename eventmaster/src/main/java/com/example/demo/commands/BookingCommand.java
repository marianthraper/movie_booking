package com.example.demo.commands;

public interface BookingCommand {
    void execute();
    void undo();
}