import { makeRequest } from "@/requests/requests";
import { ref } from "vue";

import { defineStore } from "pinia";

export const useBrokerStore = defineStore('brokers', () => {

    const endpoint = "brokers";
    const brokers = ref([]);

    const getBrokers = async () => {
        try {
            const response = await makeRequest(endpoint, "GET");
            if (response.data) {
                brokers.value = response.data.brokers
            }
        } catch (error) {
            console.log("This is error", error)
        }
    }

    const connectBroker = async (brokerId) => {
        try {
            const response = await makeRequest(endpoint, "PUT" , {} , {} , {} , 0 , brokerId , 'connect');
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            console.log("This is error", error)
        }
    }

    getBrokers();
    return {
        brokers,
        connectBroker,
        getBrokers
    }

})