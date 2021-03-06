import React, { Component } from "react";
import AppointmentIcon from "../../static/appointment-icon.jpg";
import Header from "../../components/Header";
import TopBar from "../../components/TopBar";
import AppointmentDetailsModal from "../../components/AppointmentDetailsModal";
import { BASE_URL } from "../../constants.js";
import Axios from "axios";
import ModalDialog from "../../components/ModalDialog";
import { NavLink, Redirect } from "react-router-dom";
import getAuthHeader from "../../GetHeader";
import HeadingAlert from "../../components/HeadingAlert";

class ObservePatientsCosultation extends Component {
	state = {
		appointments: [],
		openModalSuccess: false,
		openModalInfo: false,
		name: "",
		surname: "",
		grade: "",
		startDateTime: "",
		endDateTime: "",
		price: "",
		pharmacyName: "",
		pharmacyStreet: "",
		pharmacyCity: "",
		pharmacyCountry: "",
		hiddenFailAlert: true,
		failHeader: "",
		failMessage: "",
		unauthorizedRedirect: false,
	};

	componentDidMount() {
		Axios.get(BASE_URL + "/api/appointment/pharmacist/pending/find-by-patient", {
			validateStatus: () => true,
			headers: { Authorization: getAuthHeader() },
		})
			.then((res) => {
				if (res.status === 401) {
					this.setState({ unauthorizedRedirect: true });
				} else {
					this.setState({ appointments: res.data });
					console.log(res.data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	addDays = (date, days) => {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	};

	handleModalSuccessClose = () => {
		this.setState({ openModalSuccess: false });
	};

	handleModalInfoClose = () => {
		this.setState({ openModalInfo: false });
	};

	handleCancelAppointment = (appointmentId) => {
		Axios.put(
			BASE_URL + "/api/appointment/cancel-appointment",
			{ id: appointmentId },
			{ validateStatus: () => true, headers: { Authorization: getAuthHeader() } }
		)
			.then((res) => {
				if (res.status === 400) {
					this.setState({ hiddenFailAlert: false, failHeader: "Bad request", failMessage: "Consultation cannot be canceled." });
				} else if (res.status === 500) {
					this.setState({ hiddenFailAlert: false, failHeader: "Internal server error", failMessage: "Server error." });
				} else if (res.status === 204) {
					this.setState({ openModalSuccess: true });
					console.log(res.data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	handleAppointmentClick = (appointment) => {
		this.setState({
			name: appointment.EntityDTO.staff.EntityDTO.name,
			surname: appointment.EntityDTO.staff.EntityDTO.surname,
			grade: appointment.EntityDTO.staff.EntityDTO.grade,
			startDateTime: appointment.EntityDTO.startDateTime,
			endDateTime: appointment.EntityDTO.endDateTime,
			price: appointment.EntityDTO.price,
			pharmacyName: appointment.EntityDTO.pharmacy.EntityDTO.name,
			pharmacyStreet: appointment.EntityDTO.pharmacy.EntityDTO.address.street,
			pharmacyCity: appointment.EntityDTO.pharmacy.EntityDTO.address.city,
			pharmacyCountry: appointment.EntityDTO.pharmacy.EntityDTO.address.country,
			openModalInfo: true,
		});
	};

	render() {
		if (this.state.unauthorizedRedirect) return <Redirect push to="/unauthorized" />;

		return (
			<React.Fragment>
				<TopBar />
				<Header />

				<div className="container" style={{ marginTop: "10%" }}>
					<HeadingAlert
						hidden={this.state.hiddenFailAlert}
						header={this.state.failHeader}
						message={this.state.failMessage}
						handleCloseAlert={this.handleCloseAlertFail}
					/>
					<h5 className=" text-center mb-0 mt-2 text-uppercase">Consultations</h5>
					<nav className="nav nav-pills nav-justified justify-content-center mt-5">
						<NavLink className="nav-link active" exact to="/observe-consultations">
							Future consultations
						</NavLink>
						<NavLink className="nav-link" exact to="/observe-consultations-history">
							Consultations history
						</NavLink>
					</nav>

					<p hidden={this.state.appointments.length === 0} className="mb-0 mt-4 text-uppercase">
						Click on appointment to see further details
					</p>
					<table className="table table-hover" style={{ width: "100%", marginTop: "3rem" }}>
						<tbody>
							{this.state.appointments.map((appointment) => (
								<tr id={appointment.Id} key={appointment.Id} className="rounded" style={{ cursor: "pointer" }}>
									<td width="190em" onClick={() => this.handleAppointmentClick(appointment)}>
										<img className="img-fluid" src={AppointmentIcon} width="150em" />
									</td>
									<td onClick={() => this.handleAppointmentClick(appointment)}>
										<div>
											<b>Date: </b>{" "}
											{new Date(appointment.EntityDTO.startDateTime).toLocaleDateString("en-US", {
												day: "2-digit",
												month: "2-digit",
												year: "numeric",
											})}
										</div>
										<div>
											<b>Time from: </b>{" "}
											{new Date(appointment.EntityDTO.startDateTime).toLocaleTimeString("en-US", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
										<div>
											<b>Time to: </b>{" "}
											{new Date(appointment.EntityDTO.endDateTime).toLocaleTimeString("en-US", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
										<div>
											<b>Price: </b> {appointment.EntityDTO.price} <b>din</b>
										</div>
										<div>
											<b>Pharmacist: </b>{" "}
											{appointment.EntityDTO.staff.EntityDTO.name + " " + appointment.EntityDTO.staff.EntityDTO.surname}
										</div>
										<div>
											<b>Pharmacist grade: </b> {appointment.EntityDTO.staff.EntityDTO.grade}
											<i className="icofont-star" style={{ color: "#1977cc" }}></i>
										</div>
									</td>
									<td className="align-middle">
										<button
											type="button"
											hidden={this.addDays(new Date(appointment.EntityDTO.startDateTime), -1) <= new Date()}
											onClick={() => this.handleCancelAppointment(appointment.Id)}
											className="btn btn-outline-danger"
										>
											Cancel
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<ModalDialog
					show={this.state.openModalSuccess}
					href="/"
					onCloseModal={this.handleModalSuccessClose}
					header="Successfully canceled"
					text="Your consultation is successfully canceled."
				/>
				<AppointmentDetailsModal
					header="Appointment information"
					show={this.state.openModalInfo}
					onCloseModal={this.handleModalInfoClose}
					name={this.state.name}
					surname={this.state.surname}
					grade={this.state.grade}
					startDateTime={this.state.startDateTime}
					endDateTime={this.state.endDateTime}
					price={this.state.price}
					pharmacyName={this.state.pharmacyName}
					pharmacyStreet={this.state.pharmacyStreet}
					pharmacyCity={this.state.pharmacyCity}
					pharmacyCountry={this.state.pharmacyCountry}
				/>
			</React.Fragment>
		);
	}
}

export default ObservePatientsCosultation;
