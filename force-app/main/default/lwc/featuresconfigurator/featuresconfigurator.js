import { LightningElement, api } from 'lwc';

export default class Featuresconfigurator extends LightningElement {
    @api featurename;
    @api featureposition;
    @api instruction1;
    @api instruction2;
    @api videoid;
    @api publicdocurl;
    @api expertspageurl;
    showVideoPlayer = false;

    renderedCallback() {
        console.log('featuresconfigrator.js - videoid: ' + this.videoid);
        if (this.videoid)
            this.showVideoPlayer = true;
    }

}