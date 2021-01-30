package quince_it.pquince.services.implementation.users;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import quince_it.pquince.entities.users.LoyaltyProgram;
import quince_it.pquince.repository.users.LoyaltyProgramRepository;
import quince_it.pquince.services.contracts.dto.users.LoyaltyProgramDTO;
import quince_it.pquince.services.contracts.identifiable_dto.IdentifiableDTO;
import quince_it.pquince.services.contracts.interfaces.users.ILoyaltyProgramService;
import quince_it.pquince.services.implementation.util.users.LoyaltyProgramMapper;

@Service
public class LoyaltyProgramService implements ILoyaltyProgramService {


	@Autowired
	private LoyaltyProgramRepository loyaltyProgramRepository;


	@Override
	public IdentifiableDTO<LoyaltyProgramDTO> findById(UUID id) {
		return LoyaltyProgramMapper.MapLoyaltyProgramPersistenceToLoyaltyProgramIdentifiableDTO(loyaltyProgramRepository.getOne(id));
	}

	@Override
	public boolean delete(UUID id) {
		return false;
	}

	@Override
	public UUID create(LoyaltyProgramDTO entityDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void update(LoyaltyProgramDTO entityDTO, UUID id) {

		try {
			//LoyaltyProgram loyaltyProgram = loyaltyProgramRepository.findById(id).get();
			LoyaltyProgram loyaltyProgram = loyaltyProgramRepository.getOne(id);
			loyaltyProgram.setPointsForAppointment(entityDTO.getPointsForAppointment());
			loyaltyProgram.setPointsForConsulting(entityDTO.getPointsForConsulting());
			loyaltyProgram.setPointsToEnterRegularCathegory(entityDTO.getPointsToEnterRegularCathegory());
			loyaltyProgram.setPointsToEnterSilverCathegory(entityDTO.getPointsToEnterSilverCathegory());
			loyaltyProgram.setPointsToEnterGoldCathegory(entityDTO.getPointsToEnterGoldCathegory());
			
			loyaltyProgramRepository.save(loyaltyProgram);
			
		}catch (Exception e) {
		}
	}

	@Override
	public List<IdentifiableDTO<LoyaltyProgramDTO>> findAll() {
		// TODO Auto-generated method stub
		return null;
	}

		
}
