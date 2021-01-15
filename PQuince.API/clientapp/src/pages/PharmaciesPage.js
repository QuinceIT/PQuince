import React, { Component } from 'react';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import Axios from 'axios';
import {BASE_URL} from '../constants.js';
import PharmacyLogo from '../static/pharmacyLogo.png';

class PharmaciesPage extends Component {
    state = {
        pharmacies: [],
        formShowed: false,
        name:"",
        gradeFrom:"",
        gradeTo:"",
        distanceFrom:"",
        distanceTo:"",
        showingSearched:false,
    }

    handleNameChange = (event) => {
        this.setState({name: event.target.value});
    }

    componentDidMount() {
        Axios
        .get(BASE_URL + "/api/pharmacy").then((res) =>{
            this.setState({pharmacies : res.data});
            console.log(res.data);
        }).catch((err) => {console.log(err);});
    }

    hangleFormToogle = () => {
        this.setState({formShowed: !this.state.formShowed});
    }

    handleGradeFromChange = (event) => {
        this.setState({gradeFrom: event.target.value});
    }
    
    handleGradeToChange = (event) => {
        this.setState({gradeTo: event.target.value});
    }

    handleDistanceFromChange = (event) => {
        this.setState({distanceFrom: event.target.value});
    }

    handleDistanceToChange = (event) => {
        this.setState({distanceTo: event.target.value});
    }

    handleSearch = () => {

        let gradeFrom = this.state.gradeFrom;
        let gradeTo = this.state.gradeTo;
        let distanceFrom = this.state.distanceFrom;
        let distanceTo = this.state.distanceTo;

        if(gradeFrom === "") gradeFrom = 0;
        if(gradeTo === "") gradeTo = 0;
        if(distanceFrom === "") distanceFrom = 0;
        if(distanceTo === "") distanceTo = 0;

        const SEARCH_URL = BASE_URL + '/api/pharmacy/search?name=' + this.state.name + '&gradeFrom=' + gradeFrom + '&gradeTo=' + gradeTo
                                    + '&distanceFrom=' + distanceFrom + '&distanceTo=' + distanceTo;

        Axios
        .get(SEARCH_URL).then((res) =>{
            this.setState({pharmacies : res.data, formShowed:false, showingSearched:true});
            console.log(res.data);
        }).catch((err) => {console.log(err);});
    }

    handleResetSearch = () => {
        Axios
        .get(BASE_URL + "/api/pharmacy").then((res) =>{
            this.setState({pharmacies : res.data, formShowed:false, showingSearched:false, name:"", gradeFrom:"", gradeTo:"", distanceFrom:"", distanceTo:""});
            console.log(res.data);
        }).catch((err) => {console.log(err);});
    }

    render() { 
        return ( 
        <React.Fragment>
            <TopBar/>
            <Header/>
            

            <div className="container" style={{marginTop:"10%"}}>
                    <h5 className=" text-center mb-0 mt-2 text-uppercase">Pharmacies</h5>
                
                    <button className="btn btn-outline-primary btn-xl" type="button" onClick={this.hangleFormToogle}>
                        <i className="icofont-rounded-down mr-1"></i>
                        Search pharmacies
                    </button>
                    <form class={this.state.formShowed ? "form-inline mt-3" : "form-inline mt-3 collapse"} width="100%" id="formCollapse">
                        <div class="form-group mb-2"  width="100%">
                            <input placeholder="Name" class="form-control mr-3" style={{width: "9em"}} type="text" min="0" max="5" onChange={this.handleNameChange} value={this.state.name} />

                            <input placeholder="Grade from" class="form-control mr-3" style={{width: "9em"}} type="number" min="1" max="5" onChange={this.handleGradeFromChange} value={this.state.gradeFrom} />
                            <input placeholder="Grade to" class="form-control" style={{width: "9em"}} type="number" min="1" max="5" onChange={this.handleGradeToChange} value={this.state.gradeTo} />

                            <div className="ml-5 mr-3">
                                <input placeholder="Distance from" class="form-control" style={{width: "14em"}} type="number" min="0" max="50" onChange={this.handleDistanceFromChange} value={this.state.distanceFrom} />
                                <span className="ml-1">km</span>
                            </div>
                            <div>
                                <input placeholder="Distance to" class="form-control" style={{width: "14em"}} type="number" min="0" max="50" onChange={this.handleDistanceToChange} value={this.state.distanceTo} />
                                <span className="ml-1">km</span>
                            </div>

                            <div  className="text-center ml-5">
                                <button style={{background: "#1977cc"}} onClick = {this.handleSearch} className="btn btn-primary btn-xl" type="button">
                                    <i className="icofont-search mr-1"></i>
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className={this.state.showingSearched ? "form-group mt-2" : "form-group mt-2 collapse"}>
                        <button type="button" className="btn btn-outline-secondary" onClick={this.handleResetSearch}><i className="icofont-close-line mr-1"></i>Reset criteria</button>

                    </div>


                    <table className="table" style={{width:"100%", marginTop:"3rem"}}>
                        <tbody>
                            {this.state.pharmacies.map(pharmacy => 
                                <tr id={pharmacy.Id} key={pharmacy.Id} onClick={this.handle}>
                                    <td width="130em">
                                        <img className="img-fluid" src={PharmacyLogo} width="70em"/>
                                    </td>
                                    <td>
                                        <div><b>Name:</b> {pharmacy.EntityDTO.name}</div>
                                        <div><b>Address:</b> {pharmacy.EntityDTO.address}</div>
                                        <div><b>Grade:</b> {pharmacy.EntityDTO.grade}<i className="icofont-star" style={{color:"#1977cc"}}></i></div>
                                    </td>
                                </tr>)}

                        </tbody>
                    </table>
            </div>
        </React.Fragment> );
    }
}
 
export default PharmaciesPage;