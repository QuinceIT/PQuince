package quince_it.pquince.constants;

import java.util.Date;
import java.util.UUID;

public class Constants {

	public static final UUID PATIENT_ID = UUID.fromString("22793162-52d3-11eb-ae93-0242ac130002");
	public static final String PATIENT_EMAIL = "example@example.com";
	public static final String ADMIN_EMAIL = "admin@example.com";
	public static final String PATIENT_NAME = "Stefan";
	public static final String PATIENT_SURNAME = "Stefic";
	
	public static final UUID DERMATHOLOGIST_ID = UUID.fromString("11355678-52d3-11eb-ae93-0242ac130002");
	public static final UUID PHARMACIST_ID = UUID.fromString("25345278-52d3-11eb-ae93-0242ac130002");
	public static final long APPOINTMENT_START = Long.parseLong("1613394120000");
	public static final UUID APPOINTMENT_ID = UUID.fromString("2bc86116-5c40-11eb-ae93-0242ac130002");
	
	public static final UUID STAFF_ID = UUID.fromString("25345278-52d3-11eb-ae93-0242ac130002");
	public static final UUID PHARMACY_ID = UUID.fromString("cafeddee-56cb-11eb-ae93-0242ac130002");
	public static final UUID ACTION_ID = UUID.fromString("cafeddee-56cb-11eb-ae93-0242ac130002");
	public static final UUID DRUG_ID = UUID.fromString("dac2b818-5838-11eb-ae93-0242ac130002");

	@SuppressWarnings("deprecation")
	public static final Date APPOINTMENT_START_DATE_TIME = new Date(2021, 2, 15, 14, 2);
	@SuppressWarnings("deprecation")
	public static final Date APPOINTMENT_END_DATE_TIME = new Date(2021, 2, 15, 14, 17);

	
	@SuppressWarnings("deprecation")
	public static final Date WORKTIME_START_DATE = new Date(2021, 2, 3, 14, 2);
	@SuppressWarnings("deprecation")
	public static final Date WORKTIME_END_DATE = new Date(2021, 4, 15, 14, 2);
		
	@SuppressWarnings("deprecation")
	public static final Date ABSENCE_START_DATE = new Date(2021, 2, 13, 0, 0);
	@SuppressWarnings("deprecation")
	public static final Date ABSENCE_END_DATE = new Date(2021, 2, 18, 0, 0);
			
}
