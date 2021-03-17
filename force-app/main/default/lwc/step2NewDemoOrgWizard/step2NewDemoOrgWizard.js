import { LightningElement, wire } from 'lwc';
import getProductsData from '@salesforce/apex/NewDemoOrgWizardApexController.getMainProducts';

export default class Step2NewDemoOrgWizard extends LightningElement {
    products;
    numberOfOptions;
    value;
    label;

    @wire(getProductsData)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
            this.error = 'No Data found';
            this.numberOfOptions = data.length;
        }
        else if (error) {
            this.error = error;
            this.products = undefined;
        }
    }

    get options() {
        return this.products;
    }

    handleChange(event) {
        this.value = event.detail.value;
        this.label = event.detail.label;

        console.log('step2NewDemoOrgWizard.js - handleChange handler - value: ' + this.value);
        console.log('step2NewDemoOrgWizard.js - handleChange handler - label: ' + this.label);

        // Send Message to Parent LWC to handle
        this.payload = {templateId: this.value, templateName: this.value};

        // Creates the event with the record ID data.
        const selectedEvent = new CustomEvent('basetemplateselected', { detail: this.payload });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

}