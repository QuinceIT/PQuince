package quince_it.pquince.repository.users;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import quince_it.pquince.entities.users.LoyaltyProgram;
import quince_it.pquince.entities.users.User;

public interface LoyaltyProgramRepository extends JpaRepository<LoyaltyProgram, UUID>{
	
}
