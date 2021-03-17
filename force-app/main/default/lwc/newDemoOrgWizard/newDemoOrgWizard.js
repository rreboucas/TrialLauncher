import ApiName from '@salesforce/schema/CaseStatus.ApiName';
import { LightningElement, api, wire } from 'lwc';

export default class NewDemoOrgWizard extends LightningElement {
    hasPreviousStep = false;
    selectedStep = 'Step1';
    isStep1 = true;
    isStep2 = false;
    isStep3 = false;
    isStep4 = false;
    valuesMap = new Map();
    disableNext = true;

    connectedCallback() {
        //this.valuesMap = new Map();
    }

    storeTemplateInfo(event) {
        let tempId = event.detail.templateId;
        console.log('newDemoOrgWizard.js - storeFieldValues event handler - tempId: ' + tempId);
        if (tempId)
            this.baseTemplateId = tempId;

        let tempName = event.detail.templateName;
        console.log('newDemoOrgWizard.js - storeFieldValues event handler - tempName: ' + tempName);
        if (tempName)
            this.baseTemplateId = tempName;
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