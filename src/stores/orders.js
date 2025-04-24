import { makeRequest } from "@/requests/requests";
import { ref } from "vue";

import { defineStore } from "pinia";

export const useOrderStore = defineStore('orders', () => {

    const endpoint = "orders";
    const orders = ref([]);

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

    getOrders();
    return {
        orders,
        getOrders
    }

})