import { LightningElement, api, wire } from 'lwc';
import getOrgURL from '@salesforce/apex/NewDemoOrgWizardApexController.getOrgURL';
import { NavigationMixin } from 'lightning/navigation';

export default class VideoPlayer extends NavigationMixin(LightningElement) {
    @api vidyardid;
    iframeURL;
    orgURL;
    hasVideoId = false;

    /*
    @wire(getOrgURL)
    wiredOrg({error, data}) {
        if (data) {
            this.orgURL = data;
            console.log('videoPlayer.js: ' + this.orgURL);
            this.iframeURL = this.orgURL.substring(this.orgURL.indexOf("=") + 1, this.orgURL.indexOf("]")) + '/apex/videoPlayer?vidyardId=' + this.vidyardid;
        }
        else if (error) {
            this.error = error;
        }
    }
    */

    connectedCallback() {

        
        
        getOrgURL()
        .then((result) => {
            this.orgURL = result;
            console.log('videoPlayer.js - result: ' + this.orgURL);
            this.iframeURL = this.orgURL.substring(this.orgURL.indexOf("=") + 1, this.orgURL.indexOf("]")) + '/apex/videoPlayer?vidyardId=' + this.vidyardid;
        })
        .catch((error) => {
            this.error = error;
        });
        
        
        
        console.log('#### VideoPlayer.js - orgURL: ' + this.orgURL);
        const url = this.orgURL;
        
    }

    renderedCallback(){
        console.log('#### VideoPlayer.js -  vidyardid: ' + this.vidyardid);

    }



    
}