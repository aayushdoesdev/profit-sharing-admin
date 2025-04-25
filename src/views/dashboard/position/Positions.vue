<template>
  <div class="bg-white mt-4 mx-4">
    <div class="flex items-center justify-between px-4 py-4">
      <h2 class="heading-text">Positions</h2>
      <div class="flex items-center gap-4">
        <p class="heading-text font-medium text-custom-green">+7589</p>
        <button @click="togglePopup(true)" class="sq-off-btn">
          <i class="pi pi-sync"></i>
          <p>Square Off All</p>
        </button>
      </div>
    </div>

    <div class="px-4">
      <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text">
        <i class="pi pi-search opacity-50"></i>
        <input type="text" class="bg-transparent py-2 outline-none" placeholder="Search for strategy" />
      </div>
    </div>

    <div class="mt-4 xl:max-h-[400px] overflow-y-auto">
      <table class="w-full">
        <thead class="sticky top-0 z-20">
          <tr
            class="flex items-center justify-between w-full  text-left px-4 py-2 text-[14px] font-light tracking-wide bg-custom-grey text-custom-dark-grey">
            <th class="min-w-[50px] w-[1%]">
              <input type="checkbox" class="w-4 h-4" />
            </th>
            <!-- <th class="w-[5%]">S.NO</th> -->
            <th class="min-w-[200px] w-[20%] font-medium">Strategy</th>
            <th class="min-w-[200px] w-[20%] font-medium">Order type / Price</th>
            <th class="min-w-[100px] w-[10%] font-medium">PNL</th>
            <th class="min-w-[100px] w-[10%] font-medium">Status</th>
            <th class="min-w-[200px] text-right w-[15%] font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(strategy, index) in groupedStrategies" :key="index" class="overflow-y-auto">
            <tr
              class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text font-light tracking-wider border-b border-black border-opacity-10"
              :class="{ 'bg-custom-grey': isOpen === index }">
              <td class="min-w-[50px] w-[1%]">
                <input type="checkbox" class="w-4 h-4" />
              </td>
              <td class="min-w-[200px] flex items-center gap-2 w-[20%]">
                <p class="font-medium">{{ strategy.strategy_name }}</p>
                <p class="bg-[#F3F2F7] px-2 py-1 rounded text-[10px]">
                  {{ strategy.positions.length }} Open
                </p>
              </td>
              <td class="min-w-[200px] flex flex-col gap-2 font-medium w-[20%]">
                <div class="flex items-center gap-2">
                  <p class="bg-green-100 px-1 rounded text-custom-green font-bold">
                    B
                  </p>
                  <p>{{ strategy.buy_price }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <p class="bg-red-100 px-1 rounded text-custom-red font-bold">
                    S
                  </p>
                  <p>{{ strategy.sell_price }}</p>
                </div>
              </td>
              <td class="min-w-[100px] font-medium w-[10%]">500</td>
              <td class="min-w-[100px] w-[10%]">
                <p :class="[
                  'px-2 py-[2px] rounded w-fit font-bold',
                  strategy.status.toLowerCase() === 'open'
                    ? 'bg-green-100 text-custom-green'
                    : 'bg-red-100 text-custom-red',
                ]">
                  {{ strategy.status }}
                </p>
              </td>
              <td class="min-w-[200px] w-[15%] flex justify-end items-center gap-4">
                <button @click="togglePopup(true)" class="sq-off-btn">
                  <i class="pi pi-sync"></i>
                  <p>Square Off All</p>
                </button>
                <button @click="toggle(index)"
                  class="pi pi-angle-down border border-black border-opacity-45 p-1 rounded-md"></button>
              </td>
            </tr>

            <!-- Expanded Row -->
            <tr v-if="isOpen === index" v-for="(position, i) in strategy.positions" :key="i"
              class="flex items-center justify-between px-4 py-4 nrml-text bg-custom-grey border-b border-black border-opacity-10">
              <td class="min-w-[50px] w-[1%]">
                <input type="checkbox" class="w-4 h-4" />
              </td>
              <td class="min-w-[200px] flex flex-col items-start gap-2 w-[20%]">
                <p class="opacity-70">Script / Lot</p>
                <p class="font-medium">{{ position.tradingsymbol || '-' }}</p>
              </td>
              <td class="min-w-[200px] flex flex-col gap-2 font-bold w-[20%]">
                <div class="flex items-center gap-2 font-medium">
                  <p class="bg-green-100 px-1 rounded text-green-600 font-medium">B</p>
                  <p>{{ position.buy_price }}</p>
                </div>
                <div class="flex items-center gap-2 font-medium">
                  <p class="bg-red-100 px-1 rounded text-red-600 font-bold">S</p>
                  <p>{{ position.sell_price }}</p>
                </div>
              </td>
              <td class="min-w-[100px] font-medium w-[10%]">--</td>
              <td class="min-w-[100px] w-[10%]">
                <p :class="[
                  'px-2 py-1 rounded w-fit font-bold',
                  position.status === 'OPEN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600',
                ]">
                  {{ position.status }}
                </p>
              </td>
              <td class="min-w-[200px] w-[15%] flex justify-end items-center gap-4">
                <button @click="togglePopup(true)" class="sq-off-btn">
                  <i class="pi pi-sync"></i>
                  <p>Square Off</p>
                </button>
                <button disabled
                  class="pi pi-angle-down border border-black border-opacity-45 p-1 rounded-md opacity-0"></button>
              </td>
            </tr>

          </template>
        </tbody>
      </table>
    </div>

    <Popup :isOpen="isPopupOpen" @close="togglePopup(false)">
      <img src="/svg/sq-off-img.svg" alt="" class="w-[200px] mx-auto">

      <div class="flex flex-col items-center justify-center text-center gap-4 w-full mt-4">
        <div class="">
          <h2 class="heading-text">Are you sure you want to square off?</h2>
          <p class="nrml-text">
            Once confirmed, this action cannot be reversed
          </p>
        </div>

        <div class="flex items-center gap-2 w-full">
          <button @click="togglePopup(false)"
            class="w-full border border-custom-blue text-custom-blue py-1 rounded-full">
            Cancel
          </button>
          <button class="w-full bg-custom-blue text-white py-1 rounded-full">
            Sq Off
          </button>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script setup>
