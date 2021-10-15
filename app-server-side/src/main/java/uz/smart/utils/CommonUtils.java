package uz.smart.utils;


import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import uz.smart.exception.BadRequestException;

import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.NumberFormat;
import java.util.Locale;

public class CommonUtils {
    public static void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Sahifa soni noldan kam bo'lishi mumkin emas.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Sahifa soni " + AppConstants.MAX_PAGE_SIZE + " dan ko'p bo'lishi mumkin emas.");
        }
    }


    public static Pageable getPageable(int page, int size) {
        validatePageNumberAndSize(page, size);
        return PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
    }
    public static Pageable getPageable2(int page, int size) {
        validatePageNumberAndSize(page, size);
        return PageRequest.of(page, size, Sort.Direction.DESC, "updatedAt");
    }

    public static Pageable getPageableForNative(int page, int size) {
        validatePageNumberAndSize(page, size);
        return PageRequest.of(page, size, Sort.Direction.DESC, "created_at");
    }

    public static String thousandSeparator(Integer a){
        DecimalFormat formatter = (DecimalFormat) NumberFormat.getInstance(Locale.US);
        DecimalFormatSymbols symbols = formatter.getDecimalFormatSymbols();

        symbols.setGroupingSeparator(' ');
        formatter.setDecimalFormatSymbols(symbols);
        return  formatter.format(a.longValue());
    }

    public static Timestamp validTimestamp(Timestamp timestamp, Boolean isFrom) {
        if (isFrom)
            return timestamp == null ? new Timestamp(1) : timestamp;
        return timestamp == null ? new Timestamp(System.currentTimeMillis()) : timestamp;
    }

    public static double decimalFormat(double sum) {
        String pattern = "#.##";
        DecimalFormat decimalFormat = new DecimalFormat(pattern);
        String format = decimalFormat.format(sum).replace(",",".");
        return Double.parseDouble(format);
    }
}
