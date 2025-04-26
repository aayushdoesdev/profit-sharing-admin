import { makeRequest } from "@/requests/requests";
import { ref } from "vue";

import { defineStore } from "pinia";

export const useBrokerStore = defineStore('brokers', () => {

    const endpoint = "brokers";
    const brokers = ref([]);
    const idToEdit = ref(null);

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

    const addEdit = async (form) => {
        try {
            if(idToEdit.value)
            {
                const response = await makeRequest(endpoint , "PUT" , form , {} , {} , 0 , idToEdit.value);
                if (response.data) {
                    return response.data;
                }
            }
            else{
                const response = await makeRequest(endpoint , "POST" , form);
                if (response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.log('Error in addEdit', error)
        }finally{
            idToEdit.value = null;
        }
    }

    const getBrokerByUserId = async (userId) => {
        console.log('userId', userId)
        try {
            const response = await makeRequest(endpoint , 'GET' , {} , {} , {} , 0 , userId , 'user');
    
            if(response.data)
            {
                return response.data[0];
            }
            else {
                return null;
            }
        } catch (error) {
            console.log('Error in getBrokerByUserId', error)
        }
    }

    getBrokers();
    return {
        brokers,
        idToEdit,
        connectBroker,
        getBrokerByUserId,
        addEdit,
        getBrokers
    }

})