import { makeRequest } from "@/requests/requests";
import { defineStore } from "pinia";
import { ref } from "vue";


export const useMasterOrderStore = defineStore("master-order", () => {
    const endpoint = "masterOrders";
  
    const masterorders = ref([]);
    const masterOrderByStrategyId = ref([]);
    const orderToEdit = ref(null);
  
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

    const getMasterOrdersByStrategyId = async (id) => {
      try {
        const res = await makeRequest(endpoint, "GET", {}, {}, {}, 0, id, "strategy")

        if(res.data){
          masterOrderByStrategyId.value = res.data?.orders
          return res.data?.orders
        }
      } catch (error) {
        console.log("Error in fetching the specfic data" ,error)
      }
    }

    const placeMasterOrder = async(formData) => {
      try {
        await makeRequest(endpoint, "POST", formData)
      } catch (error) {
        console.error("Error in placing master order", error)
      }
    }

    const editMasterOrder = async (formData) => {
      try {
        const res = await makeRequest(endpoint, "PUT", formData, {}, {}, 0, orderToEdit.value?.id)
        if(res.data)
        {
          orderToEdit.value = null;
        }
      } catch (error) {
        console.error("Error in updating master order", error)
      }
    }
  
    getMasterOrders()
  
    return{
        masterorders,
        placeMasterOrder,
        editMasterOrder,
        getMasterOrdersByStrategyId,
        masterOrderByStrategyId,
        orderToEdit
    }
  });