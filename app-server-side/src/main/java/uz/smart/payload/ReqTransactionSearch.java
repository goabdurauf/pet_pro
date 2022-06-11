package uz.smart.payload;

import lombok.Data;

import java.util.UUID;

@Data
public class ReqTransactionSearch extends ReqSearch {
    private Integer kassaType;
    private Integer kassaInType;
    private Integer kassaOutType;
    private UUID clientId;
    private UUID carrierId;
    private Long agentId;
    private UUID kassaId;
}
