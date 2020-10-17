@isTest
public with sharing class FetchDataHelperTest {
    
    @isTest
    static void getDishItemIdByNameTest() {
    }

    @isTest
    static void getPickListValuesIntoListTest() {
        List<String> values = FetchDataHelper.getPickListValuesIntoList();
        System.assertEquals(4, values.size());
    }
}
