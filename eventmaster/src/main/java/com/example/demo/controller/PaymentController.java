package com.example.demo.controller;

import com.example.demo.dto.PaymentRequest;
import com.example.demo.model.Payment;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.service.PaymentService;
// import com.itextpdf.text.DocumentException;
// import com.itextpdf.text.Paragraph;
// import com.itextpdf.text.pdf.PdfWriter;

// import org.springframework.http.ContentDisposition;
// import org.springframework.http.ResponseEntity;
//import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import com.itextpdf.text.Document;
// //import com.itextpdf.text.DocumentException;
// //import com.itextpdf.text.Paragraph;
// //import com.itextpdf.text.pdf.PdfWriter;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;

// import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentService paymentService,PaymentRepository paymentRepository) {
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
    }

    @PostMapping
    public Payment makePayment(@RequestBody PaymentRequest paymentRequest) {
        return paymentService.processPayment(paymentRequest);
    }

//     @GetMapping(value = "/{id}/invoice", produces = MediaType.APPLICATION_PDF_VALUE)
// public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id) {
//     try {
//         // First try to find by booking ID (since you're passing bookingId from frontend)
//         Payment payment = paymentRepository.findByBookingId(id)
//             .orElseThrow(() -> new RuntimeException("Payment not found for booking: " + id));
        
//         byte[] pdfBytes = generatePdfFromPayment(payment);
        
//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentDisposition(
//             ContentDisposition.builder("attachment")
//                 .filename("invoice_"+id+".pdf")
//                 .build());
        
//         return ResponseEntity.ok()
//             .headers(headers)
//             .contentType(MediaType.APPLICATION_PDF)
//             .body(pdfBytes);
//     } catch (Exception e) {
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//             .body(("Error generating invoice: " + e.getMessage()).getBytes());
//     }
// }

// private byte[] generatePdfFromPayment(Payment payment) throws DocumentException {
//     Document document = new Document();
//     ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//     PdfWriter.getInstance(document, outputStream);
    
//     document.open();
    
//     // Simple PDF generation using existing payment data
//     document.add(new Paragraph("Invoice #" + payment.getId()));
//     document.add(new Paragraph("Event: " + payment.getBooking().getEvent().getName()));
//     document.add(new Paragraph("Amount: $" + payment.getAmount()));
//     // Add more details as needed
    
//     document.close();
//     return outputStream.toByteArray();
// }

@GetMapping("/invoice.html")
public String getInvoicePage() {
    return "invoice"; // Make sure you have invoice.html in your templates folder
}
}