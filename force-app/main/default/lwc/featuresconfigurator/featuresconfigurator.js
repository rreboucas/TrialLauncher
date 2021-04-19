import { LightningElement, api } from 'lwc';


export default class Featuresconfigurator extends LightningElement {
    @api featurename;
    @api featureposition;
    @api instruction1;
    @api instruction2;
    @api videoid;
    @api publicdocurl;
    @api expertspageurl;
    @api orgurl;
    iframeURL;
    
    hasVideoId = false;
    showVideoPlayer = false;

    connectedCallback() { 
               
    }

    

    renderedCallback() {
        
        console.log('#### featuresconfigrator.js - orgURL: ' + this.orgurl);
        if (this.videoid)
        {
            this.showVideoPlayer = true;
            this.iframeURL = this.orgurl.substring(this.orgurl.indexOf("=") + 1, this.orgurl.indexOf("]")) + '/apex/videoPlayer?vidyardId=' + this.videoid;
        }
            

        
    }

}