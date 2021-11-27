package uz.smart.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.stream.Stream;

public enum ListType
{
    Measure         (1),
    Country         (2),
    About           (3),
    Currency        (4),
    ShippingType    (5),
    OrderStatus     (6),
    PackageType     (7),
    CargoStatus     (8)
    ;

    private final int code;

    ListType(int code) {
        this.code = code;
    }

    @JsonValue
    public int get() {
        return code;
    }

    public static ListType of(int code) {
        return Stream.of(ListType.values())
                .filter(p -> p.get() == code)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
