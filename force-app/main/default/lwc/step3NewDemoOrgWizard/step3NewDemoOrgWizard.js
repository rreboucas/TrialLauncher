import { LightningElement, wire } from 'lwc';
import getFeatures from '@salesforce/apex/NewDemoOrgWizardApexController.getActiveFeatures';

export default class Step3NewDemoOrgWizard extends LightningElement {

    hasData;
    featuresList;
    numOfFeatures;
    
    featuresMap = new Map();

    @wire(getFeatures) 
    wiredFields({ error, data }) {
        if (data) {
            this.hasData = true;
            this.numOfFeatures = data.length;
            this.featuresList = data;
            
            /*for (let i = 0; i < numOfFeatures; i++) {
                this.featuresMap.set(data.Name, [data.Demo_Template__c]);
            }*/
        }
        else if (error) {
            this.error = error;
        }
    }

    

    
}