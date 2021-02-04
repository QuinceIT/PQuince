import React, { Component } from "react";
import TopBar from "../../components/TopBar";
import Header from "../../components/Header"
import Axios from "axios";
import { BASE_URL } from "../../constants.js";
import dermatologistLogo from "../../static/dermatologistLogo.png";
import WorkTimesModal from "../../components/WorkTimesModal";
import getAuthHeader from "../../GetHeader";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import HeadingSuccessAlert from "../../components/HeadingSuccessAlert";
import HeadingAlert from "../../components/HeadingAlert";

class PharmacistPage extends Component {
	state = {
        pharmacists: [],
        staffIdForWorkTimes:'',
        showWorkTimesModal: false,
        showAddDermatologistModal: false,
        workTimes:[],
        forStaff:'',
        formShowed:false,
        searchName:'',
        searchSurname:'',
        searchGradeFrom:'',
        searchGradeTo:'',
        showingSearched: false,
        pharmaciesForDermatologist:[],
        dermatologistToEmploye:[],
        showingSorted:false,
        pharmacyId:'',
        hiddenSuccessAlert: true,
		successHeader: "",
		successMessage: "",
		hiddenFailAlert: true,
		failHeader: "",
		failMessage: "",
    };

    componentDidMount() {
		let pharmacyId=localStorage.getItem("keyPharmacyId")
		this.setState({
			pharmacyId: pharmacyId
		})


		Axios.get(BASE_URL + "/api/users/pharmacist-for-pharmacy/"  + localStorage.getItem("keyPharmacyId"), {
			headers: { Authorization: getAuthHeader() },
		})
			.then((res) => {
				this.setState({ pharmacists: res.data });
                console.log(res.data);
            
			})
			.catch((err) => {
				console.log(err);
			});
    }


    handleAddPharmacistModalClose = () => {
        Axios.get(BASE_URL + "/api/users/dermatologist-for-pharmacy/"  + this.state.pharmacyId , {
			headers: { Authorization: getAuthHeader() },
		})
			.then((res) => {
				this.setState({ pharmacists: res.data });
                console.log(res.data);
            
			})
			.catch((err) => {
				console.log(err);
			});
        this.setState({ showAddDermatologistModal: false });
    }
    
    
    handleAddPharmacistClick = () => {
        Axios.get(BASE_URL + "/api/users/dermatologist-for-emplooye-in-pharmacy/"+this.state.pharmacyId, {
			headers: { Authorization: getAuthHeader() },
		}).then((res) => {
                this.setState({ dermatologistToEmploye: res.data });

				console.log(res.data);
		})
			.catch((err) => {
				console.log(err);
		});
        this.setState({
			showAddDermatologistModal: true,
		});
    }

    handleModalClose = () => {
        this.setState({showWorkTimesModal: false});
    }


    onWorkTimeClick = (id) =>{
        
		Axios.get(BASE_URL + "/api/worktime/worktime-for-staff/" + id, {
			headers: { Authorization: getAuthHeader() },
		})
        .then((res) => {
            this.setState({ workTimes: res.data , forStaff:id});
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
        this.setState({
            showWorkTimesModal: true
        });
    }

    removePharmacistClick = (id) =>{

        confirmAlert({
            message: 'Are you sure to remove pharmacist.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    let removePharmacistDTO = {
                        pharmacyId : this.state.pharmacyId,
                        pharmacistId: id,
                    };
            
                    Axios
                    .put(BASE_URL + "/api/users/remove-pharmacyist-from-pharmacy", removePharmacistDTO, {
                        headers: { Authorization: getAuthHeader() },
                    }).then((res) =>{
                        console.log(res.data);
                        this.setState({
                            hiddenSuccessAlert: false,
                            hiddenFailAlert:true,
                            successHeader: "Success",
                            successMessage: "You successfully remove pharmacist.",
                        })
                        Axios.get(BASE_URL + "/api/users/pharmacist-for-pharmacy/"  + localStorage.getItem("keyPharmacyId"), {
                            headers: { Authorization: getAuthHeader() },
                        })
                            .then((res) => {
                                this.setState({ pharmacists: res.data });
                                console.log(res.data);
                            
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                        
                    }).catch((err) => {
                        this.setState({ 
                            hiddenSuccessAlert: true,
                            hiddenFailAlert: false, 
                            failHeader: "Unsuccess", 
                            failMessage: "It is not possible to remove the pharmacist"});
                    });
                }
              },
              {
                label: 'No',
                onClick: () => {
                    
                }
              }
            ]
        });
       
    }

