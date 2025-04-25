import { makeRequest } from "@/requests/requests";
import { ref } from "vue";

import { defineStore } from "pinia";

export const useUserStore = defineStore('users', () => {

    const endpoint = "users";
    const users = ref([]);

    const getUsers = async () => {
        try {
            const response = await makeRequest(endpoint, "GET");
            if (response.data) {
                users.value = response.data.users
            }
        } catch (error) {
            console.log("This is error", error)
        }
    }

    getUsers();
    return {
        users,
        getUsers
    }

})