import { LightningElement, api } from 'lwc';
import EINSTEIN_LOGO from '@salesforce/resourceUrl/einsteinlogo';

export default class Step4NewDemoOrgWizard extends LightningElement {
    @api template;
    @api features;
    einsteinLogoUrl = EINSTEIN_LOGO;
    hasData = false;

    connectedCallback(){
        if (this.features)
            this.hasData = true;
    }
}