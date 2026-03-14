package com.mdevs.shortenly.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ShortLinkRequest(

        @NotBlank(message = "URL must be provided")
        @Pattern(regexp = "^https?://[^\\s/$.?#].\\S*$", message = "Invalid URL format")
        String url,

        @NotBlank(message = "Expiry type must be provided")
        String expiryType
) {}
