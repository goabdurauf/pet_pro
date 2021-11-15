package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 11.11.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.dto.CargoDto;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResCargo extends CargoDto {
    private String num;
    private String orderNum;
    private String clientName;

}
