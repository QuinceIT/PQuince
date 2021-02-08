import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import CapsuleLogo from '../static/capsuleLogo.png';
import Axios from 'axios';
import {BASE_URL} from '../constants.js';
import DatePicker from "react-datepicker";
import getAuthHeader from "../GetHeader";
import HeadingSuccessAlert from "../components/HeadingSuccessAlert";
import HeadingAlert from "../components/HeadingAlert";
import { Redirect } from "react-router-dom";

class CreateOrdersModal extends Component {
    state = {
        drugsToAdd: [] ,
        drugs:[],
        showModalPage:'FIRST',
        modalSize:'lg',    
        selectedDate:new Date(),
        pharmacyId:'',
        drugForAdd:'',
        selectedCount:'',
        showDate:false,
        hiddenSuccessAlert: true,
		successHeader: "",
		successMessage: "",
		hiddenFailAlert: true,
		failHeader: "",
		failMessage: "",   
        unauthorizedRedirect: false,
    }

    addItem = item => {
        this.setState({
            drugsToAdd: [
            ...this.state.drugsToAdd,
            item 
          ]
        })
    }

    componentDidMount() {
		let pharmacyId=localStorage.getItem("keyPharmacyId")
		this.setState({
			pharmacyId: pharmacyId
		})

        Axios
        .get(BASE_URL + "/api/drug/find-drugs-by-pharmacy-for-admin?pharmacyId="+ pharmacyId, {
			headers: { Authorization: getAuthHeader() },
		}).then((res) =>{
            this.setState({drugs : res.data});
            console.log(res.data);
        }).catch((err) => {console.log(err);});
    }

