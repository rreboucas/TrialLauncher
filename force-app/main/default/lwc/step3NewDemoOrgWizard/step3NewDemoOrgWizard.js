import { LightningElement, wire } from 'lwc';
import getFeatures from '@salesforce/apex/NewDemoOrgWizardApexController.getActiveFeatures';

export default class Step3NewDemoOrgWizard extends LightningElement {

    hasData;
    featuresList;
    numOfFeatures;
    numSelected = 0;
    
    featuresSet = new Set();

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

    storeSelectedFeature(event) {
        
        let fTemplate = event.detail.templateId;
        console.log('step3NewDemoOrgWizard.js - storeSelectedFeature event handler - fTemplate: ' + fTemplate);

        let op = event.detail.operation;
        console.log('step3NewDemoOrgWizard.js - storeSelectedFeature event handler - op: ' + op);

        switch (op) {
            case 'add':
                this.featuresSet.add(fTemplate);
                this.numSelected = this.featuresSet.size;
              break;
            case 'remove':
                this.featuresSet.delete(fTemplate);
                this.numSelected = this.featuresSet.size;
            break;
        }
    }

    
}