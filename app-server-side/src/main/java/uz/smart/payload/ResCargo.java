package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 11.11.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.smart.dto.CargoDto;

@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor @AllArgsConstructor
public class ResCargo extends CargoDto {
    private String num;
    private String orderNum;
    private String clientName;
    private String carrierName;
    private String shippingNum;

}
