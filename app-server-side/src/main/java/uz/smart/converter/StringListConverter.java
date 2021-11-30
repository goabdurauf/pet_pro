package uz.smart.converter;

import org.springframework.util.StringUtils;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by adrelectro on 04.09.2020.
 **/

@Converter(autoApply = true)
public class StringListConverter implements AttributeConverter<List<String>, String> {
    private static final String SPLIT_CHAR = ";";

    @Override
    public String convertToDatabaseColumn(List<String> stringList) {
        return stringList == null || stringList.size() == 0 ? null : String.join(SPLIT_CHAR, stringList);
    }

    @Override
    public List<String> convertToEntityAttribute(String string) {
        return StringUtils.hasText(string) ? new ArrayList<>(List.of(string.split(SPLIT_CHAR))) : new ArrayList<>();
    }
}
