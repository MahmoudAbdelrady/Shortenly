package com.mdevs.shortenly.exception;

public class ShortLinkExpiredException extends RuntimeException {

    public ShortLinkExpiredException(String code) {
        super("Short link has expired: " + code);
    }
}
