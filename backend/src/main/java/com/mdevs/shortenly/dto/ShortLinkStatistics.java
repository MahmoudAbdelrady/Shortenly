package com.mdevs.shortenly.dto;

public record ShortLinkStatistics(
        long totalLinks,
        long activeLinks,
        long disabledLinks
) {}
