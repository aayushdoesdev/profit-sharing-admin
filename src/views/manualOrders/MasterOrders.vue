<script setup>
import Tooltip from "@/components/Tooltip.vue";
import { ref, reactive, computed } from "vue";
import { useMasterOrderStore } from "@/stores/masterOrders";
import { useStrategiesStore } from "@/stores/strategies";
import { storeToRefs } from "pinia";
import MasterOrderEdit from "./MasterOrderEdit.vue";

const masterOrderStore = useMasterOrderStore();
const { masterorders, orderToEdit } = storeToRefs(masterOrderStore);

const strategyStore = useStrategiesStore();
const { strategies } = storeToRefs(strategyStore);

const showSidebar = ref(false);
const showEditSidebar = ref(false);
const searchQuery = ref('');


function formatDate(inputDate) {
  const date = new Date(inputDate);
  return date.toLocaleString("en-US", {
    month: "short",
    // year: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // optional: for AM/PM style, remove if you prefer 24-hour
  });
}

const filteredMasterOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return masterorders.value;

  return masterorders.value.filter(order =>
    order.strategy_name.toLowerCase().includes(query)
  );
});

const orderTypes = ["MARKET", "LIMIT", "SL-LIMIT", "SL-MARKET"];

const form = reactive({
  strategy_id: null,
  tradingsymbol: "",
  exchange: "BSE",
  variety: "regular",
  order_type: "MARKET",
  transaction_type: "BUY",
  product: "MIS",
  validity: "DAY",
  quantity: 0,
  price: 0,
  trigger_price: 0,
  stop_loss: 0,
  target: 0,
  is_sltgt_enabled: false,
  pnl_track: false,
});

const btnToggle = (active) =>
  `px-4 py-2 rounded border ${active
    ? "bg-blue-600 text-white border-blue-600"
    : "bg-white border-gray-300 text-gray-600"
  }`;

const tabButton = (type) =>
  `px-4 py-2 ${form.order_type === type
    ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
    : "text-gray-600"
  }`;

const submitOrder = async () => {
  try {
    await masterOrderStore.placeMasterOrder(form);
  } catch (error) {
    console.error(error);
  }
};

const openEditSidebar = async (order) => {
  try {

    orderToEdit.value = order;
    showEditSidebar.value = true;

  } catch (error) {
    console.error("Error loading order for edit:", error);
  }
};
</script>

