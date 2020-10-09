import { LightningElement, track } from 'lwc';

export default class OrderInfo extends LightningElement {

    @track
    needShowModal = false;

    showOrderDetails() {
        console.log('show details!');
        this.needShowModal = true;
    }

    hideModal() {
        console.log('hide details!');
        this.needShowModal = false;
    }
   
}