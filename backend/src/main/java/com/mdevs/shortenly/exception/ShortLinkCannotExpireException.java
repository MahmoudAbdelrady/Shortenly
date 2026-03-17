package com.mdevs.shortenly.exception;

public class ShortLinkCannotExpireException extends RuntimeException {

    public ShortLinkCannotExpireException(String message) {
        super(message);
    }
}
