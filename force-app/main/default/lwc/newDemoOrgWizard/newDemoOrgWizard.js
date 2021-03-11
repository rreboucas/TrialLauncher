import { LightningElement, api, wire } from 'lwc';

export default class NewDemoOrgWizard extends LightningElement {
    hasPreviousStep = false;
    selectedStep = 'Step1';
    currentStep;

    connectedCallback() {
        

    }

    handleNext(event) {
        var getselectedStep = this.selectedStep;
        if(getselectedStep === 'Step1'){
            this.selectedStep = 'Step2';
            this.hasPreviousStep = true;
        }
        else if(getselectedStep === 'Step2'){
            this.selectedStep = 'Step3';
        }
        else if(getselectedStep === 'Step3'){
            this.selectedStep = 'Step4';
        }
    }

    handlePrevious(event) {
        var getselectedStep = this.selectedStep;
        if(getselectedStep === 'Step2'){
            this.selectedStep = 'Step1';
            this.hasPreviousStep = false;
        }
        else if(getselectedStep === 'Step3'){
            this.selectedStep = 'Step2';
        }
        else if(getselectedStep === 'Step4'){
            this.selectedStep = 'Step3';
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