import { LightningElement, track, api, wire } from 'lwc';
import getGroups from '@salesforce/apex/FetchDataHelper.getGroups';
import getSubgroupsByGroup from '@salesforce/apex/FetchDataHelper.getSubgroupsByGroup';
import getDishesBySubgroup from '@salesforce/apex/FetchDataHelper.getDishesBySubgroup';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

let cols = [ 
    { label: 'Dish', fieldName: 'Name', hideDefaultActions: true },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', typeAttributes: { currencyCode: 'USD'}, hideDefaultActions: true },
    { label: 'Description', fieldName: 'Description__c', type: 'text' },
    { label: 'Amount', fieldName: 'Amount__c', type: 'number', editable: true, hideDefaultActions: true,  typeAttributes: { maximumFractionDigits: 0 },  cellAttributes: { alignment: 'center'}},
    { label: 'Comments', fieldName: 'comments', type: 'text', hideDefaultActions: true, wrapText: true, editable: true }
];  

export default class Menu extends LightningElement {

    columns = cols;
    draftValues = [];
    
    value='';

    value1 = '';

    @track wrapTextMaxLines = 8;

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
        console.log(JSON.stringify(event.detail.action));
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