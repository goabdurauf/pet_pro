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
public class InTrackingClient {
  private UUID clientId;
  private String clientName;
  private List<InTrackingClientCargo> clientCargos;
}
