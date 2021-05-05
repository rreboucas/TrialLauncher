public with sharing class SignupResponse {

        public class Attributes {
            public String type;
            public String url;
        }
    
        public Attributes attributes;
        public String Status;
        public String CreatedOrgId;
        public String CreatedOrgInstance;
        public Object ErrorCode;
        public String Username;
        public String Id;
    
        
        public static SignupResponse parse(String json) {
            return (SignupResponse) System.JSON.deserialize(json, SignupResponse.class);
        }

        /*public static List<SignupResponse> parseList(String json) {
            return (List<SignupResponse>) System.JSON.deserialize(json, List<SignupResponse>.class);
        }*/



}
