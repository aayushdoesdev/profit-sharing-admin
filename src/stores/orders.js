import { makeRequest } from "@/requests/requests";
import { ref } from "vue";

import { defineStore } from "pinia";

export const useOrderStore = defineStore('orders', () => {

    const endpoint = "manualOrders";
    const orders = ref([]);
    const strategyOrders = ref([]);
    const idToDelete = ref(null);
    const brokerOrders = ref([]);

    const getOrders = async () => {
        try {
            const response = await makeRequest(endpoint, "GET");
            if (response.data) {
                orders.value = response.data.orders
            }
        } catch (error) {
            console.log("This is error", error)
        }
    }

    const getOrderByStrategyId = async (id) => {
        try {
            const response = await makeRequest(endpoint, "GET", {}, {}, {}, 0, id, 'strategy');
            if (response.data) {
                strategyOrders.value = response.data?.orders
            }
        } catch (error) {
            console.log("This is error", error)
        }
    }
    const getOrderByBrokerId = async (id) => {
        try {
            const response = await makeRequest(endpoint, "GET", {}, {}, {}, 0, id, 'broker');
            if (response.data) {
                brokerOrders.value = response.data?.orders
            }
        } catch (error) {
            console.log("This is error", error)
        }
    }

    const deleteOrder = async () => {
        try {
            if (idToDelete.value) {
                const response = await makeRequest(endpoint, "DELETE", {}, {}, {}, 0, idToDelete.value);
                if(response.data)
                {
                    idToDelete.value = null;
                }
            }

        } catch (error) {
            console.log("This is error", error)
        }
    }
    getOrders();
    return {
        orders,
        getOrderByStrategyId,
        getOrders,
        deleteOrder,
        getOrderByBrokerId,
        brokerOrders,
        idToDelete,
        strategyOrders
    }

})