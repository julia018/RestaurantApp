import { api, LightningElement } from 'lwc';

export default class Popup extends LightningElement {

    @api
    needShow;

    hideOrderDetails() {
        this.dispatchEvent(new CustomEvent('hide'));
    }
}