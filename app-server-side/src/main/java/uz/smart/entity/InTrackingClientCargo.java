package uz.smart.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InTrackingClientCargo {
  private UUID cargoId;
  private String cargoName;
  private List<CargoDetailEntity> cargoDetails;
}
