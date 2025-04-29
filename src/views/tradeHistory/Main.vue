<script setup>
import { ref } from "vue";
import Popup from "@/components/Popup.vue";
import PositionTable from "./PositionTable.vue";
import OrderTable from "./OrderTable.vue";


const activeSection = ref("orders");
const isPopupOpen = ref(false);

const toggleSections = (button) => {
  activeSection.value = button;
};

const togglePopup = (button) => {
  isPopupOpen.value = button;
};
</script>

<template>
  <main class="bg-white py-4">
    <div class="border-b border-black border-opacity-10">
      <div class="flex items-center gap-8 px-4">
        <button
          @click="toggleSections('orders')"
          class="px-4 py-1"
          :class="{
            'border-b-2 border-custom-blue text-custom-blue':
              activeSection === 'orders',
          }"
        >
          Orders
        </button>
        <button
          @click="toggleSections('positions')"
          class="px-4 py-1"
          :class="{
            'border-b-2 border-custom-blue text-custom-blue':
              activeSection === 'positions',
          }"
        >
          Positions
        </button>
      </div>
    </div>

    <div class="mt-4">
      <!-- !POSITIONS TABLE -->
      <div v-if="activeSection === 'positions'" class="">
        <PositionTable/>
      </div>

      <!-- !ORDERS TABLE -->
      <div v-if="activeSection === 'orders'" class="">
        <OrderTable/>
      </div>
    </div>



    <!-- <Popup :isOpen="isPopupOpen" @close="togglePopup(false)">
      <img src="/svg/sq-off-img.svg" alt="" class="w-[200px] mx-auto" />

      <div
        class="flex flex-col items-center justify-center text-center gap-4 w-full mt-4"
      >
        <div class="">
          <h2 class="heading-text">Are you sure you want to square off?</h2>
          <p class="nrml-text">
            Once confirmed, this action cannot be reversed
          </p>
        </div>

        <div class="flex items-center gap-2 w-full">
          <button
            @click="togglePopup(false)"
            class="w-full border border-custom-blue text-custom-blue py-1 rounded-full"
          >
            Cancel
          </button>
          <button class="w-full bg-custom-blue text-white py-1 rounded-full">
            Sq Off
          </button>
        </div>
      </div>
    </Popup> -->
  </main>
</template>
