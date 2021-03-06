package quince_it.pquince.services.contracts.interfaces.pharmacy;

import java.util.List;
import java.util.UUID;

import quince_it.pquince.services.contracts.dto.EntityIdDTO;
import quince_it.pquince.services.contracts.dto.drugs.CreateOrderDTO;
import quince_it.pquince.services.contracts.dto.drugs.DrugForOrderDTO;
import quince_it.pquince.services.contracts.dto.drugs.DrugOrderDTO;
import quince_it.pquince.services.contracts.dto.drugs.DrugWithPriceDTO;
import quince_it.pquince.services.contracts.dto.drugs.EditOrderDTO;
import quince_it.pquince.services.contracts.dto.drugs.OrderDTO;
import quince_it.pquince.services.contracts.dto.drugs.OrderForProviderDTO;
import quince_it.pquince.services.contracts.identifiable_dto.IdentifiableDTO;

public interface IOrderService {

	UUID create(CreateOrderDTO createOrderDTO);

	List<IdentifiableDTO<OrderForProviderDTO>> findAllProvider();
	List<IdentifiableDTO<OrderDTO>> findOrdersForPharmacy(UUID pharmacyId);

	boolean removeOrder(EntityIdDTO removeOrderId);

	List<IdentifiableDTO<OrderDTO>> findAll();

	List<IdentifiableDTO<OrderDTO>> filterCreatedOrdersForPharmacy(UUID pharmacyId);

	List<IdentifiableDTO<OrderDTO>> filterProcessedOrdersForPharmacy(UUID pharmacyId);

	List<DrugForOrderDTO> findDrugsFromOrder(UUID orderId);

	List<DrugForOrderDTO> findAllDrugsToAddForOrder(UUID orderId);

	void update(EditOrderDTO editOrderDTO);
}
