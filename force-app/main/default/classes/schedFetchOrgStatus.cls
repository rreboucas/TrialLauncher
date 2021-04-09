public with sharing class schedFetchOrgStatus implements Schedulable, Database.AllowsCallouts {

    public String signupReqId { get;set; }
    public String localDemoOrgRecId { get;set; }

    public void execute(SchedulableContext SC) {
        callSignupAPI.getOrgStatus(this.signupReqId, this.localDemoOrgRecId);
     }

     
}
