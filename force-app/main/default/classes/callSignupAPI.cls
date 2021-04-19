public with sharing class callSignupAPI {

    @AuraEnabled
    public String status { get;set; }
    @AuraEnabled
    public String orgId { get;set; }
    
    @AuraEnabled(cacheable=false)
    public static callSignupAPI getRealTimeOrgStatus(String signupRecordId, String localDemoOrgRec)
    { 
        callSignupAPI rec = new callSignupAPI();
        SignupResponse s = getSignupResponse(signupRecordId, localDemoOrgRec, false);
        rec.orgId = s.CreatedOrgId;
        rec.status = s.Status;

        return rec;
    }

    private static SignupResponse getSignupResponse(String signupRecordId, String localDemoOrgRec, Boolean calledFromApexJob)
    {
        SignupResponse resp = new SignupResponse();
        
        String strFetchResult;

        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:Signup_API_Org/services/data/v42.0/sobjects/SignupRequest/' + signupRecordId + '?fields=Status,CreatedOrgId,CreatedOrgInstance,ErrorCode,Username');
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');

        HttpResponse response = http.send(request);
        // Parse the JSON response

        System.debug('#### GET response: ' + response.getBody());
        strFetchResult = response.getBody();

        if (String.isNotEmpty(strFetchResult))
        {
            resp = SignupResponse.parse(strFetchResult);
            String strStatus = resp.Status;
            System.debug('#### SignupRequest Status: ' + strStatus);

            if (strStatus.equalsIgnoreCase('Success'))
            {
                // update the local demo org record status
                Demo_Org__c d = new Demo_Org__c(Id = localDemoOrgRec);
                d.Status__c = strStatus;
                update d;

                if (calledFromApexJob)
                {
                    // Fire Platform Event to notify LWCs that are waiting for ststus change
                    SignupStatus__e ev = new SignupStatus__e (OrgStatus__c = resp.Status, OrgId__c = resp.CreatedOrgId, OrgInstance__c = resp.CreatedOrgInstance);
                    Database.SaveResult sr = EventBus.publish(ev);
                    System.debug('#### Event Publish Status: ' + sr.isSuccess());
                    String jobName = 'schedFetchSignupStatus-' + localDemoOrgRec + '%';
                }
            }
        }
        return resp;
    }


    @future(callout=true)
    public static void getOrgStatus(String signupRecordId, String localDemoOrgRec)
    { 
        SignupResponse s = getSignupResponse(signupRecordId, localDemoOrgRec, true);
    }

    



}
