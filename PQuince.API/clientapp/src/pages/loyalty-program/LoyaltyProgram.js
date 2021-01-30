import React, { Component } from "react";
import Header from "../../components/Header";
import TopBar from "../../components/TopBar";
import { BASE_URL } from "../../constants.js";
import ModalDialog from "../../components/ModalDialog";
import Axios from "axios";
import getAuthHeader from "../../GetHeader";

class LoyaltyProgram extends Component {
state = {
		id: "791fee27-bb12-4340-9b0a-a7c9ef575278",
		pointsForAppointment: "",
		pointsForConsulting: "",
		pointsToEnterRegularCathegory: "",
		pointsToEnterSilverCathegory: "",
		pointsToEnterGoldCathegory: "",
		nameError: "none",
		surnameError: "none",
		addressError: "none",
		phoneError: "none",
		openSuccessModal: false,
		loyalityRegularColor: "#1977cc",
		loyalitySilverColor: "#808080",
		loyalityGoldColor: "#FFCC00",
	};

	
	componentDidMount() {
	
		Axios.get(BASE_URL + "/api/loyaltyProgram/791fee27-bb12-4340-9b0a-a7c9ef575278", { headers: { Authorization: getAuthHeader() } })
			.then((res) => {
				console.log(res.data);
				this.setState({
					id: res.data.Id,
					pointsForAppointment: res.data.EntityDTO.pointsForAppointment,
					pointsForConsulting: res.data.EntityDTO.pointsForConsulting,
					pointsToEnterRegularCathegory: res.data.EntityDTO.pointsToEnterRegularCathegory,
					pointsToEnterSilverCathegory: res.data.EntityDTO.pointsToEnterSilverCathegory,
					pointsToEnterGoldCathegory: res.data.EntityDTO.pointsToEnterGoldCathegory,
				});
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handlePointsForAppointmentChange = (event) => {
		this.setState({ pointsForAppointment: event.target.value });
	};

	handlePointsForConsultingChange = (event) => {
		this.setState({ pointsForConsulting: event.target.value });
	};

	handlePointsToEnterRegularCathegoryChange = (event) => {
		this.setState({ pointsToEnterRegularCathegory: event.target.value });
	};

	handlePointsToEnterSilverCathegoryChange = (event) => {
		this.setState({ pointsToEnterSilverCathegory: event.target.value });
	};
	
	handlePointsToEnterGoldCathegoryChange = (event) => {
		this.setState({ pointsToEnterGoldCathegory: event.target.value });
	};
	
	handleSuccessModalClose = () => {
		this.setState({ openSuccessModal: false });
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



	handleChangeInfo = () => {
		let loyaltyProgramDTO = {
					pointsForAppointment: this.state.pointsForAppointment*1,
					pointsForConsulting: this.state.pointsForConsulting*1,
					pointsToEnterRegularCathegory: this.state.pointsToEnterRegularCathegory*1,
					pointsToEnterSilverCathegory: this.state.pointsToEnterSilverCathegory*1,
					pointsToEnterGoldCathegory: this.state.pointsToEnterGoldCathegory*1,
				};
				console.log(loyaltyProgramDTO);

				Axios.put(BASE_URL + "/api/loyaltyProgram/" + this.state.id, loyaltyProgramDTO, { headers: { Authorization: getAuthHeader()}})
					.then((res) => {
						console.log("Success");
						this.setState({ openSuccessModal: true });
					})
					.catch((err) => {
						console.log("GRESKA");
						console.log(err);
					});
				
	};
	
	render() {
		return (
			<React.Fragment>
				<TopBar />
				<Header />

				<div className="container" style={{ marginTop: "8%" }}>
					<h5 className=" text-center  mb-0 text-uppercase" style={{ marginTop: "2rem" }}>
						LOYALTY PROGRAM
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
										<div className="form-row">
											<div className="form-col" style={{ fontSize: "1.5em" }}>
												Number of points  to enter cathegory:{" "}
											</div>
											<div
												className="form-col ml-2 rounded pr-2 pl-2"
												style={{
													color: "white",
													background: this.state.loyalityCategoryColor,
													fontSize: "1.5em",
												}}
											>
											</div>
										</div>
									</div>
								</div>
								<br />
								<div className="control-group">
									<div
										className="form-group controls mb-0 pb-2"
										style={{ color: "#6c757d", opacity: 1 }}
									>
										<div className="form-row">
											
											<div
												className="form-col ml-2 rounded pr-2 pl-2"
												style={{
													color: "white",
													background: this.state.loyalityRegularColor,
													fontSize: "1.5em",
												}}
											>
												REGULAR
											</div>
											<div
												className="form-group controls mb-0 pb-2"
												style={{ color: "#6c757d", opacity: 1 }}
											>
												<input
													className="form-control"
													type="text"
													onChange={this.handlePointsToEnterRegularCathegoryChange}
													value={this.state.pointsToEnterRegularCathegory}
												/>
											</div>
										</div>
									</div>
								</div>
								<br />
										<div className="control-group">
									<div
										className="form-group controls mb-0 pb-2"
										style={{ color: "#6c757d", opacity: 1 }}
									>
										<div className="form-row">
											
											<div
												className="form-col ml-2 rounded pr-2 pl-2"
												style={{
													color: "white",
													background: this.state.loyalitySilverColor,
													fontSize: "1.5em",
												}}
											>
												SILVER
											</div>
											<div
												className="form-group controls mb-0 pb-2"
												style={{ color: "#6c757d", opacity: 1 }}
											>
												<input
													className="form-control"
													type="text"
													onChange={this.handlePointsToEnterSilverCathegoryChange}
													value={this.state.pointsToEnterSilverCathegory}
												/>
											</div>
										</div>
									</div>
								</div>
								<br />
										<div className="control-group">
									<div
										className="form-group controls mb-0 pb-2"
										style={{ color: "#6c757d", opacity: 1 }}
									>
										<div className="form-row">
											
											<div
												className="form-col ml-2 rounded pr-2 pl-2"
												style={{
													color: "white",
													background: this.state.loyalityGoldColor,
													fontSize: "1.5em",
												}}
											>
												GOLD
											</div>
											<div
												className="form-group controls mb-0 pb-2"
												style={{ color: "#6c757d", opacity: 1 }}
											>
												<input
													className="form-control"
													type="text"
													onChange={this.handlePointsToEnterGoldCathegoryChange}
													value={this.state.pointsToEnterGoldCathegory}
												/>
											</div>
										</div>
									</div>
								</div>
								
								<br />
								<div className="control-group">
									<div
										className="form-group controls mb-0 pb-2"
										style={{ color: "#6c757d", opacity: 1 }}
									>
										<div className="form-row">
											<div className="form-col" style={{ fontSize: "1.5em" }}>
												Number of points for consulting:{" "}
											</div>
											<div
												className="form-group controls mb-0 pb-2"
												style={{ color: "#6c757d", opacity: 1 }}
											>
												<input
													className="form-control"
													type="text"
													onChange={this.handlePointsForConsultingChange}
													value={this.state.pointsForConsulting}
												/>
											</div>
										</div>
									</div>
								</div>
								<br />
								<div className="control-group">
									<div
										className="form-group controls mb-0 pb-2"
										style={{ color: "#6c757d", opacity: 1 }}
									>
										<div className="form-row">
											<div className="form-col" style={{ fontSize: "1.5em" }}>
												Number of points for appointment:{" "}
											</div>
											<div
												className="form-group controls mb-0 pb-2"
												style={{ color: "#6c757d", opacity: 1 }}
											>
												<input
													className="form-control"
													type="text"
													onChange={this.handlePointsForAppointmentChange}
													value={this.state.pointsForAppointment}
												/>
											</div>
										</div>
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

								
							</form>
						</div>
					</div>
				</div>
				<ModalDialog
					show={this.state.openSuccessModal}
					href="/"
					onCloseModal={this.handleSuccessModalClose}
					header="Successful"
					text="Your information is changed succesfully."
				/>
			</React.Fragment>
		);
	}
}

export default LoyaltyProgram