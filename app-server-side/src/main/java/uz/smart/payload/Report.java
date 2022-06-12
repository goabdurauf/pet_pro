package uz.smart.payload;


import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Report<T> {
  private String templateName;
  private String [] sheetNames;
  private String fileName;
  private List<T> data;
}
