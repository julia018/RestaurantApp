import { LightningElement, track } from 'lwc';

export default class Main extends LightningElement {

    // single source of truth
    @track selectedDishes = [];
    @track totalPrice = 0;

    handleOrderListChange(event) {
        console.log('Event');
        console.log(event);
        console.log('Main : Dish added!');
        this.selectedDishes = JSON.parse(JSON.stringify(event.detail));
        this.totalPrice = this.countNewTotalPrice();
        console.log('dishes in main ');
        console.log(this.selectedDishes);
    }

    handleChange(event) {
        console.log(event);
        console.log('main notification');
        let dishes = JSON.parse(JSON.stringify(event.detail));
        this.selectedDishes = dishes;
        this.totalPrice = this.countNewTotalPrice();
        console.log('dishes in main after handle change ');
        console.log(this.selectedDishes);
    }

    countNewTotalPrice() {
        let sum = 0;
        for(let i = 0; i < this.selectedDishes.length; i++) {
            sum += this.selectedDishes[i].Amount * this.selectedDishes[i].Price;
        }
        return sum;
    }
}