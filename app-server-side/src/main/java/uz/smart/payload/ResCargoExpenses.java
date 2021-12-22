package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 19.12.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.dto.ExpenseDto;

import java.util.ArrayList;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResCargoExpenses {
    private List<ExpenseDto> cargoExpenseList = new ArrayList<>();
    private List<ExpenseDto> shippingExpenseList = new ArrayList<>();
}
