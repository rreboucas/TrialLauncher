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

    /*
    @future(callout=true)
    public static void updateLocalDemoOrgStatus(Map<String, String> signupRecordIdsLocalRecsMap)
    {
        
        List<SignupResponse> lstResp = new List<SignupResponse>();
        
        Set <String> signIdsSet = new Set<String>();
        signIdsSet = signupRecordIdsLocalRecsMap.keySet();

        String signIdsString = '';
        for(String s:signIdsSet) {
            signIdsString += (signIdsString==''?'':',')+s;
        }

        System.debug('#### signIdsString: ' + signIdsString);

        String strFetchResult;

        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:Signup_API_Org/services/data/v42.0/sobjects/SignupRequest/?ids=' + signIdsString + '?fields=Status,CreatedOrgId,CreatedOrgInstance,ErrorCode,Username');
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');

        HttpResponse response = http.send(request);
        // Parse the JSON response

        System.debug('#### GET response: ' + response.getBody());
        strFetchResult = response.getBody();

        if (String.isNotEmpty(strFetchResult))
        {
            lstResp = SignupResponse.parseList(strFetchResult);
            System.debug('#### lstResp: ' + lstResp);

            for (SignupResponse s: lstResp)
            {
                List<Demo_Org__c> lstLocalRecs = new List<Demo_Org__c>();
                if (s.Status.equalsIgnoreCase('Success'))
                {
                    Demo_Org__c d = new Demo_Org__c(Id = signupRecordIdsLocalRecsMap.get(s.Id));
                    d.Status__c = s.Status;
                    lstLocalRecs.add(d);

                    // Fire Platform Event to notify LWCs that may be waiting for status change
                    SignupStatus__e ev = new SignupStatus__e (OrgStatus__c = s.Status, OrgId__c = s.CreatedOrgId, OrgInstance__c = s.CreatedOrgInstance);
                    Database.SaveResult sr = EventBus.publish(ev);
                    System.debug('#### Event Publish Status: ' + sr.isSuccess());
                }
                System.debug('#### lstLocalRecs: ' + lstLocalRecs);

                // Update local records with status:
                update lstLocalRecs;

            }
            
        }
        
    }
    */


    @future(callout=true)
    public static void getOrgStatus(String signupRecordId, String localDemoOrgRec)
    { 
        SignupResponse s = getSignupResponse(signupRecordId, localDemoOrgRec, true);
    }

    



}
