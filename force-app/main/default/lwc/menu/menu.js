import { LightningElement, track, api, wire } from 'lwc';
import getGroups from '@salesforce/apex/FetchDataHelper.getGroups';
import getSubgroupsByGroup from '@salesforce/apex/FetchDataHelper.getSubgroupsByGroup';
import getDishesBySubgroup from '@salesforce/apex/FetchDataHelper.getDishesBySubgroup';

let cols = [ 
    { label: 'Dish', fieldName: 'Name' },
    { label: 'Price', fieldName: 'Price__c', type: 'currency' },
    { label: 'Description', fieldName: 'Description__c', type: 'string' },
    { label: 'Amount', fieldName: 'amount', type: 'number' },
    { label: 'Comments', fieldName: 'comments', type: 'date' }
];  

export default class Menu extends LightningElement {

    columns = cols;
    
    value='';

    value1 = '';


    @track 
    items = []; //this will hold key, value pair

    @track 
    items1 = []; //this will hold key, value pair
    
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
    dishes;

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
} 