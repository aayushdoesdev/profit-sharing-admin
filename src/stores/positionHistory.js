import { makeRequest } from "@/requests/requests";
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const usePositionHistoryStore = defineStore("positions-history", () => {
  const endpoint = "positionHistory";
  const positionsHistory = ref([]);

  //   Get positions
  const getHistoryPositions = async () => {
    try {
      const response = await makeRequest(endpoint, "GET");
      if (response.data) {
        positionsHistory.value = response.data.positions;
      }
    } catch (error) {
      console.log("This is error", error);
    }
  };

  getHistoryPositions()

  return{
    positionsHistory
  }
});
