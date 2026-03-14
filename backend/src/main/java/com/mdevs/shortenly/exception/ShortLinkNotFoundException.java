package com.mdevs.shortenly.exception;

public class ShortLinkNotFoundException extends RuntimeException {

    public ShortLinkNotFoundException(String code) {
        super("Short link not found: " + code);
    }
}
