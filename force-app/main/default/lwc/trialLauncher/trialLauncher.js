import { LightningElement, api, wire } from 'lwc';

export default class TrialLauncher extends LightningElement {
    
    @api title;
    isLoading = false;
    hasSubHeader = false;
    headerIconName;
    
}