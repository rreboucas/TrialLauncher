/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */


@isTest
public without sharing class TestFactory {
    // define default constants that can be accessible to assert against.

    public static final String DEFAULT_MAIN_PRODUCT = 'Sales and Service Cloud';
    public static final String DEFAULT_NAME = 'Regular SDO';
    public static final String DEFAULT_TEMPLATE_ID = '0TT4S000000WXzv';

    public static final String DEFAULT_FEATURE_NAME = 'Next Best Action';
    public static final String DEFAULT_CATEGORY = 'Sales and Service Cloud';
    public static final String DEFAULT_INSTRUCTIONS_DOC = 'Regular SDO';
    public static final String DEFAULT_INSTRUCTION_LINE_1 = 'NBA Component shows user Recommendations (what to do next) based on Strategies (triggers)';
    public static final String DEFAULT_INSTRUCTION_LINE_2 = 'To set up NBA for your demo go to your object record and just Edit the Record Page and Drag and Drop the Einstein Next Best Action Lightning Component to your object record page';
    public static final String DEFAULT_ISV_INSTRUCTIONS = 'https://confluence.internal.salesforce.com/pages/viewpage.action?pageId=217029385';
    public static final String DEFAULT_VIDEO_ID = 'CVDi6PivA4RLVRtjJMCdwL';



    /* The “create” methods are used to instantiate the sobjects without inserting them. 
       This is tremendously helpful when you need to create a particular record and then tweak it before 
       it’s inserted from the calling code. */  
 

    /* The create methods are commonly overloaded to allow different properties to be set. */

    public static Demo_Template__c createDemoTemplate(){

           return new Demo_Template__c(
               Main_Product__c = DEFAULT_MAIN_PRODUCT,
               Name = DEFAULT_NAME,
               Template_ID__c = DEFAULT_TEMPLATE_ID
           );

    }


    public static Demo_Product__c createDemoProduct(String demoTemplateID){

           return new Demo_Product__c(
                Demo_Template__c = demoTemplateID,
                Instructions_Doc__c = DEFAULT_INSTRUCTIONS_DOC,
                Instruction_Line_1__c = DEFAULT_INSTRUCTION_LINE_1,
                Instruction_Line_2__c = DEFAULT_INSTRUCTION_LINE_2,
                ISV_Instructions__c = DEFAULT_ISV_INSTRUCTIONS,
                Name = DEFAULT_FEATURE_NAME,
                Status__c = 'Active',
                Type__c = 'Feature',
                Video_Id__c = DEFAULT_VIDEO_ID
           );

    }

    public static Demo_Org__c createLocalDemoOrgRec(String demoTemplateID){

        return new Demo_Org__c(
             Type_of_App__c = DEFAULT_CATEGORY,
             Trial_Days__c = 2.0,
             Demo_Template__c = demoTemplateID,
             Partner_Name__c = 'Partner A',
             Signup_Request_Id__c = '0SR5b000000TPAdGAO',
             Status__c = 'In Progress',
             Name = 'partner A - 5/7/2021'
        );

 }

 public static Demo_Feature__c createLocalDemoFeatureRec(String demoOrgRecId, String demoProductRecId, String demoProductName){

    return new Demo_Feature__c(
         Demo_Product__c = demoProductRecId,
         Demo_Org__c = demoOrgRecId,
         Instruction_Line_1_Completed__c = false,
         Instruction_Line_2_Completed__c = false,
         Name = demoProductName,
         Status__c = 'Not Configured'
    );

}
    
    


    /* The “Insert” methods are used to create the sobjects and then insert them. They delegate 
       the creation to the create methods and then insert the records. Like the create methods,
       the insert methods are overloaded to allow different properties to be set as necessary.
       Another best practice is to bulk insert or bulk create data, but to keep the sample short, that’s omitted. */

    public static Demo_Template__c insertDemoTemplate(){

          Demo_Template__c recToInsert = createDemoTemplate();
          insert recToInsert;
          return recToInsert;

    }

    public static Demo_Product__c insertDemoProduct(String demoTemplateId, string featureName){

          Demo_Product__c recToInsert = createDemoProduct(demoTemplateID);
          insert recToInsert;
          return recToInsert;

    }
    
    public static Demo_Org__c insertlocalDemoOrgRec(String demoTemplateID){

        Demo_Org__c recToInsert = createLocalDemoOrgRec(demoTemplateID);
        insert recToInsert;
        return recToInsert;

  }

  public static Demo_Feature__c insertlocalDemoFeatureRec(String demoOrgRecId, String demoProductRecId, String demoProductName){

    Demo_Feature__c recToInsert = createLocalDemoFeatureRec(demoOrgRecId, demoProductRecId, demoProductName);
    insert recToInsert;
    return recToInsert;

}
    

    public static String getUUID()
    {
            Blob b = Crypto.GenerateAESKey(128);
            String h = EncodingUtil.ConvertTohex(b);
            String guid = h.SubString(0,8)+ '-' + h.SubString(8,12) + '-' + h.SubString(12,16) + '-' + h.SubString(16,20) + '-' + h.substring(20);
            system.debug(guid);
            return guid;
    }

}