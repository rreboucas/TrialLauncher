import ThirdSicDesc from '@salesforce/schema/DandBCompany.ThirdSicDesc';
import { LightningElement, api } from 'lwc';

export default class ButtonStateful extends LightningElement {
    @api featurename;
    @api templateid;
    isSelected = false;
    variant = 'neutral';
    selectedName;
    selectedTemplate;

    handleClick(event) {
        
        this.isSelected = !this.isSelected;

        switch (this.isSelected) {
            case true:
                this.variant = 'brand';
                this.selectedName = event.target.labelWhenOff;
                console.log('buttonStateful.js - selectedName: ' + this.selectedName);
                this.selectedTemplate = event.target.dataset.item;
                console.log('buttonStateful.js - selectedTemplate: ' + this.selectedTemplate);
                this.payload = {templateId: this.selectedName , templateName: this.selectedTemplate, operation: 'add'};
                const selectedEvent = new CustomEvent('featureselected', { detail: this.payload });
                this.dispatchEvent(selectedEvent);
              break;
            case false:
                this.variant = 'neutral'
                this.selectedName = event.target.labelWhenOff;
                console.log('buttonStateful.js - selectedName: ' + this.selectedName);
                this.selectedTemplate = event.target.dataset.item;
                console.log('buttonStateful.js - selectedTemplate: ' + this.selectedTemplate);
                this.payload = {templateId: this.selectedName , templateName: this.selectedTemplate, operation: 'remove'};
                const unselectedEvent = new CustomEvent('featureselected', { detail: this.payload });
                this.dispatchEvent(unselectedEvent);
            break;
        }


        console.log('buttonStateful.js - isSelected: ' + this.isSelected);

            
        
        /*    if (this.isSelected = false)
        {
            console.log('buttonStateful.js - GOT INSIDE ISSELECT = FALSE IF');
            this.variant = 'neutral';
        }*/
    }

    isSelected(event) {
        
    }

}