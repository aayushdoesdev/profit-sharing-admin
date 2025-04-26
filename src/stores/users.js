import { makeRequest } from "@/requests/requests";
import { ref } from "vue";

import { defineStore } from "pinia";

export const useUserStore = defineStore('users', () => {

    const endpoint = "users";
    const users = ref([]);
    const idtoEdit = ref(null);

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

    const addEditUser = async (form) => {
        try {
            if (idtoEdit.value) {
                const response = await makeRequest(endpoint, "PUT", form, {}, {}, 0, idtoEdit.value);
                if (response.data) {
                    return response.data;
                }
            } else {
                const response = await makeRequest(endpoint, "POST", form);
                if (response.data) {
                    return response.data;
                }
            }
        } catch (error) {
            console.log('Error in addEditUser', error)
        } finally {
            idtoEdit.value = null;
        }
       
    }
    getUsers();
    return {
        idtoEdit,
        users,
        addEditUser,
        getUsers
    }

})