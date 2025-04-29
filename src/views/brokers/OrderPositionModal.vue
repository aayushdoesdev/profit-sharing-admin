<template>
    <transition name="slide">
        <div v-if="showOrderPositionSidebar"
            class="fixed right-0 top-0 h-full w-[400px] md:w-[800px] bg-white shadow-lg z-50 py-4">
            <div class="flex justify-between items-center mb-4 px-4">
                <h2 class="text-xl font-bold">Order and Positions</h2>
                <div class="flex gap-4">
                    <button @click="closeModal"
                        class="text-[16px] border border-custom-blue text-custom-blue px-4 py-1 rounded">
                        Cancel
                    </button>
                </div>
            </div>

            <div class="border-b border-black border-opacity-10 flex justify-between items-center nrml-text">
                <div class="flex items-center gap-8 px-4">
                    
                    <button @click="toggleSections('orders')" class="px-4 py-1" :class="{
                        'border-b-2 border-custom-blue text-custom-blue font-semibold':
                            activeSection === 'orders',
                    }">
                        Orders
                    </button>
                    <button @click="toggleSections('positions')" class="px-4 py-1" :class="{
                        'border-b-2 border-custom-blue text-custom-blue font-semibold':
                            activeSection === 'positions',
                    }">
                        Positions
                    </button>
                </div>
            </div>
            <Orders v-if="activeSection === 'orders'"/>
            <Positions v-if="activeSection === 'positions'"/>
        </div>
    </transition>
</template>

<script setup>
import { ref } from 'vue';
import Orders from './Orders.vue';
import Positions from './Positions.vue';


const props = defineProps({
    showOrderPositionSidebar: Boolean
})
const activeSection = ref("orders");

const toggleSections = (button) => {
  activeSection.value = button;
};
const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};

</script>

<style scoped>
.tooltip-text {
    position: fixed;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.slide-enter-from {
    transform: translateX(100%);
}

.slide-enter-to {
    transform: translateX(0%);
}

.slide-leave-from {
    transform: translateX(0%);
}

.slide-leave-to {
    transform: translateX(100%);
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}
</style>