    removePeople(e) {
        var array = [...this.state.drugs]; // make a separate copy of the array
        var index = array.indexOf(e)
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({drugs: array});
        }
      }

    handleAdd = () => {

        if(this.state.selectedCount<1){
            this.setState({ 
                hiddenSuccessAlert: true,
                hiddenFailAlert: false, 
                failHeader: "Unsuccess", 
                failMessage: "The amount of drug must be more than 0"
            });         }
        else{
            let drugDTO = {
                drugInstanceId: this.state.drugForAdd.Id,
                drugName: this.state.drugForAdd.EntityDTO.name,
                drugInstanceName: this.state.drugForAdd.EntityDTO.drugInstanceName,
                drugManufacturer: this.state.drugForAdd.EntityDTO.manufacturerName,
                amount:this.state.selectedCount
            }
    
            this.removePeople(this.state.drugForAdd);
            
            this.addItem(drugDTO);
    
            this.setState({
                showModalPage:'FIRST',
                selectedCount:'',
                drugForAdd:''
            })   
        }
    }

    handleCreateOrder = () =>{
        let drugDTO = {
            drugs: this.state.drugsToAdd,
            endDate:this.state.selectedDate
        }

        Axios
        .post(BASE_URL + "/api/order", drugDTO, {
            validateStatus: () => true,
            headers: { Authorization: getAuthHeader() },})
        .then((res) =>{
            if (res.status === 201) {
                this.setState({
                    hiddenSuccessAlert: false,
                    hiddenFailAlert:true,
                    successHeader: "Success",
                    successMessage: "You successfully add new order for drugs.",
                    newPrice:1, 
                    selectedStartDate:new Date(),
                })
                this.props.updateDrugs();
                this.props.onCloseSuccess();
            }else if(res.status===400){
                this.setState({ 
                    hiddenSuccessAlert: true,
                    hiddenFailAlert: false, 
                    failHeader: "Unsuccess", 
                    failMessage: "Currently not possible to add new order for drugs"
                });
            }else if(res.status===401){
                this.setState({ 
                    unauthorizedRedirect:true
                });
            }
        }).catch((err) => {
        });
    }

    isValidData = (addDrugToPharmacyDTO) =>{
        if(addDrugToPharmacyDTO.drugId===''){
            return false
        }

        if(addDrugToPharmacyDTO.dateTo===new Date()){
            return false
        }

        if(addDrugToPharmacyDTO.amount<1){
            return false
        }

        if(addDrugToPharmacyDTO.price<1){
            return false
        }

        return true
    }

    handleSelectedDateChange = (date) => {
        this.setState({
            selectedDate:date,
        });

    }

    handlePriceChange = (event) => {
        this.setState({price:event.target.value});
    }

    handleSelectedCountChange = (event) => {
        this.setState({selectedCount:event.target.value});
    }

    handleClickOnCreateOrder = () =>{
        if(this.state.drugsToAdd.length<1){
            this.setState({ 
                hiddenSuccessAlert: true,
                hiddenFailAlert: false, 
                failHeader: "Unsuccess", 
                failMessage: "Is it not possible when list of drug for add is empty"
            });        
        }else{
            this.setState({
                showModalPage:'THIRD',
            })
        }
    }

    handleClickOnClose = () => {
        this.setState({
            drugsToAdd: [] ,
            drugs:[],
            showModalPage:'FIRST',
            modalSize:'lg',    
            selectedDate:new Date(),
            pharmacyId:'',
            drugForAdd:'',
            selectedCount:'',
        });

        Axios
        .get(BASE_URL + "/api/drug/find-drugs-by-pharmacy-for-admin?pharmacyId="+ this.props.pharmacyId, {
			headers: { Authorization: getAuthHeader() },
		}).then((res) =>{
            this.setState({drugs : res.data});
            console.log(res.data);
        }).catch((err) => {console.log(err);}); 

        this.props.onCloseModal();
    }

    onAddClick = (id) =>{
        this.setState({showModalPage: 'SECOND',drugForAdd:id});
        this.setState({ 
            hiddenSuccessAlert: true,
            hiddenFailAlert: true, 
        }); 

    }

     handleBack = (event) =>{
        this.setState({showModalPage: 'FIRST',selectedCount:''});
        this.setState({ 
            hiddenSuccessAlert: true,
            hiddenFailAlert: true, 
        }); 

    }

    handleCloseAlertSuccess = () => {
		this.setState({ hiddenSuccessAlert: true });
    };
    
    handleCloseAlertFail = () => {
		this.setState({ hiddenFailAlert: true });
	};


    render() { 
        if (this.state.unauthorizedRedirect) return <Redirect push to="/unauthorized" />;

        return ( 
            <Modal
                show = {this.props.show}
                size = {this.state.modalSize}
                dialogClassName="modal-80w-100h"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header >
                    <Modal.Title style={{marginLeft:'37%'}} id="contained-modal-title-vcenter">
                        {this.props.header}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                <div className="container">  

                    <table hidden={this.state.showModalPage!=='FIRST'} border='1' style={{width:'100%'}}>
                                <tr>
                                    <th>Name</th>
                                    <th>Instance name</th>
                                    <th>Manufacturer</th>
                                    <th>Count</th>
                                </tr>
                                {this.state.drugsToAdd.map((drug) => (
                                
                                <tr>
                                    <td>{drug.drugName}</td>
                                    <td>{drug.drugInstanceName}</td>
                                    <td>{drug.drugManufacturer}</td>
                                    <td>{drug.amount}</td>
                                </tr>
                            ))}
                </table>    
                    <table hidden={this.state.showModalPage!=='FIRST'} className="table" style={{ width: "100%", marginTop: "3rem" }}>
                        <tbody>
                            {this.state.drugs.map((drug) => (
                                <tr id={drug.Id} key={drug.Id}>
                                    <td width="130em">
                                        <img className="img-fluid" src={CapsuleLogo} width="70em"/>
                                    </td>
                                    <td>
                                            <div><b>Drug:</b> {drug.EntityDTO.name}</div>
                                            <div><b>Name:</b> {drug.EntityDTO.drugInstanceName}</div>
                                            <div><b>Manufacturer:</b> {drug.EntityDTO.manufacturerName}</div>
                                    </td>
                                    <td >
                                        <div>
                                            <button style={{height:'30px'},{verticalAlign:'center'}} className="btn btn-primary btn-xl mt-2" onClick={() => this.onAddClick(drug)} type="button"><i className="icofont-subscribe mr-1"></i>Add</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div hidden={this.state.showModalPage!=='SECOND'}>
                                <form >
                                    <div  className="control-group" >
                                        <div className="form-row">
                                            <button  onClick = {() => this.handleBack()} className="btn btn-link btn-xl" type="button">
                                                <i className="icofont-rounded-left mr-1"></i>
                                                Back
                                            </button>                   
                                        </div>
                                        <table style={{width:'100%'},{marginLeft:'32%'}}>
                                            <tr>
                                                <td>
                                                    <label>Amount:</label>
                                                </td>
                                                <td>
                                                    <input placeholder="Amount" className="form-control" style={{width: "12.8em"}} type="number" min="1" onChange={this.handleSelectedCountChange} value={this.state.selectedCount} />
                                                </td>
                                            </tr>
                                        </table>
                                        <div  className="form-group text-center">
                                            <Button className="mt-3"  onClick = {() => this.handleAdd()} >Add drug to order list</Button>
                                        </div>
                                    </div>
                                </form>
                    </div>
                    <div hidden={this.state.showModalPage!=='THIRD'}>
                                <form >
                                    <div  className="control-group" >
                                        <div className="form-row">
                                            <button  onClick = {() => this.handleBack()} className="btn btn-link btn-xl" type="button">
                                                <i className="icofont-rounded-left mr-1"></i>
                                                Back
                                            </button>                   
                                        </div>
                                        <table style={{width:'100%'},{marginLeft:'32%'}}>
                                            <tr>
                                                <td>
                                                    <label>Date:</label>
                                                </td>
                                                <td>
                                                    <DatePicker  className="form-control" style={{width: "15em"}}  minDate={new Date()} onChange={date => this.handleSelectedDateChange(date)} selected={this.state.selectedDate}/>
                                                </td>
                                            </tr>
                                        </table>
                                        <div  className="form-group text-center">
                                            <Button className="mt-3"  onClick = {() => this.handleCreateOrder()} >Create order</Button>
                                        </div>
                                    </div>
                                </form>
                    </div>
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button  hidden={this.state.showModalPage==='THIRD'} onClick={() => this.handleClickOnCreateOrder()}>Create order</Button>
                    <Button onClick={() => this.handleClickOnClose()}>Close</Button>
                </Modal.Footer>
            </Modal>
         );
    }
}
 
export default CreateOrdersModal;