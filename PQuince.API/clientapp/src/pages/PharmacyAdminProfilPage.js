import React, { Component } from "react";
import Header from "../components/Header";
import TopBar from "../components/TopBar";
import { BASE_URL } from "../constants.js";
import Axios from "axios";
import AllergensModal from "../components/AllergensModal";
import PasswordChangeModal from "../components/PasswordChangeModal";
import { YMaps, Map } from "react-yandex-maps";
import getAuthHeader from "../GetHeader";
import { Redirect } from "react-router-dom";
import HeadingSuccessAlert from "../components/HeadingSuccessAlert";
import HeadingAlert from "../components/HeadingAlert";

const mapState = {
	center: [44, 21],
	zoom: 8,
	controls: [],
};

class PharmacyAdminProfilPage extends Component {
	state = {
		id: "",
		email: "",
		password: "",
		name: "",
		surname: "",
		address: "",
		phoneNumber: "",
		nameError: "none",
		surnameError: "none",
		addressError: "none",
		phoneError: "none",
		oldPasswordEmptyError: "none",
		newPasswordEmptyError: "none",
		newPasswordRetypeEmptyError: "none",
		newPasswordRetypeNotSameError: "none",
		openModal: false,
		openPasswordModal: false,
		hiddenEditInfo: true,
		redirect: false,
		hiddenPasswordErrorAlert: true,
		errorPasswordHeader: "",
		errorPasswordMessage: "",
		hiddenSuccessAlert: true,
		successHeader: "",
		successMessage: "",
		hiddenFailAlert: true,
		failHeader: "",
		failMessage: "",
		addressNotFoundError: "none",
	};

	constructor(props) {
		super(props);
		this.addressInput = React.createRef();
	}

	hasRole = (reqRole) => {
		let roles = JSON.parse(localStorage.getItem("keyRole"));

		if (roles === null) return false;

		if (reqRole === "*") return true;

		for (let role of roles) {
			if (role === reqRole) return true;
		}
		return false;
	};

	onYmapsLoad = (ymaps) => {
		this.ymaps = ymaps;

		if (this.state.address !== "") {
			console.log(this.state);
			this.ymaps
				.geocode([this.state.address.latitude, this.state.address.longitude], {
					results: 1,
				})
				.then(function (res) {
					var firstGeoObject = res.geoObjects.get(0);
					document.getElementById("suggest").setAttribute("value", firstGeoObject.getAddressLine());
					console.log(firstGeoObject.getAddressLine());
				});

			new this.ymaps.SuggestView(this.addressInput.current, {
				provider: {
					suggest: (request, options) => this.ymaps.suggest(request),
				},
			});
		}
	};

