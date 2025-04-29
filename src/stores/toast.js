import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useToastStore = defineStore('toastData', () => {

    const toasts = ref([])
    let toastData = ref(null)
    const showToastData = ref(false)

    
    const addToast = (heading = "", message = "", type = "error", life=3000) => {
        toastData.value = {
            id: Date.now(),
            show: true,
            severity: type,
            summary: heading,
            detail: message,
            life: life
        }

        toasts.value.push(toastData.value)
        let removeId = toastData.value.id
        setTimeout(() => {
            toasts.value = toasts.value.filter(toast => toast.id !== removeId)
        }, life)

    }
    

    return {
        toasts,
        addToast,
        toastData,
        showToastData
    };
    });