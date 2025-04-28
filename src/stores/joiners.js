import { makeRequest } from "@/requests/requests";
import { ref } from "vue";

import { defineStore } from "pinia";

export const useJoinerStore = defineStore('joiners', () => {

    const endpoint = "joiners";
    const joiners = ref([]);
    const joinersByStrategyId = ref([])

    const getJoiners = async () => {
        try {
            const response = await makeRequest(endpoint, "GET");
            if (response.data) {
                joiners.value = response.data.joiners
            }
        } catch (error) {
            console.log("This is error", error)
        }
    }


    const getJoinersByStrategy = async (id) => {
        try {
            const response = await makeRequest(endpoint, "GET", {}, {}, {}, 0, id, "strategy");

            if (response.data) {
                joinersByStrategyId.value = response.data?.joiners
            }
        } catch (error) {
            console.log("This is error", error)
        }
    }


    const deleteJoinerById = async (id) => {
        try {
             await makeRequest(endpoint, "DELETE", {}, {}, {}, 0, id);
        } catch (error) {
            console.log("This is error", error)
        }
    }

    getJoiners();
    return {
        joiners,
        getJoiners,
        getJoinersByStrategy,
        joinersByStrategyId,
        deleteJoinerById
    }

})