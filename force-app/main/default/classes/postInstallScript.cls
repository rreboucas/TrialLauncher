global without sharing class postInstallScript  implements InstallHandler{
    global void onInstall(InstallContext context) {

          // Schedule apex job to fetch SignupRequest Status on Signup APi Enabled org:

          List<CronTrigger> lstFetchJobs = [SELECT Id FROM CronTrigger where (CronJobDetail.name like 'schedFetchSignupStatus%' ) AND State = 'Waiting'];
          if (!lstFetchJobs.isEmpty())
          {
              for (CronTrigger job: lstFetchJobs)
              {
                  System.abortJob(job.Id);
              }
          }
  
           // Now schedule new batch jobs:
        
        String hour = String.valueOf(Datetime.now().hour());
        String min = String.valueOf(Datetime.now().minute() + 1); 
        String ss = String.valueOf(Datetime.now().second());

        //parse to cron expression
        String nextFireTime = ss + ' ' + min + ' ' + hour + ' * * ?';

          // create unique identifier for jobs name:
          Blob b = Crypto.GenerateAESKey(128);
          String h = EncodingUtil.ConvertTohex(b);
          String guid = h.SubString(0,8)+ '-' + h.SubString(8,12) + '-' + h.SubString(12,16) + '-' + h.SubString(16,20) + '-' + h.substring(20);
          system.debug(guid);
         
          schedFetchOrgStatus s = new schedFetchOrgStatus(); 
          System.schedule('schedFetchSignupStatus Job ' + guid + String.valueOf(Datetime.now()), nextFireTime, s);

    }

    
}
