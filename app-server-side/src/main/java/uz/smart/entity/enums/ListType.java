package uz.smart.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.stream.Stream;

public enum ListType
{
    Measure                 (1),
    Country                 (2),
    About                   (3),
    Currency                (4),
    ShippingType            (5),
    OrderStatus             (6),
    PackageType             (7),
    CargoStatus             (8),
    CargoRegType            (9),
    TransportKind           (10),
    TransportCondition      (11),
    OtherAgents             (12),
    OtherExpenses           (13),
    ExpenseName             (14),
    FactoryAddress          (15),
    StationName             (16),
    ChaseStatus             (17),
    City                    (18),

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
