global without sharing class postInstallScript  implements InstallHandler{
    global void onInstall(InstallContext context) {

         // Schedule apex job to fetch SignupRequest Status on Signup APi Enabled org:

             // Now schedule new batch jobs to run in 10 mins:
        
             String hour = String.valueOf(Datetime.now().hour());
             String min = String.valueOf(Datetime.now().minute() + 10); 
             String ss = String.valueOf(Datetime.now().second());
             
             //parse to cron expression
             String nextFireTime = ss + ' ' + min + ' ' + hour + ' * * ?';
        
            schedFetchOrgStatus s = new schedFetchOrgStatus();
            //s.signupReqId =  strSignupRequestId;
            //s.localDemoOrgRecId = rec.id;
            //System.schedule('schedFetchSignupStatus-' + rec.id + String.valueOf(Datetime.now()), nextFireTime, s);

    }
}
