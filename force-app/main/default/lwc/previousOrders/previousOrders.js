import { LightningElement, track, wire, api } from 'lwc';
import getOrdersByOwnerId from '@salesforce/apex/FetchDataHelper.getOrdersById';
import getPicklistValuesList from '@salesforce/apex/FetchDataHelper.getPickListValuesIntoList';
import {refreshApex} from '@salesforce/apex';
import userId from '@salesforce/user/Id';

let cols = [ 
    { label: 'Date', fieldName: 'Date__c', type: "date", hideDefaultActions: true, typeAttributes: {year:'numeric', month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'}},
    { label: 'Total Price', fieldName: 'Cost__c', type: 'currency', typeAttributes: { currencyCode: 'USD'}, hideDefaultActions: true },
    { label: 'Delivery Address', fieldName: 'Delivery_Address__c', type: 'text' },
    { label: 'Status', fieldName: 'Status__c', type: 'text'},
    { label: 'Dishes', fieldName: 'Dishes', type: 'text'}
]

export default class PreviousOrders extends LightningElement {

    id = userId;

    @track
    showTable = false;

    @track
    orders = [];

    @track ordersToDisplay = [];

    columns = cols;

    @track comboOptions = [];

    @track rowNumberOffset = 0;

    @track  myOrders = [];

    @track totalOrdersPrice = 0;

    @wire(getOrdersByOwnerId, { userId: '$id' })
    wiredOrders(value){
        this.myOrders = value;
        let data = value.data;
        let error = value.error;
        if(data){
            console.log('Previous orders');
            let data = value.data;
            let sum = 0;
            let error = value.error;
            console.log(data);
            this.myOrders = value;
            let recs = [];
            for(let i=0; i<data.length; i++){
                sum += data[i].Cost__c;
                let orderDishes = '';
                if(data[i].Order_Items__r) {
                    console.log('dishessssss!');
                    // !!!
                    data[i].Order_Items__r.forEach(element => {
                        console.log(element);
                        console.log(element.Dish_Item__r.Name);
                        orderDishes += element.Dish_Item__r.Name + ' : '+ element.Amount__c + ';\n';
                    });
                }                
                let tempOrder = {};
                tempOrder.rowNumber = (i+1);
                tempOrder.Dishes = orderDishes;
                console.log(tempOrder.Dishes);
                tempOrder = Object.assign(tempOrder, data[i]);
                recs.push(tempOrder);
            }
            this.orders = recs;
            this.totalOrdersPrice = sum;
            console.log('this.orders');
            console.log(this.orders);

        }else{
            this.error = error;
            this.totalOrdersPrice = 0;
        }       
    }

    @wire(getPicklistValuesList) 
    comboboxOptions(value) {
        console.log('combo');
        console.log(value);
        if(value.data) {
            let options = [];
            value.data.forEach(el => {
                let option = {
                    "label": el+'',
                    "value": el+''
                };
                options.push(option);
            })
            console.log('combo');
            this.comboOptions = options;
            console.log(this.comboOptions);
        } else {
            console.log(value.error);
        }
    }

    showPreviousOrders() {
        this.showTable = true;
        //return refreshApex(this.myOrders);
        console.log('before');
        console.log(this.orders);

        refreshApex(this.myOrders);
        console.log('after');
        console.log(this.orders);
        this.template.querySelector("c-paginator").setRecordsToDisplay();
    }

    hidePreviousOrders() {
        this.showTable = false;
        
        
    }

    handlePaginatorChange(event){
        console.log('Paginator change!');
        this.ordersToDisplay = event.detail;
        if(this.ordersToDisplay.length > 0) {
            this.rowNumberOffset = this.ordersToDisplay[0].rowNumber - 1;
            console.log('Row offset ' + this.rowNumberOffset);
        }
        
        console.log(JSON.stringify(this.ordersToDisplay));
    }

    @api handleValueChange() {
        console.log('Childs method!');
        refreshApex(this.myOrders);
        setTimeout(this.refreshData, 5000);
        
        //return refreshApex(this.myOrders);
    }

    refreshData() {
        
        console.log('after');
        console.log(this.orders);
        this.template.querySelector("c-paginator").setRecordsToDisplay();
        
    }


}