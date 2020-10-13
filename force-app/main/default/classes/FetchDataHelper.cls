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

    @AuraEnabled
    public static Id insertOrder(Decimal totalPrice, Id owner, String address){
        Order__c order = new Order__c(
            Cost__c = totalPrice,
            OwnerId = owner,
            Delivery_Address__c = address
        );
        try{
            insert order;
            return order.Id;
        } catch(DmlException e) {
            return '0';
        }
    }

    @AuraEnabled
    public static Boolean insertOrderItemList(List<Order_Item__c> orderItemList){
        try{
            insert orderItemList;
            return true;
        } catch(DmlException e) {
            return null;
        }
    }

    @AuraEnabled
    public static Id insertOrderItem(){
        try{
            insert orderItem;
            return orderItem.Id;
        } catch(DmlException e) {
            return null;
        }
    }
}
