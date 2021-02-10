package quince_it.pquince.services.contracts.interfaces.drugs;

import java.util.List;
import java.util.UUID;

import quince_it.pquince.services.contracts.dto.drugs.AcceptOfferForOrderDTO;
import quince_it.pquince.services.contracts.dto.drugs.OfferDTO;
import quince_it.pquince.services.contracts.identifiable_dto.IdentifiableDTO;
import quince_it.pquince.services.contracts.interfaces.IService;

public interface IOfferService extends IService<OfferDTO, IdentifiableDTO<OfferDTO>>{

	List<IdentifiableDTO<OfferDTO>> findOffersForOrder(UUID orderId);

	void acceptOffer(AcceptOfferForOrderDTO acceptOfferForOrderDTO);

}
