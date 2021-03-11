import { LightningElement, wire } from 'lwc';
import getFields from '@salesforce/apex/NewDemoOrgWizardApexController.getStep1Fields';

export default class Step1NewDemoOrgWizard extends LightningElement {
    hasData;
    fieldsList;

    @wire(getFields) 
    wiredFields({ error, data }) {
        if (data) {
            this.hasData = true;
            this.fieldsList = data;
        }
        else if (error) {
            this.error = error;
        }
    }

}