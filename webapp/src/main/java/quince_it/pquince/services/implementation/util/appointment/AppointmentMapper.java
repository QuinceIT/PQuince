package quince_it.pquince.services.implementation.util.appointment;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import quince_it.pquince.entities.appointment.Appointment;
import quince_it.pquince.services.contracts.dto.appointment.AppointmentDTO;
import quince_it.pquince.services.contracts.dto.appointment.DermatologistAppointmentDTO;
import quince_it.pquince.services.contracts.dto.appointment.DermatologistAppointmentWithPharmacyDTO;
import quince_it.pquince.services.contracts.dto.pharmacy.PharmacyDTO;
import quince_it.pquince.services.contracts.dto.users.StaffGradeDTO;
import quince_it.pquince.services.contracts.identifiable_dto.IdentifiableDTO;
import quince_it.pquince.services.implementation.util.users.UserMapper;

public class AppointmentMapper {

	
	public static IdentifiableDTO<DermatologistAppointmentDTO> MapAppointmentPersistenceToAppointmentIdentifiableDTO(Appointment appointment, IdentifiableDTO<StaffGradeDTO> staff, double discountPercentage){
		if(appointment == null) throw new IllegalArgumentException();
		
		double discountPrice = discountPercentage == 0 ? appointment.getPriceToPay() : ((100 - discountPercentage) / 100.0) * appointment.getPrice();
		
		return new IdentifiableDTO<DermatologistAppointmentDTO>(appointment.getId(), new DermatologistAppointmentDTO(staff, appointment.getStartDateTime(), appointment.getEndDateTime(), appointment.getPrice(),discountPrice));
	}
	
	public static List<IdentifiableDTO<DermatologistAppointmentDTO>> MapAppointmentPersistenceListToAppointmentIdentifiableDTOList(List<Appointment> appointments, List<IdentifiableDTO<StaffGradeDTO>> staffs, double discountPercentage){
		
		List<IdentifiableDTO<DermatologistAppointmentDTO>> appointmentListDTO = new ArrayList<IdentifiableDTO<DermatologistAppointmentDTO>>();
		appointments.forEach((a) -> appointmentListDTO.add(MapAppointmentPersistenceToAppointmentIdentifiableDTO(a, findAppropriateStaff(a.getStaff().getId(), staffs), discountPercentage)));
		return appointmentListDTO;
	}
	
	public static IdentifiableDTO<StaffGradeDTO> findAppropriateStaff(UUID staffId, List<IdentifiableDTO<StaffGradeDTO>> staffs) {
		
		for(IdentifiableDTO<StaffGradeDTO> staff : staffs) {
			if(staff.Id.equals(staffId)) 
				return staff;
		}

		return null;
	}
	
	public static IdentifiableDTO<DermatologistAppointmentWithPharmacyDTO> MapAppointmentPersistenceToAppointmentWithPharmacyIdentifiableDTO
					(Appointment appointment, IdentifiableDTO<StaffGradeDTO> staff, int discountPercentage){
		if(appointment == null) throw new IllegalArgumentException();
		
		double discountPrice = discountPercentage == 0 ? appointment.getPriceToPay() : ((100 - discountPercentage) / 100.0) * appointment.getPrice();
		
		return new IdentifiableDTO<DermatologistAppointmentWithPharmacyDTO>(appointment.getId(),
																			new DermatologistAppointmentWithPharmacyDTO(staff,
																			appointment.getStartDateTime(),
																			appointment.getEndDateTime(),
																			appointment.getPrice(),
																			new IdentifiableDTO<PharmacyDTO>(appointment.getPharmacy().getId(),
																					new PharmacyDTO(appointment.getPharmacy().getName(),
																									appointment.getPharmacy().getAddress(),
																									appointment.getPharmacy().getDescription(),
																									appointment.getPharmacy().getConsultationPrice())),discountPrice));
	}

	public static List<IdentifiableDTO<DermatologistAppointmentWithPharmacyDTO>> MapAppointmentPersistenceListToAppointmentWithPharmacyIdentifiableDTOList(
			List<Appointment> appointments, List<IdentifiableDTO<StaffGradeDTO>> staffWithGrades, int discountPercentage) {

		List<IdentifiableDTO<DermatologistAppointmentWithPharmacyDTO>> appointmentListDTO = new ArrayList<IdentifiableDTO<DermatologistAppointmentWithPharmacyDTO>>();
		appointments.forEach((a) -> appointmentListDTO.add(MapAppointmentPersistenceToAppointmentWithPharmacyIdentifiableDTO(a, findAppropriateStaff(a.getStaff().getId(), staffWithGrades), discountPercentage)));

		return appointmentListDTO;
	}

	public static List<IdentifiableDTO<AppointmentDTO>> MapAppointmentPersistenceListToAppointmentIdentifiableDTOList(
			List<Appointment> appointments) {
		
		List<IdentifiableDTO<AppointmentDTO>> appointmentDTOList = new ArrayList<IdentifiableDTO<AppointmentDTO>>();
		appointments.forEach((a) -> appointmentDTOList.add(MapAppointmentPersistenceToAppointmentIdentifiableDTO(a)));

		return appointmentDTOList;
	}
	
	public static IdentifiableDTO<AppointmentDTO> MapAppointmentPersistenceToAppointmentIdentifiableDTO(Appointment appointment){
		if(appointment == null) throw new IllegalArgumentException();
		
		return new IdentifiableDTO<AppointmentDTO>(appointment.getId(), new AppointmentDTO(UserMapper.MapStaffPersistenceToStaffIdentifiableDTO(appointment.getStaff()), UserMapper.MapUserPersistenceToUserIdentifiableDTO(appointment.getPatient()), appointment.getAppointmentStatus(), appointment.getStartDateTime(), appointment.getEndDateTime(), appointment.getPrice()));
	}
}