<template>
  <div class="">
    <div class="flex items-center justify-between px-4">
      <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text">
        <i class="pi pi-search opacity-50"></i>
        <input type="text" v-model="searchQuery" class="bg-transparent py-1 outline-none"
          placeholder="Search for user" />
      </div>

      <button @click="showSidebar = true" class="btn flex items-center gap-2 nrml-text">
        <i class="pi pi-plus"></i>
        <p>Place Order</p>
      </button>
    </div>
    <div class="mt-4 overflow-auto h-[calc(100vh-200px)]">
      <table class="w-full">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey">
            <th class="min-w-[50px] w-[5%] text-left font-medium">S.NO</th>
            <th class="min-w-[180px] w-[15%] font-medium">Strategy / Script</th>
            <th class="min-w-[180px] w-[20%] font-medium">Side / Price</th>
            <th class="min-w-[80px] w-[15%] font-medium">QTY</th>
            <th class="min-w-[80px] w-[10%] font-medium">LTP</th>
            <th class="min-w-[100px] w-[10%] font-medium">Trigger Price</th>
            <th class="min-w-[100px] w-[10%] font-medium">Status</th>
            <th class="min-w-[100px] w-[10%] text-right font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(order, index) in filteredMasterOrders" :key="order.id"
            class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium">
            <td class="w-[5%] min-w-[50px] text-left">{{ index + 1 }}</td>
            <td class="w-[15%] min-w-[180px]">
              <p>{{ order.strategy_name }}</p>
              <p>{{ order.strategy_script }}</p>
            </td>
            <td class="w-[20%] min-w-[180px]">
              <div class="flex items-center gap-2">
                <p :class="[
                  'px-1 rounded font-bold',
                  order.transaction_type === 'BUY'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600',
                ]">
                  {{ order.transaction_type }}
                </p>
                <p>
                  {{ order.price }}
                  <span class="text-[10px]">
                    {{ formatDate(order.created_at) }}
                  </span>
                </p>
              </div>
            </td>

            <td class="w-[15%] min-w-[80px]">{{ order.quantity }}</td>
            <!-- <td class="w-[10%]">{{ order.ltp }}</td> -->
            <td class="w-[10%] min-w-[80px]">{{ order.trigger_price }}</td>
            <td class="w-[10%] min-w-[100px]">
              <p :class="[
                'px-4 py-[2px] rounded w-fit',
                order.status.toLowerCase() === 'complete'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-700',
              ]">
                {{ order.status }}
              </p>
            </td>
            <td class="w-[10%] min-w-[100px] text-center flex justify-end items-center gap-4">
              <Tooltip v-if="order.status.toLowerCase() != 'complete'" text="Edit">
                <button @click="openEditSidebar(order)"
                  class="pi pi-pen-to-square text-custom-blue text-[16px]"></button>
              </Tooltip>
              <Tooltip text="View">
                <button class="pi pi-eye text-[16px]"></button>
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Sidebar Overlay -->
    <transition name="slide">
      <div v-if="showSidebar"
        class="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white shadow-lg z-50 p-6 overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Manual Order</h2>
          <div class="space-x-2">
            <button @click="showSidebar = false" class="px-4 py-1 border rounded text-blue-600 border-blue-600">
              Cancel
            </button>
            <button @click="submitOrder" class="px-4 py-1 bg-blue-600 text-white rounded">
              Done
            </button>
          </div>
        </div>

        <!-- Strategy & Symbol -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-600">Strategy</label>
            <select v-model="form.strategy_id" class="input">
              <option value="" disabled>Select strategy</option>
              <option v-for="strategy in strategies" :key="strategy.id" :value="strategy.id">
                {{ strategy.name }}
              </option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-600">Trading Symbol</label>
            <input v-model="form.tradingsymbol" type="text" placeholder="Search for symbols" class="input" />
          </div>
        </div>

        <!-- Transaction Type -->
        <div class="mb-4 nrml-text">
          <label class="block font-medium text-gray-600 mb-2">Transaction</label>
          <div class="flex justify-between gap-4">
            <button :class="btnToggle(form.transaction_type === 'BUY')" class="w-full"
              @click="form.transaction_type = 'BUY'">
              Buy
            </button>
            <button :class="btnToggle(form.transaction_type === 'SELL')" class="w-full"
              @click="form.transaction_type = 'SELL'">
              Sell
            </button>
          </div>
        </div>

        <!-- Tabs for Order Types -->
        <div class="mb-6 nrml-text">
          <div class="flex gap-3 border-b">
            <button v-for="type in orderTypes" :key="type" :class="tabButton(type)" class="w-full whitespace-nowrap"
              @click="form.order_type = type">
              {{ type }}
            </button>
          </div>
        </div>

        <!-- Core Inputs -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="text-sm text-gray-600">Quantity</label>
            <input v-model.number="form.quantity" type="number" class="input" />
          </div>
          <div>
            <label class="text-sm text-gray-600">Price</label>
            <input v-model.number="form.price" type="number" class="input" :disabled="form.order_type === 'MARKET' || form.order_type === 'SL-MARKET'
              " />
          </div>
          <div v-if="form.order_type.includes('SL')">
            <label class="text-sm text-gray-600">Trigger Price</label>
            <input v-model.number="form.trigger_price" type="number" class="input" :disabled="form.order_type === 'MARKET' || form.order_type === 'LIMIT'
              " />
          </div>
        </div>

        <!-- SL/Target Inputs -->
        <div v-if="form.is_sltgt_enabled" class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="text-sm text-gray-600">Target</label>
            <input v-model.number="form.target" type="number" class="input" />
          </div>
          <div>
            <label class="text-sm text-gray-600">Stop Loss</label>
            <input v-model.number="form.stop_loss" type="number" class="input" />
          </div>
        </div>

        <!-- Enable SL/Target Toggle -->
        <div class="flex items-center gap-2 mb-4">
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="form.is_sltgt_enabled" type="checkbox" class="sr-only peer" />
            <div
              class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300">
            </div>
            <div
              class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5">
            </div>
          </label>
          <span class="text-sm text-gray-600">Enable SL/Target</span>
        </div>

        <!-- Track PNL Toggle -->
        <div class="flex items-center gap-2 mb-6">
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="form.pnl_track" type="checkbox" class="sr-only peer" />
            <div
              class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300">
            </div>
            <div
              class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5">
            </div>
          </label>
          <span class="text-sm text-gray-600">Track PNL</span>
        </div>
      </div>
    </transition>

    <MasterOrderEdit :isOpen="showEditSidebar" @close="showEditSidebar = false" />
  </div>
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

.input {
  @apply w-full px-3 py-1 border border-gray-300 rounded outline-none;
}
</style>
