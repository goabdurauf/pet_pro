package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 11.11.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.smart.dto.CargoDto;
import uz.smart.dto.DocumentDto;
import uz.smart.dto.ExpenseDto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor @AllArgsConstructor
public class ResCargo extends CargoDto {
    private String num;
    private String orderNum;
    private String clientName;
    private String carrierName;
    private UUID shippingId;
    private String shippingNum;
    private Long statusId;
    private String statusName;
    private List<DocumentDto> documentList;
    private int shippingStatusId;
    private UUID invoiceOutId;
    private List<ExpenseDto> expenseList = new ArrayList<>();

    public ResCargo(UUID id, String name, String num) {
        super.setId(id);
        super.setName(name);
        this.num = num;
    }
}
