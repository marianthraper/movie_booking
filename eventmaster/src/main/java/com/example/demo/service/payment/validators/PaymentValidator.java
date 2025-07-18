package com.example.demo.service.payment.validators;

import com.example.demo.dto.PaymentRequest;
import com.example.demo.exception.PaymentValidationException;

public abstract class PaymentValidator {
    protected PaymentValidator next;

    public PaymentValidator linkWith(PaymentValidator next) {
        this.next = next;
        return next;
    }

    public abstract void validate(PaymentRequest request) throws PaymentValidationException;

    protected void validateNext(PaymentRequest request) throws PaymentValidationException {
        if (next != null) {
            next.validate(request);
        }
    }
}