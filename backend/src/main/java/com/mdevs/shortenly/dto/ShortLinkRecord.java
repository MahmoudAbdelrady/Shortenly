package com.mdevs.shortenly.dto;

public record ShortLinkRecord(
        String id,
        String originalUrl,
        String shortUrl,
        Long clicks,
        String createdAt,
        String expiryType,
        String expiresAt,
        boolean isExpired
) {}
