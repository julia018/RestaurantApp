import { api, LightningElement, track } from 'lwc';

let cols = [ 
    { label: 'Item', fieldName: 'Name', hideDefaultActions: true },
    { label: 'Price', fieldName: 'Price', type: 'currency', typeAttributes: { currencyCode: 'USD'}, hideDefaultActions: true },
    { label: 'Description', fieldName: 'Description', type: 'text' },
    { label: 'Amount', fieldName: 'Amount', type: 'number', editable: true, hideDefaultActions: true,  typeAttributes: { maximumFractionDigits: 0 },  cellAttributes: { alignment: 'center'}},
    { label: 'Comments', fieldName: 'Comments', type: 'text', hideDefaultActions: true, wrapText: true, editable: true },
    {
        type:  'button',
        typeAttributes: 
        {
          iconName: 'utility:delete',
          label: 'Delete', 
          name: 'deleteDishItem', 
          title: 'Delete frow Order', 
          disabled: false
        }
      }
]; 

export default class Popup extends LightningElement {

    @api
    needShow;

    @api
    orderDishes = [];

    columns = cols;

    @track
    total = 0;

    get totalPrice() {
        this.orderDishes = JSON.parse(JSON.stringify(this.orderDishes));
        const reducer = (accumulator, currentValue) => accumulator + currentValue.Amount * currentValue.Price;
        let sum = 0;
        for(let i=0;i<this.orderDishes.length; i++) {
            let item = this.orderDishes[i];
            sum+= item.Amount * item.Price;
        }
        this.total = sum;
        console.log('Total');
        console.log(this.total);
        return `${this.total}`;
    }


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
        }
    }

    deleteDishItem(Id) { 
        this.orderDishes = JSON.parse(JSON.stringify(this.orderDishes));
        console.log(' items before deletion!');
              console.log(this.orderDishes);
        let index = this.orderDishes.findIndex(this.isIdEqual, Id);
        console.log(index);
        console.log(this.orderDishes[index].Amount);
        console.log(typeof(this.orderDishes[index].Amount));

        // ?!?!

        //this.orderDishes[index].Amount = 0;
        this.orderDishes.splice(index, 1);
        //console.log(this.orderDishes);
        const deleteEvent = new CustomEvent("dishdelete", 
                {
                detail: this.orderDishes[index]
              });
          
              // Dispatches the event.
              this.dispatchEvent(deleteEvent);
              console.log(' items after deletion!');
              console.log(this.orderDishes);
    }

    isIdEqual(element) {
        console.log('This');
        console.log(this);
        console.log('El');
        console.log(element.Id);
        return element.Id == this;
    } 
        
}