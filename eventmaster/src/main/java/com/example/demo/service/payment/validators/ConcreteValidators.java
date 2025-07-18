package com.example.demo.service.payment.validators;
import org.springframework.stereotype.Component;
import com.example.demo.dto.PaymentRequest;
import com.example.demo.exception.PaymentValidationException;
import com.example.demo.service.BookingService;
import com.example.demo.service.UserService;

// Concrete validators
@Component
class AmountValidator extends PaymentValidator {
    @Override
    public void validate(PaymentRequest request) throws PaymentValidationException {
        if (request.getAmount() <= 0) {
            throw new PaymentValidationException("Invalid payment amount");
        }
        validateNext(request);
    }
}

@Component
class BookingValidator extends PaymentValidator {
    private final BookingService bookingService;

    public BookingValidator(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Override
    public void validate(PaymentRequest request) throws PaymentValidationException {
        if (!bookingService.getBookingById(request.getBookingId()).isPresent()) {
            throw new PaymentValidationException("Booking not found");
        }
        validateNext(request);
    }
}

@Component
class UserValidator extends PaymentValidator {
    private final UserService userService;

    public UserValidator(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void validate(PaymentRequest request) throws PaymentValidationException {
        if (!userService.getUserById(request.getUserId()).isPresent()) {
            throw new PaymentValidationException("User not found");
        }
        validateNext(request);
    }
}

@Component
class CardPaymentValidator extends PaymentValidator {
    @Override
    public void validate(PaymentRequest request) throws PaymentValidationException {
        if ("CARD".equalsIgnoreCase(request.getPaymentMethod())) {
            if (request.getCardNumber() == null || request.getCardHolderName() == null) {
                throw new PaymentValidationException("Card details incomplete");
            }
            if (!isValidCardPassword(request.getCardPassword())) {
                throw new PaymentValidationException("Invalid card password");
            }
        }
        validateNext(request);
    }

    private boolean isValidCardPassword(String password) {
        return password != null && password.length() >= 4;
    }
}

@Component
class UpiPaymentValidator extends PaymentValidator {
    @Override
    public void validate(PaymentRequest request) throws PaymentValidationException {
        if ("UPI".equalsIgnoreCase(request.getPaymentMethod())) {
            if (!isValidUpiPin(request.getUpiPin())) {
                throw new PaymentValidationException("Invalid UPI PIN");
            }
        }
        validateNext(request);
    }

    private boolean isValidUpiPin(String pin) {
        return pin != null && pin.length() == 4;
    }
}