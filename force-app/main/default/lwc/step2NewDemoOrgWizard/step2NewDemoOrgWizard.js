import { LightningElement, wire } from 'lwc';
import getProductsData from '@salesforce/apex/NewDemoOrgWizardApexController.getMainProducts';

export default class Step2NewDemoOrgWizard extends LightningElement {
    products;
    numberOfOptions;
    value;
    label;
    langValue;
    langLabel;
    languagevalue = { label: 'English', value: 'en_US' };

    connectedCallback(){

    }

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

    get languageoptions() {
        return [
            { label: 'Chinese', value: 'CN' },
            { label: 'Dutch', value: 'NL' },
            { label: 'English', value: 'US' },
            { label: 'Finnish', value: 'FI' },
            { label: 'French', value: 'FR' },
            { label: 'German', value: 'DE' },
            { label: 'Italian', value: 'IT' },
            { label: 'Japanese', value: 'JP' },
            { label: 'Korean', value: 'KR' },
            { label: 'Norwegian', value: 'NO' },
            { label: 'Portuguese', value: 'BR' },
            { label: 'Russian', value: 'RU' },
            { label: 'Spanish', value: 'ES' },
            { label: 'Spanish (Mexico)', value: 'MX' },
            { label: 'Swedish', value: 'SE' },
            { label: 'Thai', value: 'TH' }
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
        this.label = event.target.options.find(opt => opt.value === event.detail.value).label;

        console.log('step2NewDemoOrgWizard.js - handleChange handler - value: ' + this.value);
        console.log('step2NewDemoOrgWizard.js - handleChange handler - label: ' + this.label);

        // Send Message to Parent LWC to handle
        this.payload = {templateId: this.value, templateName: this.label};

        // Creates the event with the record ID data.
        const selectedEvent = new CustomEvent('basetemplateselected', { detail: this.payload });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    handleLanguageChange(event) {
        this.langValue = event.detail.value;
        this.langLabel = event.target.options.find(opt => opt.value === event.detail.value).label;

        console.log('step2NewDemoOrgWizard.js - handleLanguageChange handler - value: ' + this.value);
        console.log('step2NewDemoOrgWizard.js - handleLanguageChange handler - label: ' + this.label);

        // Send Message to Parent LWC to handle
        this.payload = {languageValue: this.langValue, languageName: this.langLabel};

        // Creates the event with the record ID data.
        const selectedEvent = new CustomEvent('baselanguageselected', { detail: this.payload });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

}