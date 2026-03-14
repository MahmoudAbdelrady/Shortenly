package com.mdevs.shortenly.dto;

public record ShortLinkRecord(
        String originalUrl,
        String shortUrl,
        Long clicks,
        String createdAt,
        String expiryType,
        String expiresAt,
        boolean isExpired
) {}
