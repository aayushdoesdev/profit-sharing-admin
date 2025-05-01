<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>

        <!-- Modal -->
        <div class="bg-white rounded-lg shadow-xl z-10 w-full max-w-md mx-4 transition-all">
            <div class="p-6">
                <!-- Header -->
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold">Edit Master Order</h2>
                    <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Form -->
                <form @submit.prevent="submitForm">
                    <!-- stop_loss  -->
                    <div class="mb-4">
                        <label for="stop_loss" class="block text-sm font-medium text-gray-700 mb-1">
                            Stop Loss
                        </label>
                        <input id="stop_loss" v-model="formData.stop_loss" type="text"
                            class="w-full outline-none px-4 py-2 border rounded-lg bg-gray-50" />
                    </div>

                    <!-- Target -->
                    <div class="mb-4">
                        <label for="target" class="block text-sm font-medium text-gray-700 mb-1">
                            Target
                        </label>
                        <input id="target" v-model="formData.target" type="text"
                            class="w-full outline-none px-4 py-2 border rounded-lg bg-gray-50" />
                    </div>

                    <!-- Is Active -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            PNL Track
                        </label>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" v-model="formData.pnl_track" />
                            <div
                                class="w-10 h-5 bg-gray-300 outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300">
                            </div>
                            <div
                                class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5">
                            </div>
                        </label>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-end space-x-2">
                        <button type="submit"
                            class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                            Submit
                        </button>
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useMasterOrderStore } from '@/stores/masterOrders';
import { storeToRefs } from 'pinia';
import { ref, computed, watchEffect } from 'vue';

const masterOrderStore = useMasterOrderStore();
const {orderToEdit} = storeToRefs(masterOrderStore);
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },

});

const emit = defineEmits(['close']);


const formData = ref({
    stop_loss: '',
    target: '',
    pnl_track: true
});

watchEffect(() => {
    if (orderToEdit.value?.id) {
        formData.value.stop_loss = orderToEdit.value.stop_loss;
        formData.value.target = orderToEdit.value.target;
        formData.value.pnl_track = orderToEdit.value.pnl_track;
    }
})

const closeModal = () => {
    emit('close');
};

const submitForm = async () => {

    await masterOrderStore.editMasterOrder(formData.value)
    closeModal();
};
</script>

<style scoped>
.toggle-label {
    width: 48px;
}
</style>