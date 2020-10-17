import { api, LightningElement, track } from 'lwc';

let cols = [ 
    { label: 'Item', fieldName: 'Name', hideDefaultActions: true },
    { label: 'Price', fieldName: 'Price', type: 'currency', typeAttributes: { currencyCode: 'USD'}, hideDefaultActions: true },
    { label: 'Description', fieldName: 'Description', type: 'text' },
    { label: 'Amount', fieldName: 'Amount', type: 'number', hideDefaultActions: true, cellAttributes: { alignment: 'center'}},
    { label: 'Comments', fieldName: 'Comments', type: 'text', hideDefaultActions: true, wrapText: true, editable: true },
    {
        type:  'button',
        typeAttributes: 
        {
          iconName: 'utility:add',
          label: '+1', 
          name: 'incDishItem', 
          title: 'add one to order', 
          disabled: false
        },
        cellAttributes: { alignment: 'center'}
      },
      {
        type:  'button',
        typeAttributes: 
        {
          iconName: 'utility:delete',
          label: '-1', 
          name: 'decDishItem', 
          title: 'delete one frow Order', 
          disabled: false
        },
        cellAttributes: { alignment: 'center'}
      },
    {
        type:  'button',
        typeAttributes: 
        {
          iconName: 'utility:delete',
          label: 'Delete', 
          name: 'deleteDishItem', 
          title: 'Delete frow Order', 
          disabled: false
        },
        cellAttributes: { alignment: 'center'}
      }
]; 

export default class Popup extends LightningElement {

    @api
    needShow;

    @api
    orderDishes = [];

    orderDishesCopy;

    columns = cols;

    @api
    totalPrice = 0;

    @track
    draftValues = [];

    
    /*get totalPrice() {
        console.log('Getting total Price');
        //this.orderDishes = JSON.parse(JSON.stringify(this.orderDishes));
        console.log('Current dishes');
        console.log(this.orderDishes);
        console.log('Current draft values');
        console.log(this.draftValues);

        let sum = 0;
        for(let i=0;i<this.orderDishes.length; i++) {
            let item = this.orderDishes[i];
            //let amount = this.getCurrentAmount(item);
            sum+= item.Amount * item.Price;
        }
        this.total = sum;

        console.log('Total');
        console.log(this.total);
        return `${this.total}`;
    }*/    


    hideOrderDetails() {
        console.log(this.orderDishes);
        this.dispatchEvent(new CustomEvent('hide'));
    }

    handleRowAction(event) {
        console.log('Action!');
        console.log(event);
        if(event.detail.action.name == 'deleteDishItem') {
            let row = event.detail.row;
            console.log(JSON.stringify(event.detail.row));
            this.deleteDishItem(row.Id);
        } else if(event.detail.action.name == 'incDishItem') {
            this.changeDishAmount(true, event.detail.row.Id);
        } else if(event.detail.action.name == 'decDishItem') {
            this.changeDishAmount(false, event.detail.row.Id);
        }
    }

    changeDishAmount(flag, Id) {
        this.orderDishesCopy = JSON.parse(JSON.stringify(this.orderDishes));
        let index = this.orderDishes.findIndex(this.isIdEqual, Id);
        let amount = this.orderDishesCopy[index].Amount;
        if(flag) {
            this.orderDishesCopy[index].Amount++;
        } else {
            if(amount == 1) {
                this.orderDishesCopy.splice(index, 1);
            } else {
                this.orderDishesCopy[index].Amount--;
            }
        }
        this.notifyOrderDishesChange();
    }

    deleteDishItem(Id) { 
        //this.orderDishes = JSON.parse(JSON.stringify(this.orderDishes));
        this.orderDishesCopy = JSON.parse(JSON.stringify(this.orderDishes));
        console.log(' items before deletion!');
              console.log(this.orderDishes);
        let index = this.orderDishesCopy.findIndex(this.isIdEqual, Id);
        console.log(index);
        console.log(typeof(this.orderDishes[index].Amount));
        //this.orderDishes[index].Amount = 0;
        this.orderDishesCopy.splice(index, 1);
        //console.log(this.orderDishes);
        this.notifyOrderDishesChange();
    }

    isIdEqual(element) {
        console.log('This');
        console.log(this);
        console.log('El');
        console.log(element.Id);
        return element.Id == this;
    } 

    notifyOrderDishesChange() {
        console.log('notifyOrderDishesChange!');
        const changeEvent = new CustomEvent("itemschange", 
                {
                detail:  this.orderDishesCopy
              });
          
              // Dispatches the event.
              this.dispatchEvent(changeEvent);
              console.log(' items after change!');
              console.log(this.orderDishes);
    }

    handleSave(event) {
        console.log('Saving!');
        console.log(event.detail.draftValues);
        this.updateComments(event.detail.draftValues);
        this.draftValues = [];
    }

    updateComments(draftValues) {
        this.orderDishesCopy = JSON.parse(JSON.stringify(this.orderDishes)); 
        for(let i = 0; i < draftValues.length; i++) {
            let id = draftValues[i].Id;
            let newComments = draftValues[i].Comments;
            let index = this.orderDishesCopy.findIndex(this.isIdEqual, id);
            this.orderDishesCopy[index].Comments = newComments;            
        }
        this.notifyOrderDishesChange();
    }
        
}