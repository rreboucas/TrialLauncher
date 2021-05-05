public with sharing class schedFetchOrgStatus implements Schedulable, Database.AllowsCallouts {

    public String signupReqId { get;set; }
    public String localDemoOrgRecId { get;set; }

    public void execute(SchedulableContext SC) {
        Map<String, String> demoOrginProgressMap = new Map<String, String>();
        List<Demo_Org__c> lstLocalRecsPending = [SELECT Id,Signup_Request_Id__c FROM Demo_Org__c where Status__c = 'In Progress' OR Status__c = 'InProgress'];
        System.debug('#### lstLocalRecsPending: ' + lstLocalRecsPending);
        if (lstLocalRecsPending.size() > 0)
        {
            for (Demo_Org__c d : lstLocalRecsPending)
            {
                demoOrginProgressMap.put(d.Signup_Request_Id__c, d.Id);
            }
            System.debug('#### demoOrginProgressMap: ' + demoOrginProgressMap);
            //callSignupAPI.updateLocalDemoOrgStatus(demoOrginProgressMap);
        }
        
     }

     
}
