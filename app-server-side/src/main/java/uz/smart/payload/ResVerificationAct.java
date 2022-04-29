package uz.smart.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.dto.VerificationActDto;

import java.util.ArrayList;
import java.util.List;

/*
    Created by Ilhom Ahmadjonov on 24.04.2022. 
*/
@Data @NoArgsConstructor @AllArgsConstructor
public class ResVerificationAct {
    private String owner;
    private List<List<VerificationActDto>> actList = new ArrayList<>();

    public ResVerificationAct(String owner) {
        this.owner = owner;
    }
}
