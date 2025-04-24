import { makeRequest } from "@/requests/requests";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useManualOrders = defineStore("manual-order", () => {
  const endpoint = "manualOrders";

  const manualorders = ref([]);

  const getManualOrders = async () => {
    try {
      const response = await makeRequest(endpoint, "GET");

      if(response.data){
        manualorders.value = response.data
        console.log(manualorders.value)
      }
    } catch (error) {
        console.log("This is error" ,error)
    }
  };

  getManualOrders()

  return{
    manualorders
  }
});

