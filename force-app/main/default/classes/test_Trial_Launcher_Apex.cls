@isTest
private class test_Trial_Launcher_Apex {
    @testSetup static void setup() {
        // Create common test records

        Demo_Template__c dt = TestFactory.insertDemoTemplate();
        Demo_Product__c dp1 = TestFactory.insertDemoProduct(dt.Id, 'Next Best Action');
        Demo_Product__c dp2 = TestFactory.insertDemoProduct(dt.Id, 'Salesforce Maps');
        Demo_Org__c dr = TestFactory.insertlocalDemoOrgRec(dt.Id);
        Demo_Feature__c df1 = TestFactory.insertlocalDemoFeatureRec(dr.Id, dp1.Id, dp1.Name);
        Demo_Feature__c df2 = TestFactory.insertlocalDemoFeatureRec(dr.Id, dp2.Id, dp2.Name);
    }

    @isTest static void test_NewDemoOrgWizardApexController_CreateDemoOrg() {
        // Set mock callout class 
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new WebServiceMockImpl());
        Demo_Template__c dt = [SELECT Id, Template_ID__c FROM Demo_Template__c LIMIT 1];
        List<String> lstFeatures = new List<String>();
        lstFeatures.add('Next Best Action');
        lstFeatures.add('Salesforce Maps');
        NewDemoOrgWizardApexController lstRecs1 = NewDemoOrgWizardApexController.createDemoOrg('firstName', 'lastName', 'r@r.com', 'US', dt.Template_ID__c, 'partnerName', '2', '2021-05-07T07:30:00.000Z', lstFeatures, 'EN');
        Test.stopTest();
    }

    @isTest static void test_NewDemoOrgWizardApexController_GetSlackFields() {
        
        Test.startTest();
        List<Slack_Settings__mdt> lstRecs1 = NewDemoOrgWizardApexController.getSlackSettings();
        Test.stopTest();
    }

    @isTest static void test_NewDemoOrgWizardApexController_GetStep1Fields() {
        
        Test.startTest();
        List<Demo_Org_Wizard_Page_1__mdt> lstRecs1 = NewDemoOrgWizardApexController.getStep1Fields();
        Test.stopTest();
    }

    @isTest static void test_NewDemoOrgWizardApexController_GetFeaturesSelected() {
        
        Test.startTest();
        List<Demo_Feature__c> lstProds = [SELECT Id FROM Demo_Feature__c LIMIT 2];
        List<String> lStrings = new List<String>();
        for (Demo_Feature__c p: lstProds)
        {
            lStrings.add(p.id);
        }
        List<NewDemoOrgWizardApexController> lstRecs1 = NewDemoOrgWizardApexController.getFeaturesSelected(lStrings);
        Test.stopTest();
    }

    @isTest static void test_NewDemoOrgWizardApexController_GetMainProducts() {
        
        Test.startTest();
        List<NewDemoOrgWizardApexController> lstRecs1 = NewDemoOrgWizardApexController.getMainProducts();
        Test.stopTest();
    }

    @isTest static void test_NewDemoOrgWizardApexController_GetActiveFeatures() {
        
        Test.startTest();
        AggregateResult[] lstRecs1 = NewDemoOrgWizardApexController.getActiveFeatures();
        Test.stopTest();
    }

    @isTest static void test_NewDemoOrgWizardApexController_GetOrgURL() {
        
        Test.startTest();
        String lstRecs1 = NewDemoOrgWizardApexController.getOrgURL();
        Test.stopTest();
    }


    @isTest static void test_callSignupAPI_GetRealTimeOrgStatus() {
        // Set mock callout class 
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new WebServiceGetStatusMockImpl());
        Demo_Org__c drec = [SELECT Id,Signup_Request_Id__c FROM Demo_Org__c LIMIT 1];
        callSignupAPI lstRecs1 = callSignupAPI.getRealTimeOrgStatus(drec.Signup_Request_Id__c, drec.Id);
        Test.stopTest();
    }

    /*
    @isTest static void test_callSignupAPI_UpdateLocalDemoOrgStatus() {
        // Set mock callout class 
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new WebServiceGetStatusMockImpl());
        Demo_Org__c drec = [SELECT Id,Signup_Request_Id__c FROM Demo_Org__c LIMIT 1];
        Map<String, String> signupRecordIdsLocalRecsMap = new Map<String, String>();
        signupRecordIdsLocalRecsMap.put(drec.Signup_Request_Id__c, drec.Id);
        callSignupAPI.updateLocalDemoOrgStatus(signupRecordIdsLocalRecsMap);
        Test.stopTest();
    }
    */

    @isTest static void test_callSignupAPI_GetOrgStatus() {
        // Set mock callout class 
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new WebServiceGetStatusMockImpl());
        Demo_Org__c drec = [SELECT Id,Signup_Request_Id__c FROM Demo_Org__c LIMIT 1];
        callSignupAPI.getOrgStatus(drec.Signup_Request_Id__c, drec.Id);
        Test.stopTest();
    }

    @isTest
    static void testInstallScript() {
        postInstallScript postinstall = new postInstallScript();
        Test.testInstall(postinstall, null);
        Test.testInstall(postinstall, new Version(1,0), true);
        
    }

}
