package uz.smart.converter;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021. 
*/

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

public class DateTimeDeserializer extends JsonDeserializer<Date> {

    private static final String[] DATE_FORMATS = new String[] {
            "dd.MM.yyyy HH:mm:ss", "dd.MM.yyyy", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd"
    };

    @Override
    public Timestamp deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        String dateStr = jp.getText();
        if (!StringUtils.hasText(dateStr))
            return null;

        for (String format : DATE_FORMATS) {
            try {
                dateStr = dateStr.replaceAll(",", ".");
                return new Timestamp(new SimpleDateFormat(format).parse(dateStr).getTime());
            } catch (ParseException e) { }
        }
        throw new JsonParseException(jp, "Unparseable date: \"" + dateStr + "\". Supported formats: " + Arrays.toString(DATE_FORMATS));
    }
}