import Popup from '@/components/Popup.vue';
import { usePositionStore } from '@/stores/positions';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const positionStore = usePositionStore();
const { groupedStrategies } = storeToRefs(positionStore);

const isOpen = ref(null); // null means no open row
const isPopupOpen = ref(false);
const toggle = (index) => {
  isOpen.value = isOpen.value === index ? null : index;
};
const togglePopup = (button) => {
  isPopupOpen.value = button;
};

// Mock Data
const positions1 = ref([
  {
    name: "Britex Superhero",
    openCount: 3,
    buyPrice: 8329.89,
    sellPrice: 8329.89,
    pnl: "+5473",
    status: "Open",
    script: "GHEY368WI2WY62WSH2",
  },
  {
    name: "Alpha Momentum",
    openCount: 2,
    buyPrice: 9124.23,
    sellPrice: 9154.11,
    pnl: "+3021",
    status: "Open",
    script: "AJSD8293JKLQWEHJSA",
  },
  {
    name: "Bear Trap",
    openCount: 1,
    buyPrice: 4300.0,
    sellPrice: 4275.5,
    pnl: "-245",
    status: "Closed",
    script: "BDHF28374DFWE84HD",
  },
  {
    name: "Quantum Edge",
    openCount: 4,
    buyPrice: 6750.0,
    sellPrice: 6815.0,
    pnl: "+650",
    status: "Open",
    script: "QEHD823HFD823FD",
  },
  {
    name: "Speedster",
    openCount: 2,
    buyPrice: 7230.25,
    sellPrice: 7255.9,
    pnl: "+103",
    status: "Closed",
    script: "SPDTRH823HRF823",
  },
]);
</script>

<style lang="scss" scoped></style>