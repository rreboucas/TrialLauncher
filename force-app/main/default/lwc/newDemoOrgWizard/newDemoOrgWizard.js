import ApiName from '@salesforce/schema/CaseStatus.ApiName';
import { LightningElement, api, wire } from 'lwc';
import Id from '@salesforce/user/Id';

export default class NewDemoOrgWizard extends LightningElement {
    hasPreviousStep = false;
    showNextStep = true;
    selectedStep = 'Step1';
    isStep1 = true;
    isStep2 = false;
    isStep3 = false;
    isStep4 = false;
    isStep5 = false;
    valuesMap = new Map();
    disableNext = true;
    featuresSet = new Set();
    featuresList;
    baseTemplateName;
    baseTemplateId;
    nextButtonLabel = 'Next';
    userId = Id;
    
    connectedCallback() {
        //this.valuesMap = new Map();
    }

    storeSelectedFeature(event) {
        

        let fTemplate = event.detail.templateId;
        console.log('newDemoOrgWizard.js - storeSelectedFeature event handler - fTemplate: ' + fTemplate);

        let op = event.detail.operation;
        console.log('newDemoOrgWizard.js - storeSelectedFeature event handler - op: ' + op);

        switch (op) {
            case 'add':
                this.featuresSet.add(fTemplate);
                this.featuresList = [...this.featuresSet];
              break;
            case 'remove':
                this.featuresSet.delete(fTemplate);
                this.featuresList = [...this.featuresSet];
            break;
        }
    }

    storeTemplateInfo(event) {

        this.baseTemplateId = event.detail.templateId;
        console.log('newDemoOrgWizard.js - storeFieldValues event handler - baseTemplateId: ' + this.baseTemplateId);        
        
        this.baseTemplateName = event.detail.templateName;
        console.log('newDemoOrgWizard.js - storeFieldValues event handler - baseTemplateName: ' + this.baseTemplateName);
        
    }

    storeFieldValues(event) {
        
        console.log('newDemoOrgWizard.js - storeFieldValues event handler');
        let aPIName = event.detail.fieldAPIName;
        console.log('newDemoOrgWizard.js - storeFieldValues event handler - aPIName: ' + aPIName);

        let fValue = event.detail.fieldValue;
        console.log('newDemoOrgWizard.js - storeFieldValues event handler - fValue: ' + fValue);


        if (aPIName && fValue){
            this.valuesMap.set(aPIName, fValue);
            console.log('newDemoOrgWizard.js - storeFieldValues event handler - valuesMap: ' + this.valuesMap);
            console.log('newDemoOrgWizard.js - storeFieldValues event handler - valuesMap.size: ' + this.valuesMap.size);
            console.log('newDemoOrgWizard.js - storeFieldValues event handler - event.detail.numFields: ' + event.detail.numFields);
            if (this.valuesMap.size === event.detail.numFields)
                this.disableNext = false;
        }   
            
    }


    handleNext(event) {
        var getselectedStep = this.selectedStep;
        if(getselectedStep === 'Step1'){
            this.selectedStep = 'Step2';
            this.hasPreviousStep = true;
            this.isStep1 = false;
            this.isStep2 = true;
        }
        else if(getselectedStep === 'Step2'){
            this.selectedStep = 'Step3';
            this.isStep2 = false;
            this.isStep3 = true;
        }
        else if(getselectedStep === 'Step3'){
            this.selectedStep = 'Step4';
            this.isStep3 = false;
            this.isStep4 = true;
            this.nextButtonLabel = 'Request Org';
        }
        else if(getselectedStep === 'Step4'){
            this.selectedStep = 'Step4';
            this.isStep4 = false;
            this.isStep5 = true;
            this.showNextStep = false;
            this.hasPreviousStep = false;
        }
    }

    handlePrevious(event) {
        var getselectedStep = this.selectedStep;
        if(getselectedStep === 'Step2'){
            this.selectedStep = 'Step1';
            this.hasPreviousStep = false;
            this.isStep2 = false;
            this.isStep1 = true;
        }
        else if(getselectedStep === 'Step3'){
            this.selectedStep = 'Step2';
            this.isStep3 = false;
            this.isStep2 = true;
        }
        else if(getselectedStep === 'Step4'){
            this.selectedStep = 'Step3';
            this.isStep4 = false;
            this.isStep3 = true;
        }
    }

    selectStep1() {
        this.selectedStep = 'Step1';
    }
 
    selectStep2() {
        this.selectedStep = 'Step2';
    }
 
    selectStep3() {
        this.selectedStep = 'Step3';
    }
 
    selectStep4() {
        this.selectedStep = 'Step4';
    }
}