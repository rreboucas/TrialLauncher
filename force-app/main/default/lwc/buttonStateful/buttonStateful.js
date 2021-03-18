import ThirdSicDesc from '@salesforce/schema/DandBCompany.ThirdSicDesc';
import { LightningElement, api } from 'lwc';

export default class ButtonStateful extends LightningElement {
    @api featurename;
    @api templateid;
    isSelected = false;
    variant = 'neutral';

    handleClick(event) {
        
        this.isSelected = !this.isSelected;
        switch (this.isSelected) {
            case true:
              this.variant = 'brand'
              break;
            case false:
            this.variant = 'neutral'
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