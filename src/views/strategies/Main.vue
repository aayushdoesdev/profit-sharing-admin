<script setup>
import { ref } from "vue";
import Popup from "@/components/Popup.vue";
import Tooltip from "@/components/Tooltip.vue";

const showSidebar = ref(false);
const currentStep = ref(1); // 1 = Add User, 2 = Add Broker

const isDeletePopupOpen = ref(false);
const isSqoffPopupOpen = ref(false);

const toggleSqoffPopup = (button) => {
  isSqoffPopupOpen.value = button;
};
const toggleDeletePopup = (button) => {
  isDeletePopupOpen.value = button;
};

const strategies = ref([
  {
    id: 1,
    name: "Most profitable plan",
    type: "Options",
    expiry: "12 Mar 2025",
    script: "NIFTY",
    entry: "18500",
    exit: "19200",
    ltp: "18700",
    positionStatus: "Active",
    active: true,
  },
]);
</script>

<template>
  <main class="bg-white py-2">
    <div class="flex items-center justify-between px-4 nrml-text">
      <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md">
        <i class="pi pi-search opacity-50"></i>
        <input
          type="text"
          class="bg-transparent py-2 outline-none"
          placeholder="Search for user"
        />
      </div>

      <div>
        <button @click="showSidebar = true" class="flex items-center gap-2 btn">
          <p>Add New Strategy</p>
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>

    <div class="mt-4 overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
          >
            <th class="min-w-[50px] w-[5%] font-medium">S.NO</th>
            <th class="min-w-[150px] w-[10%] font-medium">Name</th>
            <th class="min-w-[100px] w-[10%] font-medium">Type</th>
            <th class="min-w-[120px] w-[10%] font-medium">Expiry</th>
            <th class="min-w-[100px] w-[10%] font-medium">Entry / Exit</th>
            <th class="min-w-[100px] w-[10%] font-medium">LTP</th>
            <th class="min-w-[120px] w-[10%] font-medium">Status</th>
            <th class="min-w-[100px] w-[10%] font-medium">Active</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(strategy, index) in strategies"
            :key="strategy.id"
            class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium"
          >
            <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
            <td class="min-w-[150px] w-[10%]">
              <p>{{ strategy.name }}</p>
              <p>{{ strategy.script }}</p>
            </td>
            <td class="min-w-[100px] w-[10%]">{{ strategy.type }}</td>
            <td class="min-w-[100px] w-[10%]">{{ strategy.expiry }}</td>
            <td class="min-w-[100px] w-[10%]">
              <p>₹{{ strategy.entry }}</p>
              <p>₹{{ strategy.exit }}</p>
            </td>
            <td class="min-w-[100px] w-[10%]">₹{{ strategy.ltp }}</td>
            <td class="min-w-[120px] w-[10%]">
              <span
                class="px-3 py-1 rounded-full bg-green-100 text-green-600"
                >{{ strategy.positionStatus }}</span
              >
            </td>
            <td class="min-w-[100px] w-[10%]">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" />
                <div
                  class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"
                ></div>
                <div
                  class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"
                ></div>
              </label>
            </td>
            <td class="min-w-[100px] flex w-[10%] gap-4">
              <Tooltip text="Edit">
                <button class="pi pi-pencil text-[18px]"></button>
              </Tooltip>
              
              <Tooltip text="Joiner">
                <button class="pi pi-pencil text-[18px]"></button>
              </Tooltip>

              <Tooltip text="Order">
                <button class="pi pi-briefcase text-[18px]"></button>
              </Tooltip>

              <Tooltip text="Delete">
                <button class="pi pi-trash text-[18px]"></button>
              </Tooltip>

            </td>
          </tr>
        </tbody>
      </table>

      <transition name="slide">
        <div
          v-if="showSidebar"
          class="fixed right-0 top-0 h-full w-[400px] md:w-[600px] bg-white shadow-lg z-50 p-6"
        >
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Add Strategy</h2>
            <div class="flex gap-4">
              <button
                @click="showSidebar = false"
                class="text-[16px] border border-custom-blue text-custom-blue px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                class="text-[16px] bg-custom-blue text-white font-semibold px-4 py-1 rounded"
              >
                Done
              </button>
            </div>
          </div>

          <!-- Form -->
          <div class="nrml-text space-y-4 mt-4">
            <!-- Step 1: Add User Form -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="opacity-70">Strategy name</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Strategy Type</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Expiry Date</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Exchange</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Side</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Image Icon</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Script</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Capital Required</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Risk</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Message</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Stop Loss</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Target</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">ATM / OTM</label>
                <input type="text" class="custom-input" />
              </div>
              <div class="flex flex-col items-start gap-1">
                <p class="opacity-70">Traling Active</p>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" />
                  <div
                    class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"
                  ></div>
                  <div
                    class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"
                  ></div>
                </label>
              </div>
              <div class="flex flex-col items-start gap-1">
                <p class="opacity-70">Is Active</p>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" />
                  <div
                    class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"
                  ></div>
                  <div
                    class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"
                  ></div>
                </label>
              </div>
              <div class="flex flex-col items-start gap-1">
                <p class="opacity-70">Is Locked</p>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" />
                  <div
                    class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"
                  ></div>
                  <div
                    class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"
                  ></div>
                </label>
              </div>
            </div>

            <!-- <button class="bg-custom-blue text-white px-4 py-2 rounded-md">
              Save
            </button> -->
          </div>
        </div>
      </transition>

      <Popup :isOpen="isSqoffPopupOpen" @close="toggleSqoffPopup(false)">
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
              @click="toggleSqoffPopup(false)"
              class="w-full border border-custom-blue text-custom-blue py-1 rounded-full"
            >
              Cancel
            </button>
            <button class="w-full bg-custom-blue text-white py-1 rounded-full">
              Sq Off
            </button>
          </div>
        </div>
      </Popup>

      <Popup :isOpen="isDeletePopupOpen" @close="toggleDeletePopup(false)">
        <img src="/svg/delete-img.svg" alt="" class="w-[350px] mx-auto" />

        <div
          class="flex flex-col items-center justify-center text-center gap-4 w-full mt-4"
        >
          <div class="">
            <h2 class="heading-text">Are you sure you want to delete?</h2>
            <p class="nrml-text">
              Once confirmed, this action cannot be reversed
            </p>
          </div>

          <div class="flex items-center gap-2 w-full">
            <button
              @click="toggleDeletePopup(false)"
              class="w-full border border-custom-blue text-custom-blue py-1 rounded-full"
            >
              Cancel
            </button>
            <button class="w-full bg-custom-red text-white py-1 rounded-full">
              Delete
            </button>
          </div>
        </div>
      </Popup>
    </div>
  </main>
</template>

<style scoped>
.clip-right-arrow {
  clip-path: polygon(0 0, 100% 50%, 0 100%);
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
