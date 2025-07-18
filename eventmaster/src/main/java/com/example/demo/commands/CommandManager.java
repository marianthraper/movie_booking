package com.example.demo.commands;

import org.springframework.stereotype.Component;
import java.util.Stack;

@Component
public class CommandManager {
    private final Stack<BookingCommand> commandHistory = new Stack<>();

    public void executeCommand(BookingCommand command) {
        command.execute();
        commandHistory.push(command);
    }

    public void undoLastCommand() {
        if (!commandHistory.isEmpty()) {
            BookingCommand command = commandHistory.pop();
            command.undo();
        }
    }
}