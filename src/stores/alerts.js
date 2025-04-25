import { ref } from "vue"
import { defineStore } from "pinia"
import { makeRequest } from "@/requests/requests"



export const useAlertsStore = defineStore('alerts', () => {
    const endpoint = 'alerts'

    const alerts = ref([])

    const getAlerts = async() => {
        try {
            const response = await makeRequest(endpoint, "GET")

            if (response.data) {
                alerts.value = response.data?.webhook_alerts
                console.log(alerts.value)
            } else {
                return alerts.value = []
            }
        } catch (error) {
            console.log("This is alerts error", error)
        }
    }

    getAlerts()

    return{
        alerts
    }
})