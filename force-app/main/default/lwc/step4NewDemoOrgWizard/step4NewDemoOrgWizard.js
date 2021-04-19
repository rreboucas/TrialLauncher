import { LightningElement, api, wire } from 'lwc';
import EINSTEIN_LOGO from '@salesforce/resourceUrl/einsteinlogo';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = [
    'User.FirstName',
    'User.LastName',
    'User.Country',
    'User.Email',
];

export default class Step4NewDemoOrgWizard extends LightningElement {
    @api template;
    @api features;
    einsteinLogoUrl = EINSTEIN_LOGO;
    hasData = false;
    user;

    connectedCallback(){
        if (this.features)
            this.hasData = true;
    }


    @wire(getRecord, { recordId: '$userId', fields: FIELDS })
    wiredUserInfo({ error, data }) {
        if (data) {
            this.user = data;
            console.log('newDemoOrgWizard.js - user email: ' + this.user.fields.Email.value);
            console.log('newDemoOrgWizard.js - user Country: ' + this.user.fields.Country.value);
            console.log('newDemoOrgWizard.js - user First Name: ' + this.user.fields.FirstName.value);
            console.log('newDemoOrgWizard.js - user Last Name: ' + this.user.fields.LastName.value);
            this.error = undefined;

            // Send Message to Parent LWC to handle
            this.payload = {user: this.user};

            // Creates the event with the record ID data.
            const selectedEvent = new CustomEvent('userinfofetched', { detail: this.payload });

            // Dispatches the event.
            this.dispatchEvent(selectedEvent);
        } else if (error) {
            this.error = error;
            this.userEmail = undefined;
        }
    }
    
}