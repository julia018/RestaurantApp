import { api, LightningElement, track } from 'lwc';

export default class OrderInfo extends LightningElement {

    @track
    needShowModal = false;

    @api
    orderDishes;

    showOrderDetails() {
        console.log('show details!');
        console.log(this.orderDishes);
        this.needShowModal = true;
    }

    hideModal() {
        console.log('hide details!');
        this.needShowModal = false;
    }
   
}