package com.example.demo.service.payment.validators;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.demo.service.BookingService;
import com.example.demo.service.UserService;

@Configuration
public class PaymentValidatorChain {
    @Bean
    public static PaymentValidator createDefaultChain(BookingService bookingService, UserService userService) {
        AmountValidator amountValidator = new AmountValidator();
        amountValidator
            .linkWith(new BookingValidator(bookingService))
            .linkWith(new UserValidator(userService))
            .linkWith(new CardPaymentValidator())
            .linkWith(new UpiPaymentValidator());
        return amountValidator;
    }
}