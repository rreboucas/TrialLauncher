import { LightningElement, api, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import createDemoOrg from '@salesforce/apex/NewDemoOrgWizardApexController.createDemoOrg';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import getSignupStatus from '@salesforce/apex/callSignupAPI.getRealTimeOrgStatus';
import getFeatures from '@salesforce/apex/NewDemoOrgWizardApexController.getFeaturesSelected';
import getOrgURL from '@salesforce/apex/NewDemoOrgWizardApexController.getOrgURL';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = [
    'User.FirstName',
    'User.LastName',
    'User.Country',
    'User.Email',
];

export default class IsvTrialLauncher extends NavigationMixin(LightningElement) {
    @api step;
    @api localrecordid;
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
    isLastStep = false;
    isDemoOrgCreated = false;
    createdOrgStatus;
    userName;

    featureslistdata;
    featurename;
    featureposition;
    instruction1;
    instruction2;
    videoid;
    publicdocurl;
    expertspageurl;
    featuresfetchresult;
    featurescolsize;
    featurescolcurrentitem;
    hasotherfeaturestoshow;
    orgURL;
    timer;

    subscription = {};
 

    connectedCallback() {

        this.fetchOrgURL();

        // check if there is a record id to enable New vs. Edit mode:

        if(this.localrecordid)
        {
            // Edit Mode
        }
        else {
            // New rec mode
        }
       
        switch(this.step) {
            case '1':
                this.isStep1 = true;
              break;
            case '2':
                this.isStep1 = false;
                this.isStep2 = true;
              break;
            case '3':
                this.isStep1 = false;
                this.isStep3 = true;
              break;
            case '3':
                this.isStep1 = false;
                this.isStep3 = true;
              break;
            case '4':
                this.isStep1 = false;
                this.isStep4 = true;
              break;
            case '5':
                this.isStep1 = false;
                this.isStep5 = true;
              break;
            case '6':
                this.isStep1 = false;
                this.initDemoCreated();
              break;
            case '7':
                
                let tempList = [ 'a000U000003MzLeQAK','a000U000003MzLfQAK'];
                this.featureslistdata = tempList;
                this.selectedStep = 'FeaturesStep';
                this.fetchDemoFeatures();
                this.isStep1 = false;
                this.showNextStep = true;
                this.disableNext = false;
                this.isFeaturesStep = true;

              break;
          }
        
         /*
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
        */
    }

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

    storeUserInfo(event) {

        this.user = event.detail.user;
        console.log('newDemoOrgWizard.js - storeUserInfo event handler - user: ' + this.user);        
        
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
                this.userName = result.username;
                console.log('newDemoOrgWizard.js - createOrg - username: ' + this.userName);
                this.featureslistdata = result.featureidslist;
                console.log('newDemoOrgWizard.js - createOrg - featureslistdata: ' + this.featureslistdata);

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

                    //setInterval(() => this.fetchOrgStatus(), 60000);
                    this.timer = setInterval(() => this.fetchOrgStatus(), 60000);

                });
            })
            .catch(error => {
                this.error = error;
            });

        }
        else if(getselectedStep === 'DemoCreated'){
            console.log('newDemoOrgWizard.js - this.isDemoOrgCreated-nxt-before: ' + this.isDemoOrgCreated);
            this.isDemoOrgCreated = false;
            this.selectedStep = 'FeaturesStep';
            this.isFeaturesStep = true;
            this.showNextStep = true;
            if (!this.featuresfetchresult)
                this.fetchDemoFeatures();
            else
                this.setFeatureItemData();
                console.log('newDemoOrgWizard.js - this.isDemoOrgCreated-nxt-after: ' + this.isDemoOrgCreated);
        }
        else if(getselectedStep === 'FeaturesStep'){

            console.log('NewDemoOrgWizard - featurescolsize : ' + this.featurescolsize);
            console.log('NewDemoOrgWizard - featurescolcurrentitem : ' + this.featurescolcurrentitem);
            console.log('NewDemoOrgWizard - hasotherfeaturestoshow : ' + this.hasotherfeaturestoshow);

            this.featurescolcurrentitem = this.featurescolcurrentitem + 1;
            if (this.featurescolcurrentitem === this.featurescolsize)
                    this.hasotherfeaturestoshow = false;
                else if (this.featurescolcurrentitem < this.featurescolsize)
                    this.hasotherfeaturestoshow = true;

            if (this.hasotherfeaturestoshow)
            {
                
                this.setFeatureItemData();
                console.log('NewDemoOrgWizard - featurescolcurrentitem : ' + this.featurescolcurrentitem);
            }
            else
            {
                // show final step with slack button
                console.log('NewDemoOrgWizard - entered ShowSlack step ');
                this.isFeaturesStep = false;
                this.isLastStep = true;
                this.selectedStep = 'LastStep';
                this.showNextStep = false;
            }
            this.hasPreviousStep = true;
        }
        
    }

    fetchOrgURL(){
        getOrgURL()
        .then((result) => {
            this.orgURL = result;
            console.log('NewDemoOrgWizard.js - result: ' + this.orgURL);
            
        })
        .catch((error) => {
            this.error = error;
        });
           
        console.log('#### NewDemoOrgWizard.js - orgURL: ' + this.orgURL);
    }

    fetchDemoFeatures(){

        // Fetch Demo Feature Data:
        getFeatures({ listofFeatureIds: this.featureslistdata })
        .then((result) => {
            this.featuresfetchresult = result;
            console.log('featuresfetchresult : ' + this.featuresfetchresult);
            this.featurescolsize = this.featuresfetchresult.length;
            this.error = undefined;

            if (this.featuresfetchresult)
            {
                // Set the featureslist lwc reactive properties to the first feature in the fetch results list
                this.featurescolcurrentitem = 0;
                this.hasotherfeaturestoshow = true;
                this.setFeatureItemData();
            }
                                
        })
        .catch((error) => {
            this.error = error;
        });

    }

    fetchOrgStatus(){
        getSignupStatus({ signupRecordId: this.signupRequestId, localDemoOrgRec: this.localDemoOrgRecordId })
            .then((result) => {
                this.createdOrgStatus = result.status;
                console.log('fetchOrgStatus : ' + this.createdOrgStatus);
                this.error = undefined;

                if (this.createdOrgStatus === 'Success' && this.isDemoOrgCreated === false) {
                    // Hide step 5 and unhide step 6:
                    this.initDemoCreated();
                    clearInterval(this.timer);
                }
            })
            .catch((error) => {
                this.error = error;
                this.contacts = undefined;
            });

    }

    setFeatureItemData(){
        this.featurename = this.featuresfetchresult[this.featurescolcurrentitem].featurename;
        console.log('NewDemoOrgWizard - featurename : ' + this.featurename);
        this.featureposition = this.featuresfetchresult[this.featurescolcurrentitem].featureposition;
        console.log('NewDemoOrgWizard - featureposition : ' + this.featureposition);
        this.instruction1 = this.featuresfetchresult[this.featurescolcurrentitem].instruction1;
        console.log('NewDemoOrgWizard - instruction1 : ' + this.instruction1);
        this.instruction2 = this.featuresfetchresult[this.featurescolcurrentitem].instruction2;
        console.log('NewDemoOrgWizard - instruction2 : ' + this.instruction2);
        this.videoid = this.featuresfetchresult[this.featurescolcurrentitem].videoid;
        console.log('NewDemoOrgWizard - videoid : ' + this.videoid);
        this.publicdocurl = this.featuresfetchresult[this.featurescolcurrentitem].publicdocurl;
        console.log('NewDemoOrgWizard - publicdocurl : ' + this.publicdocurl);
        this.expertspageurl = this.featuresfetchresult[this.featurescolcurrentitem].expertspageurl;
        console.log('NewDemoOrgWizard - expertspageurl : ' + this.expertspageurl);
    }


    initDemoCreated() {
        this.isDemoOrgCreated = true;
        this.isStep5 = false;
        this.selectedStep = 'DemoCreated';
        this.showNextStep = true;
        this.hasPreviousStep = true;
        this.nextButtonLabel = 'Next';
        this.disableNext = false;

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
        else if(getselectedStep === 'FeaturesStep'){
            console.log('NewDemoOrgWizard - featurescolcurrentitem-bf : ' + this.featurescolcurrentitem);
            if (this.featurescolcurrentitem > 0)
            {
                this.featurescolcurrentitem = this.featurescolcurrentitem - 1;
                console.log('NewDemoOrgWizard - featurescolcurrentitem : ' + this.featurescolcurrentitem);
                this.setFeatureItemData();
                console.log('newDemoOrgWizard.js - this.isDemoOrgCreated-prev->0: ' + this.isDemoOrgCreated);
            }
            else
            {
                // Set back step to Demo Created lwc
                this.isDemoOrgCreated = true;
                this.isFeaturesStep = false;
                this.selectedStep = 'DemoCreated';
                this.hasPreviousStep = false;
                console.log('NewDemoOrgWizard - featurescolcurrentitem - else : ' + this.featurescolcurrentitem);
                console.log('newDemoOrgWizard.js - this.isDemoOrgCreated-prev-after: ' + this.isDemoOrgCreated);
            }
        }
        else if(getselectedStep === 'LastStep'){
            this.selectedStep = 'FeaturesStep';
            this.isFeaturesStep = true;
            this.isLastStep = false;
            this.showNextStep = true;
            this.featurescolcurrentitem = this.featurescolcurrentitem - 1;
            console.log('NewDemoOrgWizard - featurescolcurrentitem - last step : ' + this.featurescolcurrentitem);
            this.setFeatureItemData();
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