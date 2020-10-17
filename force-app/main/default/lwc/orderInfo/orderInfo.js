import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import  insertOrder from '@salesforce/apex/FetchDataHelper.insertOrder';
import insertOrderItem from '@salesforce/apex/FetchDataHelper.insertOrderItem';

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
        if(this.orderDishes.length == 0) {
            this.showToast('warning', 'Choose at least one dish, please!');
            return;
        }
        if(this.showAddressField && !this.isAddressSpecified()) {
            this.showSpecifyAddressToast();
        }
        console.log(this.id);

        console.log('Making order!');

        insertOrder({totalPrice:this.totalPrice, owner:this.id, address:this.address}).then(result=>{
            console.log('res'); 
            let orderId = ''+result;
            console.log(result); 
            if(orderId == '0') {
                this.showToast('error', 'Error making order, try later!');
            }   
            this.orderDishes.forEach(orderDish => {
                console.log('Dish');
                console.log(orderDish);
                this.insertSingleOrderItem(orderDish.Amount, orderDish.comments, orderDish.Id, orderId);
                this.showToast('success', 'Your order is accepted!');
                
            });
            const changeEvent = new CustomEvent("itemschange", 
                {
                    detail:  this.orderDishes
                });
          
                // Dispatches the event.
                this.dispatchEvent(changeEvent);
        }).catch(error=>{
            this.showToast('error', 'Error making order, try later!');
            console.log(error);
            return;
        });               
        
    }

    insertSingleOrderItem(amount, comments, dishId, orderId) {
        console.log('inserting order item');        
        insertOrderItem({amount: amount, comments: comments, dishItemId: dishId, orderId: orderId}).then(res=>{
            console.log(res);
            return res;
        }).catch(error=>{
            this.showToast('error', 'Error making order, try later!');
            console.log(error);
            return;
        }); 
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

    showToast(variant, message) {
        const event = new ShowToastEvent({
            title: '...',
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
   
}