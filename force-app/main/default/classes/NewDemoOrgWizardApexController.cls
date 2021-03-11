/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */


public with sharing class NewDemoOrgWizardApexController {
    @AuraEnabled(cacheable=true)
    public static List<Demo_Org_Wizard_Page_1__mdt> getStep1Fields() {

        List<Demo_Org_Wizard_Page_1__mdt> lstOfFields = [SELECT Label, Field_API_Name__c, Field_Type__c FROM Demo_Org_Wizard_Page_1__mdt WITH SECURITY_ENFORCED order by Field_Display_Order__c asc];
        System.debug('######## lstOfFields: ' + lstOfFields);
        return lstOfFields;
    }
}
