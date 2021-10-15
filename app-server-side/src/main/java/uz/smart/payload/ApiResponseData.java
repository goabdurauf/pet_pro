package uz.smart.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponseData extends ApiResponse {

    private Object data;

    public ApiResponseData(String message, boolean success, Object data) {
        super(message, success);
        this.data = data;
    }

}
