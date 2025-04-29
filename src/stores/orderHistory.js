import { makeRequest } from "@/requests/requests";
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useOrderHistoryStore = defineStore("order-history", () => {
  const endpoint = "orderHistory";
  const ordersHistory = ref([]);

  //   Get positions
  const getOrderHistory = async () => {
    try {
      const response = await makeRequest(endpoint, "GET");
      if (response.data) {
        ordersHistory.value = response.data.orders;
      }
    } catch (error) {
      console.log("This is error", error);
    }
  };

  getOrderHistory()

  return{
    ordersHistory
  }
});