    hangleFormToogle = () => {
		this.setState({ formShowed: !this.state.formShowed });
    };
    
    handleNameChange = (event) => {
		this.setState({ searchName: event.target.value });
    };
    
    handleSurnameChange = (event) => {
		this.setState({ searchSurname: event.target.value });
    };
    
    handleGradeFromChange = (event) => {
		this.setState({ searchGradeFrom: event.target.value });
	};

	handleGradeToChange = (event) => {
		this.setState({ searchGradeTo: event.target.value });
    };


    
    handleSearchClick = () =>{
			if (
				!(
					this.state.searchGradeFrom === "" &&
					this.state.searchGradeTo === "" &&
					this.state.searchName === "" &&
					this.state.searchSurname === ""
				)
			) {
				let gradeFrom = this.state.searchGradeFrom;
				let gradeTo = this.state.searchGradeTo;
				let name = this.state.searchName;
				let surname = this.state.searchSurname;

				if (gradeFrom === "") gradeFrom = -1;
				if (gradeTo === "") gradeTo = -1;
				if (name === "") name = '';
				if (surname === "") surname = '';

				const SEARCH_URL =
					BASE_URL +
					"/api/users/search-dermatologist-for-pharmacy?name=" +
                    name +
                    "&surname=" +
					surname +
					"&gradeFrom=" +
					gradeFrom +
					"&gradeTo=" +
					gradeTo +
					"&pharmacyId=" +
					'cafeddee-56cb-11eb-ae93-0242ac130202';

				Axios.get(SEARCH_URL, {
                    headers: { Authorization: getAuthHeader() },
                })
					.then((res) => {
						this.setState({
							pharmacists: res.data,
							formShowed: false,
							showingSearched: true,
						});
						console.log(res.data);
					})
					.catch((err) => {
						console.log(err);
					});
			}
     }

     handleResetSearch = () => {

        Axios.get(BASE_URL + "/api/users/dermatologist-for-pharmacy/cafeddee-56cb-11eb-ae93-0242ac130202" , {
			headers: { Authorization: getAuthHeader() },
		})
			.then((res) => {
				this.setState({ 
                    pharmacists: res.data ,
                    formShowed: false,
					showingSearched: false,
					searchName: "",
                    searchSurname: "",
                    searchGradeFrom: "",
					searchGradeTo: "",

                });
                console.log(res.data);
            
			})
			.catch((err) => {
				console.log(err);
            });
            
	
	};

    handleCloseAlertSuccess = () => {
		this.setState({ hiddenSuccessAlert: true });
    };
    
    handleCloseAlertFail = () => {
		this.setState({ hiddenFailAlert: true });
	};

