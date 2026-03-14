package com.mdevs.shortenly.exception;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @ExceptionHandler(ShortLinkNotFoundException.class)
    public ResponseEntity<Void> handleNotFound(ShortLinkNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(frontendUrl + "error?reason=not_found"))
                .build();
    }

    @ExceptionHandler(ShortLinkExpiredException.class)
    public ResponseEntity<Void> handleExpired(ShortLinkExpiredException ex) {
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(frontendUrl + "error?reason=expired"))
                .build();
    }
}
