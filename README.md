#Movie Booking Application

It is a web based application for an Movie Booking platform. 
It enables users to:
1. Browse upcoming movie events
2. Check real-time seat availability
3. Reserve seats and order food combos
4. Make payments through multiple gateways
5. Access their booking history and cancel bookings if needed

**Key features**
1. User Authentication: Secure login/signup with role-based access (Admin/User).
2. Event Catalog: Dynamic listing of movies and events with details like date, time, and price.
3. Real-Time Seat Selection: Interactive seat map showing real-time availability.
4. Food Combo Ordering: Option to pre-order snacks and combo offers during booking.
5. Payment Integration: Supports multiple gateways like CARD, UPI, and CASH.
6. Booking History: Users can view and manage their past bookings.
7. Invoice Generation: Users can view and download their invoice with booking,food order and billing information.
8. MVC Architecture: Implements the Model-View-Controller (MVC) pattern to ensure separation of concerns and modular development.

**Design Patterns Used**
The Event Management System incorporates four key design patterns to improve scalability, maintainability, and flexibility:

*Builder Pattern*

Used for the construction of complex Event objects. It provides a fluent interface to set various properties while ensuring immutability and validation. This makes it easier to create diverse events with optional fields.

*Chain of Responsibility Pattern*

Implemented in the payment processing pipeline. Validation steps like checking transaction amount, card/UPI verification, and fraud detection are handled in a decoupled, sequential chain of handlers for flexibility and reusability.

*Command Pattern*

Used for managing booking actions such as creation and cancellation. These actions are encapsulated as objects to support undo/redo functionality and decouple UI logic from backend operations.

*Prototype Pattern*

Optimizes food combo ordering by enabling cloning of frequently ordered or predefined combo templates. This reduces database calls and enhances performance, especially under heavy load.


