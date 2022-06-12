package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 15.01.2022. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uz.smart.entity.TransactionsEntity;

import java.util.*;

public interface TransactionRepository extends JpaRepository<TransactionsEntity, UUID> {

    Optional<TransactionsEntity> getFirstByOrderByCreatedAtDesc();

    List<TransactionsEntity> findAllByOrderByDateDesc();

    @Query(value = "select * from transactions t " +
            " where t.state = 1 and t.date between :start and :end " +
            " and (t.kassa_type between cast(cast(:minType as text) as bigint) and cast(cast(:maxType as text) as bigint)) " +
            " and (:kassaType is null or t.kassa_type = cast(cast(:kassaType as text) as bigint)) " +
            " and (:clientId is null or t.client_id = cast(cast(:clientId as text) as uuid)) " +
            " and (:carrierId is null or t.carrier_id = cast(cast(:carrierId as text) as uuid)) " +
            " and (:kassaId is null or t.kassa_id = cast(cast(:kassaId as text) as uuid)) " +
            " and (:agentId is null or t.agent_id = cast(cast(:agentId as text) as bigint)) " +
            " order by t.date desc offset :page rows fetch first :size rows only", nativeQuery = true)
    Set<TransactionsEntity> getTransactionsByFilter(Date start, Date end, Integer minType, Integer maxType, Integer kassaType,
                                                    UUID clientId, UUID carrierId, UUID kassaId, Long agentId,
                                                    int page, int size);
    @Query(value = "select count(*) " +
            " from (select distinct t.id from transactions t " +
            "       where t.state = 1 and t.date between :start and :end " +
            "       and (t.kassa_type between cast(cast(:minType as text) as bigint) and cast(cast(:maxType as text) as bigint)) " +
            "       and (:kassaType is null or t.kassa_type = cast(cast(:kassaType as text) as bigint)) " +
            "       and (:clientId is null or t.client_id = cast(cast(:clientId as text) as uuid)) " +
            "       and (:carrierId is null or t.carrier_id = cast(cast(:carrierId as text) as uuid)) " +
            "       and (:kassaId is null or t.kassa_id = cast(cast(:kassaId as text) as uuid)) " +
            "       and (:agentId is null or t.agent_id = cast(cast(:agentId as text) as bigint)) " +
            " ) t", nativeQuery = true)
    long getTransactionsCount(Date start, Date end, Integer minType, Integer maxType, Integer kassaType,
                              UUID clientId, UUID carrierId, UUID kassaId, Long agentId);

}
