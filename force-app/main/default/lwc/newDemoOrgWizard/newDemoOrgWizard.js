import { LightningElement, api, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import createDemoOrg from '@salesforce/apex/NewDemoOrgWizardApexController.createDemoOrg';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import getSignupStatus from '@salesforce/apex/callSignupAPI.getRealTimeOrgStatus';

const FIELDS = [
    'User.FirstName',
    'User.LastName',
    'User.Country',
    'User.Email',
];

export default class NewDemoOrgWizard extends NavigationMixin(LightningElement) {
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
    baseLanguageName;
    baseLanguageValue;
    nextButtonLabel = 'Next';
    userId = Id;
    user;
    signupRequestId;
    localDemoOrgRecordId;
    error;
    channelName = '/event/SignupStatus__e';
    isDemoOrgCreated = false;
    createdOrgStatus;

    subscription = {};

    @wire(getRecord, { recordId: '$userId', fields: FIELDS })
    wiredUserInfo({ error, data }) {
        if (data) {
            this.user = data;
            console.log('newDemoOrgWizard.js - user email: ' + this.user.fields.Email.value);
            console.log('newDemoOrgWizard.js - user Country: ' + this.user.fields.Country.value);
            console.log('newDemoOrgWizard.js - user First Name: ' + this.user.fields.FirstName.value);
            console.log('newDemoOrgWizard.js - user Last Name: ' + this.user.fields.LastName.value);
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.userEmail = undefined;
        }
    }

    connectedCallback() {
        // Register error listener for Platform Events       
        this.registerErrorListener();

        // Callback invoked whenever a new event message is received
        const messageCallback = function(response) {
            console.log('New message received: ', JSON.stringify(response));
            // Response contains the payload of the new message received
            // Hide step 5 and unhide step 6:
            this.isDemoOrgCreated = true;
            this.isStep5 = false;
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
        });
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

    storeLanguageInfo(event) {

        this.baseLanguageValue = event.detail.languageValue;
        console.log('newDemoOrgWizard.js - storeLanguageInfo event handler - baseLanguageValue: ' + this.baseLanguageValue);        
        
        this.baseLanguageName = event.detail.languageName;
        console.log('newDemoOrgWizard.js - storeLanguageInfo event handler - baseLanguageName: ' + this.baseLanguageName);
        
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
            console.log('newDemoOrgWizard.js - storeFieldValues event handler - thivaluesMap.size: ' + event.detail.numFields);
            console.log('newDemoOrgWizard.js - storeFieldValues event handler - event.detail.numFields: ' + event.detail.numFields);
            if (this.valuesMap.size === (event.detail.numFields - 1))
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

            // Request demo org via signup API callout:
            createDemoOrg({ firstName: this.user.fields.FirstName.value, 
                            lastName: this.user.fields.LastName.value, 
                            eMail: this.user.fields.Email.value, 
                            country: this.user.fields.Country.value, 
                            templateId: this.baseTemplateId, 
                            partnerName: this.valuesMap.get('Partner_Name__c'), 
                            trialDays: this.valuesMap.get('Trial_Days__c'), 
                            demoDateTime: this.valuesMap.get('Demo_Date_Time__c'),
                            features: this.featuresList,
                            orgLanguage: this.baseLanguageValue })
            .then(result => {
                this.signupRequestId = result.signupRequestId;
                console.log('newDemoOrgWizard.js - createOrg - signupRequestId: ' + this.signupRequestId);
                this.localDemoOrgRecordId = result.localDemoOrgRecId;
                console.log('newDemoOrgWizard.js - createOrg - localDemoOrgRecordId: ' + this.localDemoOrgRecordId);

                // Show Toast event with created local record:
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: this.localDemoOrgRecordId,
                        actionName: 'view',
                    },
                }).then(url => {
                    const event = new ShowToastEvent({
                        "title": "Success!",
                        "variant": "success",
                        "message": "Request Record {0} created!  {1}!",
                        "messageData": [
                            'Salesforce',
                            {
                                url,
                                label: 'here'
                            }
                        ]
                    });
                    this.dispatchEvent(event);

                    // Sets client poller to fetch Signup Request Status:

                    setInterval(() => this.fetchOrgStatus(), 60000);
                });

                



            })
            .catch(error => {
                this.error = error;
            });

        }
    }

    fetchOrgStatus(){
        getSignupStatus({ signupRecordId: this.signupRequestId, localDemoOrgRec: this.localDemoOrgRecordId })
            .then((result) => {
                this.createdOrgStatus = result.status;
                console.log('fetchOrgStatus : ' + this.createdOrgStatus);
                this.error = undefined;

                if (this.createdOrgStatus === 'Success') {
                    // Hide step 5 and unhide step 6:
                    this.isDemoOrgCreated = true;
                    this.isStep5 = false;
                }
            })
            .catch((error) => {
                this.error = error;
                this.contacts = undefined;
            });

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



    registerErrorListener() {
        // Invoke onError empApi method
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }
}