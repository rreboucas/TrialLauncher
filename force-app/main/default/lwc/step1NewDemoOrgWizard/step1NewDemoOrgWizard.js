import { LightningElement, wire } from 'lwc';
import getFields from '@salesforce/apex/NewDemoOrgWizardApexController.getStep1Fields';

export default class Step1NewDemoOrgWizard extends LightningElement {
    hasData;
    fieldsList;
    numOfFields;

    connectedCallback(){
        console.log('step1NewDemoOrgWizard.js - connectedCallback handler');
    }

    storeFieldValue(event) {
        // Send Message to Parent LWC to handle
        this.payload = {fieldAPIName: event.target.name, fieldValue: event.target.value, numFields: this.numOfFields};

        // Creates the event with the record ID data.
        const selectedEvent = new CustomEvent('valuechanged', { detail: this.payload });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);


    }

    @wire(getFields) 
    wiredFields({ error, data }) {
        if (data) {
            this.hasData = true;
            this.fieldsList = data;
            this.numOfFields = data.length;
        }
        else if (error) {
            this.error = error;
        }
    }

}