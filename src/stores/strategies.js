import { makeRequest } from "@/requests/requests";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useStrategiesStore = defineStore("strategies", () => {
  const endpoint = "strategies";

  const strategies = ref([]);

  const getStrategies = async () => {
    try {
      const response = await makeRequest(endpoint, "GET");

      if(response.data){
        strategies.value = response.data.strategies
        // console.log(manualorders.value)
      }
    } catch (error) {
        console.log("This is error" ,error)
    }
  };

  const createStrategy = async (strategyData) => {
    try {
      const response = await makeRequest(endpoint, "POST", strategyData);
      if (response.data) {
        strategies.value.push(response.data); // Add new strategy to the list
        return response.data;
      }
    } catch (error) {
      console.error("Error creating strategy:", error);
      throw error;
    }
  };

  const updateStrategy = async (id, updatedData) => {
    try {
      await makeRequest(endpoint, "PUT", updatedData, {}, {}, 0, id);
     
    } catch (error) {
      console.error("Error updating strategy", error);
    }
  };


  const deleteStrategy = async (id) => {
    try {
      await makeRequest(endpoint, "DELETE", {}, {}, {}, 0, id);
     
    } catch (error) {
      console.error("Error deleting strategy", error);
    }
  };

  getStrategies()

  return{
    strategies,
    createStrategy,
    updateStrategy,
    deleteStrategy
  }
});
