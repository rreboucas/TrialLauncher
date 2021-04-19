import { LightningElement, api } from 'lwc';
import COFFEE_MUG_IMG from '@salesforce/resourceUrl/mug';

export default class Step5NewDemoOrgWizard extends LightningElement {
    waitImageUrl = COFFEE_MUG_IMG;
    @api orgstatus;

    connectedCallback(){
        this.orgstatus = 'InProgress';
    }
}