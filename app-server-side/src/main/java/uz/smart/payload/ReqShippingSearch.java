package uz.smart.payload;

import lombok.Data;
import uz.smart.utils.AppConstants;

import java.util.UUID;

/*
    Created by Ilhom Ahmadjonov on 29.04.2022. 
*/

@Data
public class ReqShippingSearch {
    private String word;

    private UUID clientId;
    private UUID carrierId;
    private UUID managerId;
    private Long transportKindId;

    private int page = Integer.parseInt(AppConstants.DEFAULT_PAGE_NUMBER);
    private int size = Integer.parseInt(AppConstants.DEFAULT_PAGE_SIZE);
    private String loadStart = AppConstants.BEGIN_DATE;
    private String loadEnd = AppConstants.END_DATE;
    private String unloadStart = AppConstants.BEGIN_DATE;
    private String unloadEnd = AppConstants.END_DATE;
}
