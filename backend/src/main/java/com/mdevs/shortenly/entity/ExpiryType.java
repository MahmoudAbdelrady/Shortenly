package com.mdevs.shortenly.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ExpiryType {

    ONE_TIME("ONE_TIME"),
    NEVER_EXPIRES("NEVER_EXPIRES"),
    FIVE_MIN("5_MIN"),
    TEN_MIN("10_MIN"),
    FIFTEEN_MIN("15_MIN"),
    TWENTY_MIN("20_MIN"),
    TWENTY_FIVE_MIN("25_MIN"),
    THIRTY_MIN("30_MIN"),
    FORTY_FIVE_MIN("45_MIN"),
    ONE_HR("1_HR"),
    TWO_HR("2_HR"),
    SIX_HR("6_HR"),
    TWELVE_HR("12_HR"),
    TWENTY_FOUR_HR("24_HR");

    @JsonValue
    private final String value;

    @JsonCreator
    public static ExpiryType fromValue(String value) {
        for (ExpiryType type : values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown ExpiryType value: " + value);
    }
}