    render() {
        const myStyle = {
			color: "white",
			textAlign: "center",
		};
		return (
        <React.Fragment>
            <div>

            </div>

                    <TopBar />
                    <Header />

                

                    
                    <div className="container" style={{ marginTop: "10%" }} >
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
                        <nav className="nav-menu d-none d-lg-block">
                            <ul>
                                <li>
                                    <a href="#"  className="appointment-btn scrollto" style={myStyle} onClick={this.handleAddPharmacistClick}>
                                        Add pharmacists
                                    </a>
                                </li>
                            </ul>
                        </nav>

                        <button
                            className="btn btn-outline-primary btn-xl"
                            type="button"
                            onClick={this.hangleFormToogle}
                        >
                            <i className="icofont-rounded-down mr-1"></i>
                            Search pharmacists
                        </button>
                        <form
                            className={
                                this.state.formShowed ? "form-inline mt-3" : "form-inline mt-3 collapse"
                            }
                            width="100%"
                            id="formCollapse"
                            >
                            <div className="form-group mb-2" width="100%">
                                <input
                                    placeholder="Name"
                                    className="form-control mr-3"
                                    style={{ width: "9em" }}
                                    type="text"
                                    onChange={this.handleNameChange}
                                    value={this.state.searchName}
                                />

                                <input
                                    placeholder="LastName"
                                    className="form-control mr-3"
                                    style={{ width: "9em" }}
                                    type="text"
                                    onChange={this.handleSurnameChange}
                                    value={this.state.searchSurname}
                                />

                                <input
                                    placeholder="Grade from"
                                    className="form-control mr-3"
                                    style={{ width: "9em" }}
                                    type="number"
                                    min="1"
                                    max="5"
                                    onChange={this.handleGradeFromChange}
                                    value={this.state.searchGradeFrom}
                                />
                                <input
                                    placeholder="Grade to"
                                    className="form-control"
                                    style={{ width: "9em" }}
                                    type="number"
                                    min="1"
                                    max="5"
                                    onChange={this.handleGradeToChange}
                                    value={this.state.searchGradeTo}
                                />
                                
                            </div>
                            <div style={{marginLeft:'1%'}}>

                                <button
                                    style={{ background: "#1977cc" },{marginLeft:'15%'},{marginBottom:'8%'}}
                                    onClick={this.handleSearchClick}
                                    className="btn btn-primary btn-x2"
                                    type="button"
                                        >
                                    <i className="icofont-search mr-1"></i>
                                    Search
                                </button>
                            </div>

                        </form>

                        <div
						className={
							this.state.showingSearched
								? "form-group mt-2"
								: "form-group mt-2 collapse"
						}
					>
						<button
							type="button"
							className="btn btn-outline-secondary"
							onClick={this.handleResetSearch}
						>
							<i className="icofont-close-line mr-1"></i>Reset criteria
						</button>
					</div>

                        <table className="table" style={{ width: "100%", marginTop: "3rem" }}>
                            <tbody>
                                {this.state.pharmacists.map((pharmacist) => (
                                    <tr id={pharmacist.Id} key={pharmacist.Id}>
                                        <td width="130em">
                                            <img
                                                className="img-fluid"
                                                src={dermatologistLogo}
                                                width="70em"
                                            />
                                        </td>

                                        <td>
                                            <div>
                                                <b>Name: </b> {pharmacist.EntityDTO.name}
                                            </div>
                                            <div>
                                                <b>Surname: </b> {pharmacist.EntityDTO.surname}
                                            </div>
                                            <div>
                                                <b>Pharmacy: </b> {pharmacist.EntityDTO.pharmacyName}
                                            </div>
                                            <div>
                                                <b>Grade: </b> {pharmacist.EntityDTO.grade}
                                                <i
                                                    className="icofont-star"
                                                    style={{ color: "#1977cc" }}
                                                ></i>
                                            </div>
                                        </td>
                                        <td >
                                            <div style={{marginLeft:'55%'}}>
                                                <button style={{height:'30px'},{verticalAlign:'center'}} className="btn btn-outline-secondary" onClick={() => this.onWorkTimeClick(pharmacist.Id)} type="button"><i className="icofont-subscribe mr-1"></i>WorkTimes</button>
                                                <br></br>
                                                <button style={{height:'30px'},{verticalAlign:'center'},{marginTop:'2%'}} className="btn btn-outline-secondary mt-1" onClick={() => this.removePharmacistClick(pharmacist.Id)} type="button"><i className="icofont-subscribe mr-1"></i>Remove pharmacist</button>
                                            </div>
                                               
                                        </td>
                                    </tr>

                                ))}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>

                                </tr>
                            </tbody>
                        </table>

                    </div>
                    <div>
                        <WorkTimesModal show={this.state.showWorkTimesModal} onCloseModal={this.handleModalClose} workTimesForStaff={this.state.workTimes} forPharmacy={this.state.forPharmacy} forStaff={this.state.forStaff} header="WorkTimes" />
                    </div>
                </React.Fragment>
		);
	}
}

export default PharmacistPage