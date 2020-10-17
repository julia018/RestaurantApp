import { LightningElement, track, api, wire } from 'lwc';
import getGroups from '@salesforce/apex/FetchDataHelper.getGroups';
import getSubgroupsByGroup from '@salesforce/apex/FetchDataHelper.getSubgroupsByGroup';
import getDishesBySubgroup from '@salesforce/apex/FetchDataHelper.getDishesBySubgroup';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import refreshApex from '@salesforce/apex';

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
        },
        cellAttributes: { alignment: 'center'}
      }
];  

export default class Menu extends LightningElement {

    columns = cols;
    draftValues = [];
    
    
    value1 = '';

    @track
    selectedRowsToDisplay = [];

    allSelectedRaws = [];

    @track rowNumberOffset = 0;

     
    items = []; //this will hold key, value pair

    @track 
    items1 = []; //this will hold key, value pair

    @track dishesToDisplay = []; //Records to be displayed on the page

    @track dishes; //All opportunities available for data table    
    @track showTable = false; //Used to render table after we get the data from apex controller
    
    @track
    chosenGroup

    @api
    orderItems = [];

    orderItemsCopy = [];

    @track
    chosenSubgroup

    @track groups;
    @track subgroups;


    @wire(getSubgroupsByGroup, { groupId: '$chosenGroup' })
    wiredSubgroups(value) {
        console.log('refetch subgroups');
        let data = value.data;
        let error = value.error;
        //this.groups = value;
        if (data) {
            this.items1 = [];
            //create array with elements which has been retrieved controller
            //here value will be Id and label of combobox will be Name
            for(var i=0; i<data.length; i++)  {
                this.items1 = [...this.items1 ,{value: data[i].Id , label: data[i].Name} ];                                   
            }               
            this.error = undefined;
            this.subgroups = this.items1;
        } else if (error) {
            this.error = error;
        }
    }    

    @wire(getGroups)
    wiredGroups({ error, data }) {
        if (data) {          
            let items = [];  
            //create array with elements which has been retrieved controller
            //here value will be Id and label of combobox will be Name
            for(var i=0; i<data.length; i++)  {
                items = [...items ,{value: data[i].Id , label: data[i].Name} ];                                   
            }    
            this.items = items;   
            this.groups = items;         
            this.error = undefined;
            console.log('groups');
            console.log(this.items);
        } else if (error) {
            this.error = error;
        }
    }

    @wire(getDishesBySubgroup, { subgroupId: '$chosenSubgroup' })
    wiredDishes({error,data}){
        if(data){
            this.showTable = true;
            console.log('new subgroup');
            console.log(this.chosenSubgroup);
            console.log('refetching dishes ...');
            this.dishes = [];
            let recs = [];
            for(let i=0; i<data.length; i++){
                let tempDish = {};
                tempDish.rowNumber = (i+1);
                tempDish.checked = false;
                tempDish.comments = '';
                tempDish = Object.assign(tempDish, data[i]);
                recs.push(tempDish);
            }
            this.dishes = recs;
            console.log('new dishes');
            console.log(this.dishes);
            
            //this.template.querySelector(`[data-id="paginator"]`).setRecordsToDisplay();
            //setTimeout(this.refreshDishes, 5000);
        }else{
            this.error = error;
        }       
    }

    refreshDishes() {
        this.template.querySelector(`[data-id="paginator"]`).setRecordsToDisplay();
    }
    

    handleGroupChange(event) {
        if(event.target.value) {
            this.chosenGroup = event.detail.value;
        }            
        //return refreshApex(this.subgroups);
    }

    handleSubgroupChange(event) {
        console.log(this.subgroups);
        console.log('new subgroup value');
        console.log(event.target.value);
        

        if(event.target.value) {
            this.chosenSubgroup = event.detail.value;
        }
        
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
            console.log('object');
            console.log(orderItem);
            this.addOrderItem(orderItem);

            /*const event = new ShowToastEvent({
                title: 'Success',
                message: 'Item addedd to order!'
            });
            this.dispatchEvent(event);*/

            const selectEvent = new CustomEvent("dishselect", 
                {
                detail: this.orderItemsCopy
              });
          
              // Dispatches the event.
              this.dispatchEvent(selectEvent);
              console.log('Order items after event!');
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
        this.orderItemsCopy = JSON.parse(JSON.stringify(this.orderItems));
        
        let index = this.orderItemsCopy.findIndex(this.isIdPresent, row);
        console.log('Index ' + index);
        if(index != -1) {
            this.orderItemsCopy[index].Amount++; 
        } else {
            this.orderItemsCopy.push(row);
        }
        console.log('End!');
    }

    handleSave(event) {
        console.log('Saved!');
    }

    handlePaginatorChange(event){
        console.log('Paginator change!');
        this.dishesToDisplay = event.detail;
        if(this.dishesToDisplay.length > 0) {
            this.rowNumberOffset = this.dishesToDisplay[0].rowNumber - 1;
            console.log('Row offset ' + this.rowNumberOffset);
        }        
        console.log(JSON.stringify(this.dishesToDisplay));
    }

    
} 