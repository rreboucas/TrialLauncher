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

    @AuraEnabled
    public String signupRequestId { get;set; }
    @AuraEnabled
    public String localDemoOrgRecId { get;set; }

    @AuraEnabled
    public String orgId { get;set; }
    @AuraEnabled
    public String orgStatus { get;set; }
    @AuraEnabled
    public String orgInstance { get;set; }
    @AuraEnabled
    public String username { get;set; }
    @AuraEnabled
    public String errorCode { get;set; }


    @AuraEnabled(cacheable=false)
    public static NewDemoOrgWizardApexController createDemoOrg(String firstName, String lastName, String eMail, String country, String templateId, String partnerName, String trialDays, String demoDateTime, List<String> features, String orgLanguage) {

        System.debug('###### firstName: ' + firstName);
        System.debug('###### lastName: ' + lastName);
        System.debug('###### eMail: ' + eMail);
        System.debug('###### country: ' + country);
        System.debug('###### templateId: ' + templateId);
        System.debug('###### partnerName: ' + partnerName);
        System.debug('###### trialDays: ' + trialDays);
        System.debug('###### demoDateTime: ' + demoDateTime);
        System.debug('###### features: ' + features);

        NewDemoOrgWizardApexController result = new NewDemoOrgWizardApexController();
        String strCreateResult;
        String strSignupRequestId;

        // generate unique identifier:
        Blob b = Crypto.GenerateAESKey(128);
        String h = EncodingUtil.ConvertTohex(b);
        String guid = h.SubString(0,2)+ h.SubString(8,10) + h.SubString(11,13);

        // Create unique username:
        String un1 = eMail.substringBefore('@');
        String emailDomain = partnerName.deleteWhitespace().toLowerCase() + guid + '.demo';
        String uniqueUserName = un1 + '@' + emailDomain;
        System.debug('###### uniqueUserName: ' + uniqueUserName);
        
        // Create unique Subdomain:
        String uniqueSubDomain = partnerName.deleteWhitespace().toLowerCase() + guid + 'demo';
        System.debug('###### uniqueSubDomain: ' + uniqueSubDomain);

        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:Signup_API_Org/services/data/v42.0/sobjects/SignupRequest/');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        Map<String, String> valueMap = new Map<String, String>();
        valueMap.put('FirstName', firstName);
        valueMap.put('LastName', lastName);
        valueMap.put('SignupEmail', eMail);
        valueMap.put('Username', uniqueUserName);
        valueMap.put('Country', country);
        valueMap.put('TemplateId', templateId);
        valueMap.put('Subdomain', uniqueSubDomain);
        valueMap.put('Company', partnerName);
        valueMap.put('TrialDays', trialDays);
        valueMap.put('Country', orgLanguage);
        String jsonBody = JSON.Serialize(valueMap);
        System.debug('###### jsonBody: ' + jsonBody);
        request.setBody(jsonBody);

        HttpResponse response = http.send(request);
        // Parse the JSON response
        if (response.getStatusCode() != 201) {
            System.debug('The status code returned was not expected: ' +
                response.getStatusCode() + ' ' + response.getStatus());
        } else {
            System.debug('response.getBody(): ' + response.getBody());
            strCreateResult = response.getBody();
        }

        if (String.isNotEmpty(strCreateResult))
        {
            
            
            // Parse json response to get Signup Request id:
            ID signupReqId;
            
            JSONParser parser = JSON.createParser(strCreateResult);
            while (parser.nextToken() != null) 
            {
                if (parser.getText() == 'id')
                {
                    parser.nextToken();
                    signupReqId = parser.getIdValue();
                    strSignupRequestId = signupReqId;
                    result.signupRequestId = strSignupRequestId;
                    System.debug('######### signupReqId: ' + signupReqId);
                }
            }

            
            
            // create Demo Org record

            
            Demo_Org__c rec = new Demo_Org__c();
            Datetime dt = (Datetime)JSON.deserialize(demoDateTime, DateTime.class);
            rec.Signup_Request_Id__c = signupReqId;
            rec.Demo_Date_Time__c = dt;
            rec.Name = partnerName + ' - ' + dt.date().format();
            Demo_Template__c t = [Select id from Demo_Template__c where Template_ID__c =: templateId limit 1];
            rec.Demo_Template__c = t.id;
            rec.Partner_Name__c = partnerName;
            rec.Trial_Days__c = Integer.valueOf(trialDays);

            insert rec;

            result.localDemoOrgRecId = rec.id;
            
            // Fetch Demo Product records to reconcile with features for insert / populate lookup field:



             // create Demo Feature child records   
             if (!features.isEmpty())
             {
                List<Demo_Feature__c> lstFeatures = new List<Demo_Feature__c>();
                 for (String f: features)
                 {
                    System.debug('######### f: ' + f);
                    Demo_Feature__c ft = new Demo_Feature__c();
                    ft.Name = f;
                    System.debug('######### rec.id: ' + rec.id);
                    ft.Demo_Org__c = rec.id;
                    lstFeatures.add(ft);
                 }
                 System.debug('######### lstFeatures: ' + lstFeatures);
                 insert lstFeatures;
             }
             
             
             // Schedule apex job to fetch SignupRequest Status on Signup APi Enabled org:

             // Now schedule new batch jobs to run in 10 mins:
        
             String hour = String.valueOf(Datetime.now().hour());
             String min = String.valueOf(Datetime.now().minute() + 10); 
             String ss = String.valueOf(Datetime.now().second());
             
             //parse to cron expression
             String nextFireTime = ss + ' ' + min + ' ' + hour + ' * * ?';
        
            schedFetchOrgStatus s = new schedFetchOrgStatus();
            s.signupReqId =  strSignupRequestId;
            s.localDemoOrgRecId = rec.id;
            System.schedule('schedFetchSignupStatus-' + rec.id + String.valueOf(Datetime.now()), nextFireTime, s);

        }

        return result;

    }

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
    public static AggregateResult[] getActiveFeatures() {

        AggregateResult[] lstOfFeatures = [SELECT Name FROM Demo_Product__c where Status__c = 'Active' WITH SECURITY_ENFORCED GROUP BY Name order by Name];
        System.debug('######## lstOfFeatures: ' + lstOfFeatures);
        return lstOfFeatures;
    }

    private static String getUUID()
    {
        Blob b = Crypto.GenerateAESKey(128);
        String h = EncodingUtil.ConvertTohex(b);
        String guid = h.SubString(0,8)+ '-' + h.SubString(8,12) + '-' + h.SubString(12,16) + '-' + h.SubString(16,20) + '-' + h.substring(20);
        system.debug(guid);
        return guid;
    }
    
}
