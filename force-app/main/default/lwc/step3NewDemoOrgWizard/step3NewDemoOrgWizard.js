import { LightningElement, wire } from 'lwc';
import getFeatures from '@salesforce/apex/NewDemoOrgWizardApexController.getActiveFeatures';

export default class Step3NewDemoOrgWizard extends LightningElement {

    hasData;
    featuresList;
    numOfFeatures;
    numSelected = 0;
    
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

    storeSelectedFeature(event) {
        
        console.log('newDemoOrgWizard.js - storeFieldValues event handler');
        let fName = event.detail.templateName;
        console.log('step3NewDemoOrgWizard.js - storeSelectedFeature event handler - fName: ' + fName);

        let fTemplate = event.detail.templateId;
        console.log('step3NewDemoOrgWizard.js - storeSelectedFeature event handler - fTemplate: ' + fTemplate);

        let op = event.detail.operation;
        console.log('step3NewDemoOrgWizard.js - storeSelectedFeature event handler - op: ' + op);

        switch (op) {
            case 'add':
                this.featuresMap.set(fTemplate, fName);
                this.numSelected = this.featuresMap.size;
              break;
            case 'remove':
                this.featuresMap.delete(fTemplate);
                this.numSelected = this.featuresMap.size;
            break;
        }
    }

    
}