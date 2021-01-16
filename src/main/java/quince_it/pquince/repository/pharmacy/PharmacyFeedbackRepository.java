package quince_it.pquince.repository.pharmacy;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import quince_it.pquince.entities.pharmacy.PharmacyFeedback;
import quince_it.pquince.entities.pharmacy.PharmacyFeedbackId;
import quince_it.pquince.services.contracts.dto.pharmacy.PharmacyFiltrationRepositoryDTO;

public interface PharmacyFeedbackRepository extends JpaRepository<PharmacyFeedback, PharmacyFeedbackId>{
	
	@Query(value = "SELECT AVG(p.grade) FROM PharmacyFeedback p WHERE p.pharmacy.id = ?1")
	double findAvgGradeForPharmacy(UUID pharmacyId);
	
	@Query(value = "SELECT new quince_it.pquince.services.contracts.dto.pharmacy.PharmacyFiltrationRepositoryDTO(p.pharmacy.id, p.pharmacy.name, p.pharmacy.address,  p.pharmacy.description, AVG(p.grade)) "
				 + "FROM PharmacyFeedback p WHERE LOWER(p.pharmacy.name) LIKE %?1% GROUP BY p.pharmacy.id, p.pharmacy.name, p.pharmacy.address, p.pharmacy.description "
				 + "HAVING AVG(p.grade) >= ?2 AND AVG(p.grade) <= ?3 ")
	List<PharmacyFiltrationRepositoryDTO> findByNameGradeAndDistance(String name, double gradeFrom, double gradeTo);

}
