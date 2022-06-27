package uz.smart.payload;


import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashMap;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Report<T> {
  private String templateName;
  private String [] sheetNames;
  private String fileName;
  private HashMap<String,Object> params;
  private List<T> data;
}
