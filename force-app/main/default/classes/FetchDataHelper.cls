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

    @AuraEnabled(cacheable=true)
    public static List<Order__c> getOrdersById(Id userId){
        return [SELECT Id, Cost__c, Date__c, Status__c, Delivery_Address__c, (SELECT Dish_Item__r.Name, Amount__c FROM Order_Items__r)
                FROM Order__c 
                WHERE OwnerId =: userId
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
    public static Id insertOrderItem(Integer amount, String comments, String dishItemId, String orderId){
        
            //Id dishItemId = getDishItemIdByName(dishItemName);
            Order_Item__c orderItem = new Order_Item__c(
                Amount__c = amount,
                Comments__c = comments,
                Dish_Item__c = dishItemId,
                MyOrder__c = orderId
            );
            insert orderItem;
            return orderItem.Id;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getPickListValuesIntoList(){
        List<String> pickListValuesList = new List<String>();
        Schema.DescribeFieldResult fieldResult = Order__c.Status__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            pickListValuesList.add(pickListVal.getLabel());
        }     
        return pickListValuesList;
     }
    
}
