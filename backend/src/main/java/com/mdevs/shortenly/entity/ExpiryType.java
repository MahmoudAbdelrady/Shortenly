package com.mdevs.shortenly.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ExpiryType {

    ONE_TIME("ONE_TIME", null),
    NEVER_EXPIRES("NEVER_EXPIRES", null),
    FIVE_MIN("5_MIN", 5),
    TEN_MIN("10_MIN", 10),
    FIFTEEN_MIN("15_MIN", 15),
    TWENTY_MIN("20_MIN", 20),
    TWENTY_FIVE_MIN("25_MIN", 25),
    THIRTY_MIN("30_MIN", 30),
    FORTY_FIVE_MIN("45_MIN", 45),
    ONE_HR("1_HR", 60),
    TWO_HR("2_HR", 120),
    SIX_HR("6_HR", 360),
    TWELVE_HR("12_HR", 720),
    TWENTY_FOUR_HR("24_HR", 1440);

    @JsonValue
    private final String value;
    private final Integer minutes;

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
