<script setup>
import { ref } from "vue";
import Position from "./Position.vue";
import Orders from "./Orders.vue";
import MasterOrders from "./MasterOrders.vue";

const activeSection = ref("orders");

const toggleSections = (button) => {
  activeSection.value = button;
};

</script>

<template>
  <main class="bg-white py-4">
    <div class="border-b border-black border-opacity-10 flex justify-between items-center nrml-text">
      <div class="flex items-center gap-8 px-4">
        <button @click="toggleSections('master-orders')" class="px-4 py-1" :class="{
          'border-b-2 border-custom-blue text-custom-blue font-semibold':
            activeSection === 'master-orders',
        }">
          Master Orders
        </button>
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


    <div class="mt-4 ">
      <!-- !POSITIONS TABLE -->
      <Position v-if="activeSection === 'positions'" />

      <!-- !ORDERS TABLE -->
      <Orders v-if="activeSection === 'orders'" />

      <!-- ! MASTER ORDERS -->
      <MasterOrders v-if="activeSection === 'master-orders'" />
    </div>
  </main>
</template>


