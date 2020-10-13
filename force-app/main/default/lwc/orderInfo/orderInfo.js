import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import  insertOrder from '@salesforce/apex/FetchDataHelper.insertOrder';

import userId from '@salesforce/user/Id';

export default class OrderInfo extends LightningElement {

    id = userId;

    @track
    needShowModal = false;

    @api
    orderDishes;

    @api
    totalPrice = 0;

    @track
    showAddressField = false;

    @track
    address = '';

    showOrderDetails() {
        console.log('show details!');
        console.log(this.orderDishes);
        this.needShowModal = true;
    }

    hideModal() {
        console.log('hide details!');
        this.needShowModal = false;
    }

    handleOrderItemsChange(event) {
        console.log('notification!');
        console.log('order info handle event obj');
        console.log(event);
        let detail = JSON.parse(JSON.stringify(event.detail));
        //this.totalPrice = detail.total;
        console.log('New total in orderInfo');
        console.log(this.totalPrice);
        const changeEvent = new CustomEvent("itemschange", 
                {
                detail:  detail
              });
          
              // Dispatches the event.
              this.dispatchEvent(changeEvent);
              console.log(' items after change!');
              console.log(this.orderDishes);
    }

    handleHomeDeliveryChange(event) {
        if(event.target.checked) {
            this.showAddressField = true;
            console.log('Checked!');
        } else {
            this.showAddressField = false;
            this.address = '';
            console.log('UnChecked!');
        }
    }

    addressChange(event) {
        console.log('Current address');        
        this.address = event.detail.value;
        console.log(this.address);
    }

    makeOrder() {
        if(this.showAddressField && !this.isAddressSpecified()) {
            this.showSpecifyAddressToast();
        }
        console.log(this.id);

        console.log('Making order!');

        let orderId = insertOrder({totalPrice:this.totalPrice, owner:this.id, address:this.address}).then(result=>{
            console.log(JSON.stringify(result));
        }).catch(error=>{
            console.log(error);
        });

        /*let orderId = insertOrder(this.totalPrice, this.id, this.address);   
        console.log('Order id');  */
        console.log(orderId);  

    }

    isAddressSpecified() {
        return !(this.address == '');
    }

    showSpecifyAddressToast() {
        const event = new ShowToastEvent({
            title: '...',
            message: 'Specify delivery address, please.',
        });
        this.dispatchEvent(event);
    }
   
}