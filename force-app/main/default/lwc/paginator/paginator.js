import { LightningElement, api, track } from 'lwc';

const DELAY = 300;
const recordsPerPage = [5,10,25,50,100];
const pageNumber = 1;
const showIt = 'visibility:visible';
const hideIt = 'visibility:hidden'; //visibility keeps the component space, but display:none doesn't
export default class Paginator extends LightningElement {
    @api showSearchBox = false; //Show/hide search box; valid values are true/false
    @api searchFieldName;
    @api showPagination; //Show/hide pagination; valid values are true/false
    @api showDatePicker = false;
    @api showComboBox = false;
    @api pageSizeOptions = recordsPerPage; //Page size options; valid values are array of integers
    @api totalRecords; //Total no.of records; valid type is Integer
    @track records;
    @api options = [];
    @track pageSize; //No.of records to be displayed per page
    @track totalPages; //Total no.of pages
    @track pageNumber = pageNumber; //Page number
    @track searchKey; //Search Input
    @track controlPagination = showIt;
    @track controlPrevious = hideIt; //Controls the visibility of Previous page button
    @track controlNext = showIt; //Controls the visibility of Next page button
    @track recordsToDisplay = []; //Records to be displayed on the page

    @api 
    set recordsP(value) { //All records available in the data table; valid type is Array 
        this.setAttribute('recordsP', value);
        this.records = value;
        console.log('Setting paginator records');
        this.setRecordsToDisplay();
    }

    get recordsP() {
        return this.records;
    }

    //Called after the component finishes inserting to DOM
    connectedCallback() {
        if(this.pageSizeOptions && this.pageSizeOptions.length > 0) 
            this.pageSize = this.pageSizeOptions[0];
        else{
            this.pageSize = this.totalRecords;
            this.showPagination = false;
        }
        this.controlPagination = this.showPagination === false ? hideIt : showIt;
        console.log('Options');
        console.log(this.options);
        this.setRecordsToDisplay();
    }

    handleRecordsPerPage(event){
        this.pageSize = event.target.value;
        this.setRecordsToDisplay();
    }
    handlePageNumberChange(event){
        if(event.keyCode === 13){
            this.pageNumber = event.target.value;
            this.setRecordsToDisplay();
        }
    }
    previousPage(){
        this.pageNumber = this.pageNumber-1;
        this.setRecordsToDisplay();
    }
    nextPage(){
        this.pageNumber = this.pageNumber+1;
        this.setRecordsToDisplay();
    }
    @api setRecordsToDisplay(){
        
        this.recordsToDisplay = [];
        if(!this.pageSize)
            this.pageSize = this.totalRecords;

        this.totalPages = Math.ceil(this.totalRecords/this.pageSize);

        this.setPaginationControls();

        for(let i=(this.pageNumber-1)*this.pageSize; i < this.pageNumber*this.pageSize; i++){
            if(i === this.totalRecords) break;
            this.recordsToDisplay.push(this.records[i]);
        }
        console.log('Paginator setRecordsToDisplay');
        console.log(JSON.stringify(this.recordsToDisplay));
        this.dispatchEvent(new CustomEvent('paginatorchange', {detail: this.recordsToDisplay})); //Send records to display on table to the parent component
    }
    setPaginationControls(){
        //Control Pre/Next buttons visibility by Total pages
        if(this.totalPages === 1){
            this.controlPrevious = hideIt;
            this.controlNext = hideIt;
        }else if(this.totalPages > 1){
           this.controlPrevious = showIt;
           this.controlNext = showIt;
        }
        //Control Pre/Next buttons visibility by Page number
        if(this.pageNumber <= 1){
            this.pageNumber = 1;
            this.controlPrevious = hideIt;
        }else if(this.pageNumber >= this.totalPages){
            this.pageNumber = this.totalPages;
            this.controlNext = hideIt;
        }
        //Control Pre/Next buttons visibility by Pagination visibility
        if(this.controlPagination === hideIt){
            this.controlPrevious = hideIt;
            this.controlNext = hideIt;
        }
    }
    handleKeyChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        if(searchKey){
            this.delayTimeout = setTimeout(() => {
                this.controlPagination = hideIt;
                this.setPaginationControls();

                this.searchKey = searchKey;
                //Use other field name here in place of 'Name' field if you want to search by other field
                //this.recordsToDisplay = this.records.filter(rec => rec.includes(searchKey));
                //Search with any column value (Updated as per the feedback)
                this.recordsToDisplay = this.records.filter(rec => JSON.stringify(rec[this.searchFieldName]).includes(searchKey));
                if(Array.isArray(this.recordsToDisplay))
                    this.dispatchEvent(new CustomEvent('paginatorchange', {detail: this.recordsToDisplay})); //Send records to display on table to the parent component
            }, DELAY);
        }else{
            this.controlPagination = showIt;
            this.setRecordsToDisplay();
        }        
    }

    handleDateChange(event) {
        console.log('Datepicker value');
        console.log(event.target.value);
        console.log('records value');
        console.log(this.records);
        if(!event.target.value) {
            this.recordsToDisplay = this.records;
        } else {        
            this.recordsToDisplay = this.records.filter(rec => JSON.stringify(rec.Date__c).includes(''+event.target.value));
        }
        console.log('recordss to display after filtering');
        console.log(this.recordsToDisplay);
                if(Array.isArray(this.recordsToDisplay))
                    this.dispatchEvent(new CustomEvent('paginatorchange', {detail: this.recordsToDisplay})); //Send records to display on table to the parent component
    }

    handleComboBoxChange(event) {
        console.log('Combo value');
        console.log(event.target.value);
        if(!event.target.value) {
            this.recordsToDisplay = this.records;
        } else {        
            this.recordsToDisplay = this.records.filter(rec => JSON.stringify(rec.Status__c).includes(''+event.target.value));
        }
        console.log('recordss to display after filtering');
        console.log(this.recordsToDisplay);
                if(Array.isArray(this.recordsToDisplay))
                    this.dispatchEvent(new CustomEvent('paginatorchange', {detail: this.recordsToDisplay})); //Send records to display on table to the parent component

    }


}