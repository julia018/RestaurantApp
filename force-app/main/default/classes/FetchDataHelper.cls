public with sharing class FetchDataHelper {

    @AuraEnabled(cacheable=true)
    public static List<Dish_Group__c> getGroups(){
        return [SELECT Id, Name 
                FROM Dish_Group__c
                WITH SECURITY_ENFORCED];
    }

    @AuraEnabled(cacheable=true)
    public static List<Dish_Subgroup__c> getSubgroupsByGroup(Id groupId){
        return [SELECT Id, Name
                FROM Dish_Subgroup__c 
                WHERE Dish_Group__c =: groupId
                WITH SECURITY_ENFORCED];
    }

    @AuraEnabled(cacheable=true)
    public static List<Dish_Item__c> getDishesBySubgroup(Id subgroupId){
        return [SELECT Id, Name, Price__c, Description__c, Amount__c
                FROM Dish_Item__c 
                WHERE Dish_Subgroup__c =: subgroupId
                WITH SECURITY_ENFORCED];
    }
}
