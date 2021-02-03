import React, { Component } from "react";
import Header from "../components/Header";
import TopBar from "../components/TopBar";
import { BASE_URL } from "../constants.js";
import Axios from "axios";
import PasswordChangeModal from "../components/PasswordChangeModal";
import ModalDialog from "../components/ModalDialog";
import { YMaps, Map } from "react-yandex-maps";
import getAuthHeader from "../GetHeader";

const mapState = {
	center: [44, 21],
	zoom: 8,
	controls: [],
};

class StaffProfilePage extends Component {
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
		openPasswordModal: false,
		openSuccessModal: false
	};

	constructor(props) {
		super(props);
		this.addressInput = React.createRef();
	}

	onYmapsLoad = (ymaps) => {
		this.ymaps = ymaps;

		this.ymaps
			.geocode([this.state.address.latitude, this.state.address.longitude], {
				results: 1,
			})
			.then(function (res) {
				var firstGeoObject = res.geoObjects.get(0);
				document
					.getElementById("suggest")
					.setAttribute("value", firstGeoObject.getAddressLine());
				console.log(firstGeoObject.getAddressLine());
			});

		new this.ymaps.SuggestView(this.addressInput.current, {
			provider: {
				suggest: (request, options) => this.ymaps.suggest(request),
			},
		});
	};

	componentDidMount() {
		this.addressInput = React.createRef();

		Axios.get(BASE_URL + "/api/users/staff", { headers: { Authorization: getAuthHeader() } })
			.then((res) => {
				console.log(res.data);
				this.setState({
					id: res.data.Id,
					email: res.data.EntityDTO.email,
					name: res.data.EntityDTO.name,
					surname: res.data.EntityDTO.surname,
					address: res.data.EntityDTO.address,
					phoneNumber: res.data.EntityDTO.phoneNumber
				});
			})
			.catch((err) => {
				console.log(err);
			});
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

	validateForm = (userDTO) => {
		this.setState({
			nameError: "none",
			surnameError: "none",
			cityError: "none",
			addressError: "none",
			phoneError: "none",
		});

		if (userDTO.name === "") {
			this.setState({ nameError: "initial" });
			return false;
		} else if (userDTO.surname === "") {
			this.setState({ surnameError: "initial" });
			return false;
		} else if (this.addressInput.current.value === "") {
			this.setState({ addressError: "initial" });
			return false;
		} else if (userDTO.phoneNumber === "") {
			this.setState({ phoneError: "initial" });
			return false;
		}
		return true;
	};

	handleSuccessModalClose = () => {
		this.setState({ openSuccessModal: false });
	};

	handlePasswordModalClose = () => {
		this.setState({ openPasswordModal: false });
	};

	handleChangeInfo = () => {
		let street;
		let city;
		let country;
		let latitude;
		let longitude;

		this.ymaps
			.geocode(this.addressInput.current.value, {
				results: 1,
			})
			.then(function (res) {
				var firstGeoObject = res.geoObjects.get(0),
					coords = firstGeoObject.geometry.getCoordinates();
				latitude = coords[0];
				longitude = coords[1];
				country = firstGeoObject.getCountry();
				street = firstGeoObject.getThoroughfare();
				city = firstGeoObject.getLocalities().join(", ");
			})
			.then((res) => {
				let userDTO = {
					name: this.state.name,
					surname: this.state.surname,
					address: { street, country, city, latitude, longitude },
					phoneNumber: this.state.phoneNumber,
				};
				console.log(userDTO);

				if (this.validateForm(userDTO)) {
					console.log(userDTO);
					Axios.put(BASE_URL + "/api/users/staff", userDTO, { headers: { Authorization: getAuthHeader() } })
						.then((res) => {
							console.log("Success");
							this.setState({ openSuccessModal: true });
						})
						.catch((err) => {
							console.log(err);
						});
				}
			});
	};

	handlePasswordModal = () => {
		this.setState({ openPasswordModal: true });
	};

	changePassword = (oldPassword, newPassword, newPasswordRetype) => {
		this.setState({
			oldPasswordEmptyError: "none",
			newPasswordEmptyError: "none",
			newPasswordRetypeEmptyError: "none",
			newPasswordRetypeNotSameError: "none",
		});

		if (oldPassword === "") {
			this.setState({ oldPasswordEmptyError: "initial" });
		} else if (newPassword === "") {
			this.setState({ newPasswordEmptyError: "initial" });
		} else if (newPasswordRetype === "") {
			this.setState({ newPasswordRetypeEmptyError: "initial" });
		} else if (newPasswordRetype !== newPassword) {
			this.setState({ newPasswordRetypeNotSameError: "initial" });
		}
	};

	render() {
		return (
			<React.Fragment>
				<TopBar />
				<Header />

				<div className="container" style={{ marginTop: "8%" }}>
					<h5 className=" text-center  mb-0 text-uppercase" style={{ marginTop: "2rem" }}>
						User information
					</h5>

					<div className="row section-design">
						<div className="col-lg-8 mx-auto">
							<br />
							<form id="contactForm" name="sentMessage">
								<div className="control-group">
									<div
										className="form-group controls mb-0 pb-2"
										style={{ color: "#6c757d", opacity: 1 }}
                                    >
									</div>
								</div>
								<br />
								<div className="control-group">
									<div
										className="form-group controls mb-0 pb-2"
										style={{ color: "#6c757d", opacity: 1 }}
									>
										<label>Email address:</label>
										<input
											readOnly
											placeholder="Email address"
											className="form-control"
											id="name"
											type="text"
											onChange={this.handleEmailChange}
											value={this.state.email}
										/>
									</div>
								</div>
								<div className="control-group">
									<div
										className="form-group controls mb-0 pb-2"
										style={{ color: "#6c757d", opacity: 1 }}
									>
										<label>Name:</label>
										<input
											placeholder="Name"
											className="form-control"
											type="text"
											onChange={this.handleNameChange}
											value={this.state.name}
										/>
									</div>
									<div
										className="text-danger"
										style={{ display: this.state.nameError }}
									>
										Name must be entered.
									</div>
								</div>
								<div className="control-group">
									<div
										className="form-group controls mb-0 pb-2"
										style={{ color: "#6c757d", opacity: 1 }}
									>
										<label>Surname:</label>
										<input
											placeholder="Surname"
											className="form-control"
											type="text"
											onChange={this.handleSurnameChange}
											value={this.state.surname}
										/>
									</div>
									<div
										className="text-danger"
										style={{ display: this.state.surnameError }}
									>
										Surname must be entered.
									</div>
								</div>
								<div className="control-group">
									<div
										className="form-group controls mb-0 pb-2"
										style={{ color: "#6c757d", opacity: 1 }}
									>
										<label>Address:</label>
										<input
											className="form-control"
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
									<div
										className="text-danger"
										style={{ display: this.state.addressError }}
									>
										Address must be entered.
									</div>
								</div>
								<div className="control-group">
									<div
										className="form-group controls mb-0 pb-2"
										style={{ color: "#6c757d", opacity: 1 }}
									>
										<label>Phone number:</label>
										<input
											placeholder="Phone number"
											className="form-control"
											type="text"
											onChange={this.handlePhoneNumberChange}
											value={this.state.phoneNumber}
										/>
									</div>
									<div
										className="text-danger"
										style={{ display: this.state.phoneError }}
									>
										Phone number must be entered.
									</div>
								</div>
								<div className="form-group text-center">
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
										<div className="form-row">
											<div className="form-col ml-3">
												<button
													style={{ marginTop: "15px" }}
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
					oldPasswordEmptyError={this.state.oldPasswordEmptyError}
					newPasswordEmptyError={this.state.newPasswordEmptyError}
					newPasswordRetypeEmptyError={this.state.newPasswordRetypeEmptyError}
					newPasswordRetypeNotSameError={this.state.newPasswordRetypeNotSameError}
					show={this.state.openPasswordModal}
					changePassword={this.changePassword}
					onCloseModal={this.handlePasswordModalClose}
					header="Change password"
				/>
				<ModalDialog
					show={this.state.openSuccessModal}
					onCloseModal={this.handleSuccessModalClose}
					header="Successful"
					text="Your information is changed succesfully."
				/>
			</React.Fragment>
		);
	}
}

export default StaffProfilePage;
