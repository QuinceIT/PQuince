package quince_it.pquince.services.implementation.drugs;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import quince_it.pquince.entities.drugs.EReceiptStatus;
import quince_it.pquince.entities.users.User;
import quince_it.pquince.repository.drugs.EReceiptItemsRepository;
import quince_it.pquince.repository.drugs.EReceiptRepository;
import quince_it.pquince.repository.users.UserRepository;
import quince_it.pquince.services.contracts.dto.appointment.EReceiptWithDrugsDTO;
import quince_it.pquince.services.contracts.identifiable_dto.IdentifiableDTO;
import quince_it.pquince.services.contracts.interfaces.drugs.IEReceiptService;
import quince_it.pquince.services.implementation.util.drugs.EReceiptMapper;

@Service
public class EReceiptService implements IEReceiptService{

	@Autowired 
	private EReceiptRepository eReceiptRepository;
	
	@Autowired 
	private EReceiptItemsRepository eReceiptItemsRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public List<IdentifiableDTO<EReceiptWithDrugsDTO>> findAllForPatient() {
		UUID patientId = getLoggedUserId();
		List<IdentifiableDTO<EReceiptWithDrugsDTO>> eReceipts = new ArrayList<IdentifiableDTO<EReceiptWithDrugsDTO>>();
		
		eReceiptRepository.findAllByPatientId(patientId).forEach((e) -> eReceipts.
												add(EReceiptMapper.MapEReceiptPersistenceToEReceiptWithDrugsIdentifiableDTO(e, eReceiptItemsRepository.findAllByEReceiptId(e.getId()))));
				
		return eReceipts;
	}
	
	private UUID getLoggedUserId() {
		
		Authentication currentUser = SecurityContextHolder.getContext().getAuthentication();
		String email = currentUser.getName();
		User user = userRepository.findByEmail(email);
		
		return user.getId();
	}

	@Override
	public List<IdentifiableDTO<EReceiptWithDrugsDTO>> findAllForPatientSortByDateAscending() {
		
		UUID patientId = getLoggedUserId();
		List<IdentifiableDTO<EReceiptWithDrugsDTO>> eReceipts = new ArrayList<IdentifiableDTO<EReceiptWithDrugsDTO>>();
		
		eReceiptRepository.findAllByPatientIdSortByDateAscending(patientId).forEach((e) -> eReceipts.
												add(EReceiptMapper.MapEReceiptPersistenceToEReceiptWithDrugsIdentifiableDTO(e, eReceiptItemsRepository.findAllByEReceiptId(e.getId()))));
		
		return eReceipts;
	}

	@Override
	public List<IdentifiableDTO<EReceiptWithDrugsDTO>> findAllForPatientSortByDateDescending() {
		
		UUID patientId = getLoggedUserId();
		List<IdentifiableDTO<EReceiptWithDrugsDTO>> eReceipts = new ArrayList<IdentifiableDTO<EReceiptWithDrugsDTO>>();
		
		eReceiptRepository.findAllByPatientIdSortByDateDescending(patientId).forEach((e) -> eReceipts.
												add(EReceiptMapper.MapEReceiptPersistenceToEReceiptWithDrugsIdentifiableDTO(e, eReceiptItemsRepository.findAllByEReceiptId(e.getId()))));
		
		return eReceipts;
	}

	@Override
	public List<IdentifiableDTO<EReceiptWithDrugsDTO>> findAllByPatientSearchByStatus(EReceiptStatus status) {
		
		UUID patientId = getLoggedUserId();
		List<IdentifiableDTO<EReceiptWithDrugsDTO>> eReceipts = new ArrayList<IdentifiableDTO<EReceiptWithDrugsDTO>>();
		
		eReceiptRepository.findAllByPatientSearchByStatus(patientId, status).forEach((e) -> eReceipts.
												add(EReceiptMapper.MapEReceiptPersistenceToEReceiptWithDrugsIdentifiableDTO(e, eReceiptItemsRepository.findAllByEReceiptId(e.getId()))));
		
		return eReceipts;
	}

	@Override
	public List<IdentifiableDTO<EReceiptWithDrugsDTO>> findAllByPatientSearchByStatusSortByDateAscending(EReceiptStatus status) {
		
		UUID patientId = getLoggedUserId();
		List<IdentifiableDTO<EReceiptWithDrugsDTO>> eReceipts = new ArrayList<IdentifiableDTO<EReceiptWithDrugsDTO>>();
		
		eReceiptRepository.findAllByPatientSearchByStatusSortByDateAscending(patientId, status).forEach((e) -> eReceipts.
												add(EReceiptMapper.MapEReceiptPersistenceToEReceiptWithDrugsIdentifiableDTO(e, eReceiptItemsRepository.findAllByEReceiptId(e.getId()))));
		
		return eReceipts;
	}

	@Override
	public List<IdentifiableDTO<EReceiptWithDrugsDTO>> findAllByPatientSearchByStatusSortByDateDescending(EReceiptStatus status) {
		
		UUID patientId = getLoggedUserId();
		List<IdentifiableDTO<EReceiptWithDrugsDTO>> eReceipts = new ArrayList<IdentifiableDTO<EReceiptWithDrugsDTO>>();
		
		eReceiptRepository.findAllByPatientSearchByStatusSortByDateDescending(patientId, status).forEach((e) -> eReceipts.
												add(EReceiptMapper.MapEReceiptPersistenceToEReceiptWithDrugsIdentifiableDTO(e, eReceiptItemsRepository.findAllByEReceiptId(e.getId()))));
		
		return eReceipts;
	}

}
