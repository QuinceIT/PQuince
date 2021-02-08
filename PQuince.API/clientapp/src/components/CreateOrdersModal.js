import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import CapsuleLogo from '../static/capsuleLogo.png';
import Axios from 'axios';
import {BASE_URL} from '../constants.js';
import DatePicker from "react-datepicker";
import getAuthHeader from "../GetHeader";

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
        Axios
        .get(BASE_URL + "/api/drug/find-drugs-by-pharmacy-for-admin?pharmacyId="+ this.props.pharmacyId, {
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
            alert('mora biti vece od 0')
        }
        else{
            let drugDTO = {
                drugId: this.state.drugForAdd.Id,
                drugName: this.state.drugForAdd.EntityDTO.name,
                drugInstanceName: this.state.drugForAdd.EntityDTO.drugInstanceName,
                drugManufacturer: this.state.drugForAdd.EntityDTO.manufacturerName,
                drugCount:this.state.selectedCount
            }
    
            this.removePeople(this.state.drugForAdd);
            
            this.addItem(drugDTO);
    
            this.setState({
                showModalPage:'FIRST',
                selectedCount:'',
                drugForAdd:''
            })
            
        }
        /*let addDrugToPharmacyDTO = {
            drugId: this.state.drugIdToAdd, 
            dateTo: this.state.selectedDate, 
            amount:this.state.amount,
            price: this.state.price, 
        };

        if(this.isValidData(addDrugToPharmacyDTO)){
            Axios
            .post(BASE_URL + "/api/drug/add-drug-to-pharmacy", addDrugToPharmacyDTO, {
            headers: { Authorization: getAuthHeader() },}).then((res) =>{
                this.props.updateDrugs();
                this.setState({showAddStorageAndPrice: false, modalSize:'lg'});
                alert("Uspesno dodat dermatolog u apoteku")
                this.handleClickOnClose();
            }).catch((err) => {
                alert('Nije moguce dodati dermatologa');
            });
        }else{
            // aktivirati error
            alert("ERROR");
        }*/
    
    }

    handleCreateOrder = () =>{
        let drugDTO = {
            drugs: this.state.drugsToAdd,
        }

        Axios
        .post(BASE_URL + "/api/drug/testy", drugDTO, {
        headers: { Authorization: getAuthHeader() },}).then((res) =>{
        }).catch((err) => {
            alert('Nije moguce dodati dermatologa');
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
            alert("Nije moguce kreirati kada nema")
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

    }

     handleBack = (event) =>{
        this.setState({showModalPage: 'FIRST'});
    }

    render() { 
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
                                    <td>{drug.drugCount}</td>
                                </tr>
                            ))}
                </table>    
                    <table hidden={this.state.showModalPage!=='FIRST'} className="table" style={{ width: "100%", marginTop: "3rem" }}>
                        <tbody>
                            {this.state.drugs.map((drug) => (
                                <tr id={drug.Id} key={drug.Id}>
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
                    <Button onClick={() => this.handleClickOnCreateOrder()}>Create order</Button>
                    <Button onClick={() => this.handleClickOnClose()}>Close</Button>
                </Modal.Footer>
            </Modal>
         );
    }
}
 
export default CreateOrdersModal;