package uz.smart.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.stream.Stream;

public enum ShippingStatus
{
    Draft           (1),
    Standart        (2);

    private final int code;

    ShippingStatus(int code) {
        this.code = code;
    }

    @JsonValue
    public int get() {
        return code;
    }

    public static ShippingStatus of(int code) {
        return Stream.of(ShippingStatus.values())
                .filter(p -> p.get() == code)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
