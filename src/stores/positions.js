import { makeRequest } from "@/requests/requests";
import { ref } from "vue";

import { defineStore } from "pinia";

export const usePositionStore = defineStore('positions', () => {

    const endpoint = "positions";
    const positions = ref([]);

    const getPositions = async () => {
        try {
            const response = await makeRequest(endpoint, "GET");
            if (response.data) {
                positions.value = response.data.positions
            }
        } catch (error) {
            console.log("This is error", error)
        }
    }

    getPositions();
    return {
        positions,
        getPositions
    }

})