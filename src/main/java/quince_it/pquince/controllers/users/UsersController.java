package quince_it.pquince.controllers.users;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import quince_it.pquince.services.contracts.dto.drugs.AllergenDTO;
import quince_it.pquince.services.contracts.dto.drugs.AllergenUserDTO;
import quince_it.pquince.services.contracts.dto.pharmacy.PharmacyDTO;
import quince_it.pquince.services.contracts.dto.pharmacy.PharmacyGradeDTO;
import quince_it.pquince.services.contracts.dto.users.AddDermatologistToPharmacyDTO;
import quince_it.pquince.services.contracts.dto.users.IdentifiableDermatologistForPharmacyGradeDTO;
import quince_it.pquince.services.contracts.dto.users.PatientDTO;
import quince_it.pquince.services.contracts.dto.users.RemoveDermatologistFromPharmacyDTO;
import quince_it.pquince.services.contracts.dto.users.PharmacistForPharmacyGradeDTO;
import quince_it.pquince.services.contracts.dto.users.StaffDTO;
import quince_it.pquince.services.contracts.dto.users.UserDTO;
import quince_it.pquince.services.contracts.dto.users.UserInfoChangeDTO;
import quince_it.pquince.services.contracts.identifiable_dto.IdentifiableDTO;
import quince_it.pquince.services.implementation.drugs.AllergenService;
import quince_it.pquince.services.implementation.users.UserService;

