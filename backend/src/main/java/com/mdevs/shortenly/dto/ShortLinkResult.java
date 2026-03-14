package com.mdevs.shortenly.dto;

import java.time.LocalDateTime;

public record ShortLinkResult(
        String shortUrl,
        String originalUrl,
        String expiryType,
        LocalDateTime expiresAt
) {}
