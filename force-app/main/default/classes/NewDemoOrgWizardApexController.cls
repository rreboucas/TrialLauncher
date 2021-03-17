/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */


public with sharing class NewDemoOrgWizardApexController {

    @AuraEnabled
    public String label { get;set; }
    @AuraEnabled
    public String value { get;set; }

    @AuraEnabled(cacheable=true)
    public static List<Demo_Org_Wizard_Page_1__mdt> getStep1Fields() {

        List<Demo_Org_Wizard_Page_1__mdt> lstOfFields = [SELECT Label, Field_API_Name__c, Field_Type__c FROM Demo_Org_Wizard_Page_1__mdt WITH SECURITY_ENFORCED order by Field_Display_Order__c asc];
        System.debug('######## lstOfFields: ' + lstOfFields);
        return lstOfFields;
    }

    @AuraEnabled(cacheable=true)
    public static List<NewDemoOrgWizardApexController> getMainProducts() {

        List<NewDemoOrgWizardApexController> lstProducts = new List<NewDemoOrgWizardApexController>();
        List<Demo_Template__c> lstOfProductTemplates = [SELECT Main_Product__c,Name,Template_ID__c FROM Demo_Template__c WITH SECURITY_ENFORCED order by Name asc];
        System.debug('######## lstOfProductTemplates: ' + lstOfProductTemplates);
        for (Demo_Template__c t: lstOfProductTemplates)
        {
            NewDemoOrgWizardApexController p = new NewDemoOrgWizardApexController();
            p.label = t.Main_Product__c;
            p.value = t.Template_ID__c;
            lstProducts.add(p);
        }
        System.debug('######## lstProducts: ' + lstProducts);
        return lstProducts; 

    }

    @AuraEnabled(cacheable=true)
    public static List<Demo_Product__c> getActiveFeatures() {

        List<Demo_Product__c> lstOfFeatures = [SELECT Demo_Template__c,Name FROM Demo_Product__c where Status__c = 'Active' WITH SECURITY_ENFORCED  order by Name];
        System.debug('######## lstOfFeatures: ' + lstOfFeatures);
        return lstOfFeatures;
    }
    
}
