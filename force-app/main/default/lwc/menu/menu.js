import { LightningElement, track, api, wire } from 'lwc';
import getGroups from '@salesforce/apex/FetchDataHelper.getGroups';
import getSubgroupsByGroup from '@salesforce/apex/FetchDataHelper.getSubgroupsByGroup';
import getDishesBySubgroup from '@salesforce/apex/FetchDataHelper.getDishesBySubgroup';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

let cols = [ 
    { label: 'Dish', fieldName: 'Name', hideDefaultActions: true },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', typeAttributes: { currencyCode: 'USD'}, hideDefaultActions: true },
    { label: 'Description', fieldName: 'Description__c', type: 'text' },
    {
        type:  'button',
        typeAttributes: 
        {
          iconName: 'utility:add',
          label: 'Add', 
          name: 'addDishItem', 
          title: 'Add to Order', 
          disabled: false
        }
      },
    { label: 'Amount', fieldName: 'Amount__c', type: 'number', editable: true, hideDefaultActions: true,  typeAttributes: { maximumFractionDigits: 0 },  cellAttributes: { alignment: 'center'}},
    { label: 'Comments', fieldName: 'comments', type: 'text', hideDefaultActions: true, wrapText: true, editable: true }
];  

export default class Menu extends LightningElement {

    columns = cols;
    draftValues = [];
    
    value='';

    value1 = '';

    @track
    selectedRowsToDisplay = [];

    allSelectedRaws = [];

    orderItems = [];

    @track rowNumberOffset = 0;

    @track 
    items = []; //this will hold key, value pair

    @track 
    items1 = []; //this will hold key, value pair

    @track dishesToDisplay = []; //Records to be displayed on the page

    @track dishes; //All opportunities available for data table    
    @track showTable = false; //Used to render table after we get the data from apex controller
    
    @track
    chosenGroup

    @track
    chosenSubgroup

    @wire(getSubgroupsByGroup, { groupId: '$chosenGroup' })
    wiredSubgroups({ error, data }) {
        if (data) {
            //create array with elements which has been retrieved controller
            //here value will be Id and label of combobox will be Name
            for(var i=0; i<data.length; i++)  {
                this.items1 = [...this.items1 ,{value: data[i].Id , label: data[i].Name} ];                                   
            }               
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }    

    @wire(getGroups)
    wiredGroups({ error, data }) {
        if (data) {
            //create array with elements which has been retrieved controller
            //here value will be Id and label of combobox will be Name
            for(var i=0; i<data.length; i++)  {
                this.items = [...this.items ,{value: data[i].Id , label: data[i].Name} ];                                   
            }                
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }

    @wire(getDishesBySubgroup, { subgroupId: '$chosenSubgroup' })
    wiredDishes({error,data}){
        if(data){
            let recs = [];
            for(let i=0; i<data.length; i++){
                let tempDish = {};
                tempDish.rowNumber = (i+1);
                tempDish.checked = false;
                tempDish = Object.assign(tempDish, data[i]);
                recs.push(tempDish);
            }
            this.dishes = recs;
            this.showTable = true;
        }else{
            this.error = error;
        }       
    }

    //gettter to return items which is mapped with options attribute
    get groups() {
        return this.items;
    }
    
    get subgroups() {
        return this.items1;
    }

    handleGroupChange(event) {
        this.chosenGroup = event.detail.value
    }

    handleSubgroupChange(event) {
        this.chosenSubgroup = event.detail.value
    }

    handleRowAction(event) {
        console.log(JSON.stringify(event.detail.action.name));
        //error
        if(event.detail.action.name == 'addDishItem') {
            let row = event.detail.row;
            console.log(JSON.stringify(event.detail.row));
            let orderItem = {
                "Name": event.detail.row.Name,
                "Price": event.detail.row.Price__c,
                "Description": event.detail.row.Description__c,
                "Id": event.detail.row.Id,
                "Amount": event.detail.row.Amount__c 
            }
            this.addOrderItem(orderItem);

            /*const event = new ShowToastEvent({
                title: 'Success',
                message: 'Item addedd to order!'
            });
            this.dispatchEvent(event);*/

            const selectEvent = new CustomEvent("dishselect", 
                {
                detail: this.orderItems
              });
          
              // Dispatches the event.
              this.dispatchEvent(selectEvent);
              console.log('Order items!');
              console.log(this.orderItems);
        }
        //console.log(JSON.stringify(event.detail.rowNumber));
    }


    isIdPresent(element) {
        console.log('This');
        console.log(this.Id);
        console.log('El');
        console.log(element.Id);
        return element.Id == this.Id;
    } 

    addOrderItem(row) {
        console.log('Add order item!');
        let index = this.orderItems.findIndex(this.isIdPresent, row);
        console.log('Index ' + index);
        if(index != -1) {
            this.orderItems[index].Amount++; 
        } else {
            this.orderItems.push(row);
        }
        console.log('End!');
    }

    handleSave(event) {
        console.log('Saved!');
    }

    handlePaginatorChange(event){
        console.log('Paginator change!');
        this.dishesToDisplay = event.detail;
        this.rowNumberOffset = this.dishesToDisplay[0].rowNumber - 1;
        console.log('Row offset ' + this.rowNumberOffset);
        console.log(JSON.stringify(this.dishesToDisplay));
    }

    
} 