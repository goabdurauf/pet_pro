package uz.smart.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResPageable<T> {
    private T object;
    private long totalElements;
    private int currentPage;
}
