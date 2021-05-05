@isTest
global class WebServiceGetStatusMockImpl implements HttpCalloutMock {
    // Implement this interface method
    global HTTPResponse respond(HTTPRequest req) {

        
        // Optionally, only send a mock response for a specific endpoint
        // and method.
        
        // Create a fake response
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"attributes":{"type":"SignupRequest","url":"/services/data/v42.0/sobjects/SignupRequest/0SR5b000000TPAdGAO"},"Status":"Success","CreatedOrgId":"00D5e00000120Eg","CreatedOrgInstance":"NA162","ErrorCode":null,"Username":"rreboucas@triallauncher.test.may3","Id":"0SR5b000000TPAdGAO"}');
        res.setStatusCode(200);
        return res;
    }
}
