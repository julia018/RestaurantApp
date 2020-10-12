import { LightningElement, track } from 'lwc';

export default class Main extends LightningElement {

    @track selectedDishes = [];

    handleOrderListChange(event) {
        console.log('Event');
        console.log(event);
        console.log('Main : Dish added!');
        this.selectedDishes = JSON.parse(JSON.stringify(event.detail));
        console.log('dishes in main ');
        console.log(this.selectedDishes);
    }
}