@RestController
@RequestMapping(value = "api/users")
public class UsersController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private AllergenService allergenService;
	
	@GetMapping("/activate-patient/{patientId}")
	public ResponseEntity<?> activatePatient(@PathVariable UUID patientId) {
		
		try {
			if (userService.activatePatientAccount(patientId))
				return new ResponseEntity<>(HttpStatus.OK);
			
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	
	@GetMapping("/{userId}")
	@PreAuthorize("hasRole('PATIENT')") //Nadovezuje se sa 'or hasRole('...') or hasRole....'
	public ResponseEntity<IdentifiableDTO<UserDTO>> getUserById(@PathVariable UUID userId) {
		
		try {
			IdentifiableDTO<UserDTO> user = userService.findById(userId);
			return new ResponseEntity<>(user,HttpStatus.OK); 
		} catch (EntityNotFoundException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@GetMapping("/search") 
	public ResponseEntity<List<IdentifiableDTO<UserDTO>>> findByNameAndSurname(@RequestParam String name,@RequestParam String surname) {
		
		try {
			List<IdentifiableDTO<UserDTO>> users = userService.findByNameAndSurname(name, surname);
			return new ResponseEntity<>(users,HttpStatus.OK); 
		} catch (EntityNotFoundException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@PutMapping("/patient") 
	@CrossOrigin
	@PreAuthorize("hasRole('PATIENT')")
	public ResponseEntity<?> updatePatientInformation(@RequestBody UserInfoChangeDTO userInfoChangeDTO ) {
	  
		try {
			userService.updatePatient(userInfoChangeDTO);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@PutMapping("/staff/{staffId}") 
	@CrossOrigin
	public ResponseEntity<?> updateStaffInformation(@PathVariable UUID staffId,@RequestBody UserInfoChangeDTO userInfoChangeDTO ) {
	  
		try {
			userService.updateStaff(staffId, userInfoChangeDTO);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT); 
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@GetMapping("/patient")
	@PreAuthorize("hasRole('PATIENT')")
	public ResponseEntity<IdentifiableDTO<PatientDTO>> getPatientById() {
	  
		try {
			IdentifiableDTO<PatientDTO> patient = userService.getPatientById();
			return new ResponseEntity<>(patient,HttpStatus.OK); 
		} catch (EntityNotFoundException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
		} 
		catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@GetMapping("/staff/{staffId}") 
	public ResponseEntity<IdentifiableDTO<StaffDTO>> getStaffById(@PathVariable UUID staffId) {
	  
		try {
			IdentifiableDTO<StaffDTO> staff = userService.getStaffById(staffId);
			return new ResponseEntity<>(staff,HttpStatus.OK); 
		} catch (EntityNotFoundException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
		} 
		catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@GetMapping("/patient-allergens") 
	@PreAuthorize("hasRole('PATIENT')")
	public ResponseEntity<List<IdentifiableDTO<AllergenDTO>>> getAllergensForPatient() {
	  
		try {
			List<IdentifiableDTO<AllergenDTO>> allergens = allergenService.getPatientAllergens();
			return new ResponseEntity<>(allergens,HttpStatus.OK); 
		} catch (EntityNotFoundException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@PostMapping("/patient-allergens") 
	@PreAuthorize("hasRole('PATIENT')")
	public ResponseEntity<?> addAllergensForPatient(@RequestBody AllergenUserDTO allergenUserDTO) {
	  
		try {
			if(userService.addAllergen(allergenUserDTO))
				return new ResponseEntity<>(HttpStatus.OK); 
			
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);	
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@PutMapping("/patient-allergens") 
	@CrossOrigin
	@PreAuthorize("hasRole('PATIENT')")
	public ResponseEntity<?> deleteAllergensForPatient(@RequestBody AllergenUserDTO allergenUserDTO) {
		
		try {
			if(userService.removeAllergen(allergenUserDTO))
				return new ResponseEntity<>(HttpStatus.OK); 
			
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);	
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@PutMapping("/remove-dermatologist-from-pharmacy") 
	@PreAuthorize("hasRole('PHARMACYADMIN')")
	@CrossOrigin
	public ResponseEntity<?> removeDermatologistFromPharmacy(@RequestBody RemoveDermatologistFromPharmacyDTO removeDermatologistFromPharmacyDTO) {
		
		try {
			if(userService.removeDermatologistFromPharmacy(removeDermatologistFromPharmacyDTO))
				return new ResponseEntity<>(HttpStatus.OK); 
			
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);	
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@PutMapping("/add-dermatologist-to-pharmacy") 
	@PreAuthorize("hasRole('PHARMACYADMIN')")
	@CrossOrigin
	public ResponseEntity<?> addDermatologistToPharmacy(@RequestBody AddDermatologistToPharmacyDTO addDermatologistToPharmacyDTO) {
		
		try {
			if(userService.addDermatologistToPharmacy(addDermatologistToPharmacyDTO))
				return new ResponseEntity<>(HttpStatus.OK); 
			
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);	
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@GetMapping("/dermatologist-for-pharmacy/{pharmacyId}") 
	@PreAuthorize("hasRole('PATIENT')")
	@CrossOrigin
	public ResponseEntity<List<IdentifiableDermatologistForPharmacyGradeDTO>> getDermatologistForPharmacy(@PathVariable UUID pharmacyId) {
	  
		try {
			List<IdentifiableDermatologistForPharmacyGradeDTO> dermatologist = userService.findAllDermatologistForPharmacy(pharmacyId);
			return new ResponseEntity<>(dermatologist,HttpStatus.OK); 
		} catch (EntityNotFoundException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@GetMapping("/dermatologist-for-emplooye-in-pharmacy/{pharmacyId}") 
	@PreAuthorize("hasRole('PHARMACYADMIN')")
	@CrossOrigin
	public ResponseEntity<List<IdentifiableDermatologistForPharmacyGradeDTO>> getDermatologistForEmplooyeInPharmacy(@PathVariable UUID pharmacyId) {
	  
		try {
			List<IdentifiableDermatologistForPharmacyGradeDTO> dermatologist = userService.findAllDermatologistForEmplooyeToPharmacy(pharmacyId);
			return new ResponseEntity<>(dermatologist,HttpStatus.OK); 
		} catch (EntityNotFoundException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}
	
	@GetMapping("/pharmacies-where-dermatologist-work") 
	@PreAuthorize("hasRole('PHARMACYADMIN')")
	@CrossOrigin
	public ResponseEntity<List<IdentifiableDTO<PharmacyDTO>>> getPharmciesWhereDermatologistWork(@RequestParam UUID dermatologistId) {
	  
		try {
			List<IdentifiableDTO<PharmacyDTO>> pharmacies = userService.getPharmaciesWhereDermatologistWork(dermatologistId);
			return new ResponseEntity<>(pharmacies,HttpStatus.OK); 
		} catch (EntityNotFoundException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); 
		}
	}

	@GetMapping("/get-pharmacists")
	@PreAuthorize("hasRole('PATIENT')")
	@CrossOrigin
	public ResponseEntity<List<IdentifiableDTO<PharmacistForPharmacyGradeDTO>>> findAllPharmaciesFreeForPeriodWithGradesAndPrice(@RequestParam UUID pharmacyId, @RequestParam long startDateTime){
	
		try {
			return new ResponseEntity<>(userService.findAllFreePharmacistForPharmacy(new Date(startDateTime), pharmacyId),HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/get-pharmacists/sort-by-grade-ascending")
	@PreAuthorize("hasRole('PATIENT')")
	public ResponseEntity<List<IdentifiableDTO<PharmacistForPharmacyGradeDTO>>> findAllPharmaciesFreeForPeriodWithGradesAndPriceSortByGradeAscending(@RequestParam UUID pharmacyId, @RequestParam long startDateTime){
	
		try {
			return new ResponseEntity<>(userService.findAllFreePharmacistForPharmacySortByGradeAscending(new Date(startDateTime), pharmacyId),HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/get-pharmacists/sort-by-grade-descending")
	@PreAuthorize("hasRole('PATIENT')")
	public ResponseEntity<List<IdentifiableDTO<PharmacistForPharmacyGradeDTO>>> findAllPharmaciesFreeForPeriodWithGradesAndPriceSortByGradeDescending(@RequestParam UUID pharmacyId, @RequestParam long startDateTime){
	
		try {
			return new ResponseEntity<>(userService.findAllFreePharmacistForPharmacySortByGradeDescending(new Date(startDateTime), pharmacyId),HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
}
