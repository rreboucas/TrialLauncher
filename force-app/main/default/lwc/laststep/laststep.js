import { LightningElement, wire } from 'lwc';
import SLACK_LOGO from '@salesforce/resourceUrl/slacklogo';
import { NavigationMixin } from 'lightning/navigation';
import getSlackSettings from '@salesforce/apex/NewDemoOrgWizardApexController.getSlackSettings';

export default class Laststep extends NavigationMixin(LightningElement) {
    slackLogoUrl = SLACK_LOGO;
    slackchannel;
    slackteamid;
    hasData = false;

    @wire(getSlackSettings) 
    wiredSettings({ error, data }) {
        if (data) {
            this.hasData = true;
            console.log('laststep.js - data: ' + data);
            this.slackchannel = data[0].Slack_Channel_Name__c;
            console.log('laststep.js - slackchannel: ' + this.slackchannel);
            this.slackteamid = data[0].Slack_Team_ID__c;
            console.log('laststep.js - slackteamid: ' + this.slackteamid);
        }
        else if (error) {
            this.error = error;
        }
    }

    openSlack(event) {
        event.preventDefault();
        
        // Navigate to a URL
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://slack.com/app_redirect?team='+ this.slackteamid + '&channel=' + this.slackchannel
            }
        },
        false // Replaces the current page in your browser history with the URL
      );
    }
}