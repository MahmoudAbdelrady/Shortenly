package com.mdevs.shortenly.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ShortLinkRequest(

        @NotBlank
        @Pattern(regexp = "^https?://[^\\s/$.?#].[^\\s]*$")
        String url,

        @NotBlank
        String expiryType
) {}