	componentDidMount() {
		if (!this.hasRole("ROLE_PHARMACYADMIN")) {
			this.setState({ redirect: true });
		} else {
			this.addressInput = React.createRef();

			Axios.get(BASE_URL + "/api/users/pharmacy-admin", { validateStatus: () => true, headers: { Authorization: getAuthHeader() } })
				.then((res) => {
					console.log(res.data);
					if (res.status !== 401) {
						this.setState({
							id: res.data.Id,
							email: res.data.EntityDTO.email,
							name: res.data.EntityDTO.name,
							surname: res.data.EntityDTO.surname,
							address: res.data.EntityDTO.address,
							phoneNumber: res.data.EntityDTO.phoneNumber,
						});

					} else {
						this.setState({ redirect: true });
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	handleEmailChange = (event) => {
		this.setState({ email: event.target.value });
	};

	handleNameChange = (event) => {
		this.setState({ name: event.target.value });
	};

	handleSurnameChange = (event) => {
		this.setState({ surname: event.target.value });
	};

	handlePhoneNumberChange = (event) => {
		this.setState({ phoneNumber: event.target.value });
	};

	validateForm = (pharmacyAdmin) => {
		this.setState({
			nameError: "none",
			surnameError: "none",
			cityError: "none",
			addressError: "none",
			phoneError: "none",
		});

		if (pharmacyAdmin.name === "") {
			this.setState({ nameError: "initial" });
			return false;
		} else if (pharmacyAdmin.surname === "") {
			this.setState({ surnameError: "initial" });
			return false;
		} else if (this.addressInput.current.value === "") {
			this.setState({ addressError: "initial" });
			return false;
		} else if (pharmacyAdmin.phoneNumber === "") {
			this.setState({ phoneError: "initial" });
			return false;
		}
		return true;
	};

	handleModalClose = () => {
		this.setState({
			openModal: false,
			hiddenAllergenSuccessAlert: true,
			successAllergenHeader: "",
			successAllergenMessage: "",
			hiddenAllergenFailAlert: true,
			failAllergenHeader: "",
			failAllergenMessage: "",
		});
	};

	handleSuccessModalClose = () => {
		this.setState({ openSuccessModal: false });
	};

	handlePasswordModalClose = () => {
		this.setState({ openPasswordModal: false });
	};

	handleChangeInfo = () => {
		this.setState({
			hiddenSuccessAlert: true,
			successHeader: "",
			successMessage: "",
			hiddenFailAlert: true,
			failHeader: "",
			failMessage: "",
		});

		let street;
		let city;
		let country;
		let latitude;
		let longitude;
		let found = true;

		this.ymaps
			.geocode(this.addressInput.current.value, {
				results: 1,
			})
			.then(function (res) {
				if (typeof res.geoObjects.get(0) === "undefined") found = false;
				else {
					var firstGeoObject = res.geoObjects.get(0),
						coords = firstGeoObject.geometry.getCoordinates();
					latitude = coords[0];
					longitude = coords[1];
					country = firstGeoObject.getCountry();
					street = firstGeoObject.getThoroughfare();
					city = firstGeoObject.getLocalities().join(", ");
				}
			})
			.then((res) => {
				let pharmacyAdminDTO = {
					name: this.state.name,
					surname: this.state.surname,
					address: { street, country, city, latitude, longitude },
					phoneNumber: this.state.phoneNumber,
				};

				if (this.validateForm(pharmacyAdminDTO)) {
					if (found === false) {
						this.setState({ addressNotFoundError: "initial" });
					} else {
						Axios.put(BASE_URL + "/api/users/pharmacy-admin", pharmacyAdminDTO, {
							validateStatus: () => true,
							headers: { Authorization: getAuthHeader() },
						})
							.then((res) => {
								if (res.status === 400) {
									this.setState({ hiddenFailAlert: false, failHeader: "Bad request", failMessage: "Invalid argument." });
								} else if (res.status === 500) {
									this.setState({ hiddenFailAlert: false, failHeader: "Internal server error", failMessage: "Server error." });
								} else if (res.status === 204) {
									console.log("Success");
									this.setState({
										hiddenSuccessAlert: false,
										successHeader: "Success",
										successMessage: "You successfully updated your information.",
										hiddenEditInfo: true,
									});
								}
							})
							.catch((err) => {
								console.log(err);
							});
					}
				}
			});
	};

	handleAllergenModal = () => {
		this.setState({ hiddenEditInfo: true, openModal: true });
	};

	handlePasswordModal = () => {
		this.setState({ hiddenEditInfo: true, openPasswordModal: true });
	};


	changePassword = (oldPassword, newPassword, newPasswordRetype) => {
		console.log(oldPassword, newPassword, newPasswordRetype);

		this.setState({
			hiddenPasswordErrorAlert: true,
			errorPasswordHeader: "",
			errorPasswordMessage: "",
			hiddenEditInfo: true,
			oldPasswordEmptyError: "none",
			newPasswordEmptyError: "none",
			newPasswordRetypeEmptyError: "none",
			newPasswordRetypeNotSameError: "none",
			hiddenSuccessAlert: true,
			successHeader: "",
			successMessage: "",
		});

		if (oldPassword === "") {
			this.setState({ oldPasswordEmptyError: "initial" });
		} else if (newPassword === "") {
			this.setState({ newPasswordEmptyError: "initial" });
		} else if (newPasswordRetype === "") {
			this.setState({ newPasswordRetypeEmptyError: "initial" });
		} else if (newPasswordRetype !== newPassword) {
			this.setState({ newPasswordRetypeNotSameError: "initial" });
		} else {
			let passwordChangeDTO = { oldPassword, newPassword };
			Axios.post(BASE_URL + "/auth/change-password", passwordChangeDTO, {
				validateStatus: () => true,
				headers: { Authorization: getAuthHeader() },
			})
				.then((res) => {
					if (res.status === 403) {
						this.setState({
							hiddenPasswordErrorAlert: false,
							errorPasswordHeader: "Bad credentials",
							errorPasswordMessage: "You entered wrong password.",
						});
					} else if (res.status === 400) {
						this.setState({
							hiddenPasswordErrorAlert: false,
							errorPasswordHeader: "Invalid new password",
							errorPasswordMessage: "Invalid new password.",
						});
					} else if (res.status === 500) {
						this.setState({
							hiddenPasswordErrorAlert: false,
							errorPasswordHeader: "Internal server error",
							errorPasswordMessage: "Server error.",
						});
					} else if (res.status === 204) {
						this.setState({
							hiddenSuccessAlert: false,
							successHeader: "Success",
							successMessage: "You successfully changed your password.",
							openPasswordModal: false,
						});
					}
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	handleEditInfoClick = () => {
		this.setState({ hiddenEditInfo: false });
	};

	handleCloseAlertPassword = () => {
		this.setState({ hiddenPasswordErrorAlert: true });
	};

	handleCloseAlertSuccess = () => {
		this.setState({ hiddenSuccessAlert: true });
	};

	handleCloseAlertFail = () => {
		this.setState({ hiddenFailAlert: true });
	};

	handleCloseAllergenAlertFail = () => {
		this.setState({ hiddenAllergenFailAlert: true });
	};

	handleCloseAllergenAlertSuccess = () => {
		this.setState({ hiddenAllergenSuccessAlert: true });
	};

	render() {
		if (this.state.redirect) return <Redirect push to="/unauthorized" />;

		return (
			<React.Fragment>
				<TopBar />
				<Header />

				<div className="container mt-15" style={{ marginTop: "8%" }}>
					<HeadingSuccessAlert
						hidden={this.state.hiddenSuccessAlert}
						header={this.state.successHeader}
						message={this.state.successMessage}
						handleCloseAlert={this.handleCloseAlertSuccess}
					/>
					<HeadingAlert
						hidden={this.state.hiddenFailAlert}
						header={this.state.failHeader}
						message={this.state.failMessage}
						handleCloseAlert={this.handleCloseAlertFail}
					/>
					<div className="row mt-10">
						<div className="col shadow p-3 bg-white rounded">
							<h5 className=" text-center text-uppercase">Personal Information</h5>
							<form id="contactForm" name="sentMessage">
								<div className="control-group">
									<div className="form-group controls mb-0 pb-2" style={{ color: "#6c757d", opacity: 1 }}>
										<label>Email address:</label>
										<input
											readOnly
											placeholder="Email address"
											className="form-control-plaintext"
											id="name"
											type="text"
											onChange={this.handleEmailChange}
											value={this.state.email}
										/>
									</div>
								</div>
								<div className="control-group">
									<div className="form-group controls mb-0 pb-2" style={{ color: "#6c757d", opacity: 1 }}>
										<label>Name:</label>
										<input
											readOnly={this.state.hiddenEditInfo}
											className={!this.state.hiddenEditInfo === false ? "form-control-plaintext" : "form-control"}
											placeholder="Name"
											type="text"
											onChange={this.handleNameChange}
											value={this.state.name}
										/>
									</div>
									<div className="text-danger" style={{ display: this.state.nameError }}>
										Name must be entered.
									</div>
								</div>
								<div className="control-group">
									<div className="form-group controls mb-0 pb-2" style={{ color: "#6c757d", opacity: 1 }}>
										<label>Surname:</label>
										<input
											readOnly={this.state.hiddenEditInfo}
											className={!this.state.hiddenEditInfo === false ? "form-control-plaintext" : "form-control"}
											placeholder="Surname"
											type="text"
											onChange={this.handleSurnameChange}
											value={this.state.surname}
										/>
									</div>
									<div className="text-danger" style={{ display: this.state.surnameError }}>
										Surname must be entered.
									</div>
								</div>
								<div className="control-group">
									<div className="form-group controls mb-0 pb-2" style={{ color: "#6c757d", opacity: 1 }}>
										<label>Address:</label>
										<input
											readOnly={this.state.hiddenEditInfo}
											className={!this.state.hiddenEditInfo === false ? "form-control-plaintext" : "form-control"}
											id="suggest"
											ref={this.addressInput}
											placeholder="Address"
										/>
									</div>
									<YMaps
										query={{
											load: "package.full",
											apikey: "b0ea2fa3-aba0-4e44-a38e-4e890158ece2",
											lang: "en_RU",
										}}
									>
										<Map
											style={{ display: "none" }}
											state={mapState}
											onLoad={this.onYmapsLoad}
											instanceRef={(map) => (this.map = map)}
											modules={["coordSystem.geo", "geocode", "util.bounds"]}
										></Map>
									</YMaps>
									<div className="text-danger" style={{ display: this.state.addressError }}>
										Address must be entered.
									</div>
									<div className="text-danger" style={{ display: this.state.addressNotFoundError }}>
										Sorry. Address not found. Try different one.
									</div>
								</div>
								<div className="control-group">
									<div className="form-group controls mb-0 pb-2" style={{ color: "#6c757d", opacity: 1 }}>
										<label>Phone number:</label>
										<input
											placeholder="Phone number"
											readOnly={this.state.hiddenEditInfo}
											className={!this.state.hiddenEditInfo === false ? "form-control-plaintext" : "form-control"}
											type="text"
											onChange={this.handlePhoneNumberChange}
											value={this.state.phoneNumber}
										/>
									</div>
									<div className="text-danger" style={{ display: this.state.phoneError }}>
										Phone number must be entered.
									</div>
								</div>
								<div className="form-group text-center" hidden={this.state.hiddenEditInfo}>
									<button
										style={{ background: "#1977cc", marginTop: "15px" }}
										onClick={this.handleChangeInfo}
										className="btn btn-primary btn-xl"
										id="sendMessageButton"
										type="button"
									>
										Change information
									</button>
								</div>
								<br />

								<div className="form-group">
									<div className="form-group controls mb-0 pb-2">
										<div className="form-row justify-content-center">
											<div className="form-col" hidden={!this.state.hiddenEditInfo}>
												<button
													onClick={this.handleEditInfoClick}
													className="btn btn-outline-primary btn-xl"
													id="sendMessageButton"
													type="button"
												>
													Edit Info
												</button>
											</div>
											<div className="form-col ml-3">
												<button
													onClick={this.handlePasswordModal}
													className="btn btn-outline-primary btn-xl"
													id="sendMessageButton"
													type="button"
												>
													Change Password
												</button>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
				<PasswordChangeModal
					handleCloseAlertPassword={this.handleCloseAlertPassword}
					hiddenPasswordErrorAlert={this.state.hiddenPasswordErrorAlert}
					errorPasswordHeader={this.state.errorPasswordHeader}
					errorPasswordMessage={this.state.errorPasswordMessage}
					oldPasswordEmptyError={this.state.oldPasswordEmptyError}
					newPasswordEmptyError={this.state.newPasswordEmptyError}
					newPasswordRetypeEmptyError={this.state.newPasswordRetypeEmptyError}
					newPasswordRetypeNotSameError={this.state.newPasswordRetypeNotSameError}
					show={this.state.openPasswordModal}
					changePassword={this.changePassword}
					onCloseModal={this.handlePasswordModalClose}
					header="Change password"
				/>
			</React.Fragment>
		);
	}
}

export default PharmacyAdminProfilPage;
