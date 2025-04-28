import { makeRequest } from "@/requests/requests";
import { defineStore } from "pinia";
import { ref } from "vue";


export const useMasterOrderStore = defineStore("master-order", () => {
    const endpoint = "masterOrders";
  
    const masterorders = ref([]);
  
    const getMasterOrders = async () => {
      try {
        const response = await makeRequest(endpoint, "GET");
  
        if(response.data){
            masterorders.value = response.data.orders
        }   
      } catch (error) {
          console.log("This is error" ,error)
      }
    };
  
    getMasterOrders()
  
    return{
        masterorders
    }
  });