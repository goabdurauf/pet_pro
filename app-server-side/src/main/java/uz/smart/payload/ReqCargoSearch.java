package uz.smart.payload;

import lombok.Data;
import uz.smart.utils.AppConstants;

import java.util.UUID;

@Data
public class ReqCargoSearch {
    private String word;

    private UUID clientId;
    private UUID carrierId;
    private Long senderCountryId;
    private Long receiverCountryId;
    private Long statusId;

    private int page = Integer.parseInt(AppConstants.DEFAULT_PAGE_NUMBER);
    private int size = Integer.parseInt(AppConstants.DEFAULT_PAGE_SIZE);
    private String loadStart = AppConstants.BEGIN_DATE;
    private String loadEnd = AppConstants.END_DATE;
    private String unloadStart = AppConstants.BEGIN_DATE;
    private String unloadEnd = AppConstants.END_DATE;
}
