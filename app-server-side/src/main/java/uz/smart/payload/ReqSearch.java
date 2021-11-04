package uz.smart.payload;

import lombok.Data;
import uz.smart.utils.AppConstants;

@Data
public class ReqSearch {
    private int page = Integer.parseInt(AppConstants.DEFAULT_PAGE_NUMBER);
    private int size = Integer.parseInt(AppConstants.DEFAULT_PAGE_SIZE);
    private String start = AppConstants.BEGIN_DATE;
    private String end = AppConstants.END_DATE;
    private String search = "";
}
