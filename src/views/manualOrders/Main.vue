<script setup>
import { ref } from "vue";
import Popup from "@/components/Popup.vue";
import Tooltip from "@/components/Tooltip.vue";

const activeSection = ref("orders");
const showSidebar = ref(false);
const isPopupOpen = ref(false);

const toggleSections = (button) => {
  activeSection.value = button;
};

const togglePopup = (button) => {
  isPopupOpen.value = button;
};

const positions = ref([
  {
    tradeId: "FER527SJ2SJ2929",
    strategy: "Most profitable source",
    script: "BTC/USD 54368OOCE",
    trades: [
      { type: "B", price: 8329.89, time: "09:09AM/12 Mar" },
      { type: "S", price: 8329.89, time: "09:09AM/12 Mar" },
    ],
    broker: "Zerodha",
    profit: "+5473",
    user: 'Roshni Chandra',
    product: 'Intraday',
    qty: '25',
    exchange: 'NSE',
    status: 'open',
  },
  {
    script: "BTC/USD 54368OOCE",
    tradeId: "RTY83929JS2A838",
    strategy: "BankNifty Beast",
    trades: [
      { type: "B", price: 7400.12, time: "09:09AM/12 Mar" },
      { type: "S", price: 7650.5, time: "09:09AM/12 Mar" },
    ],
    broker: "Zerodha",
    profit: "+250.38",
    user: 'Roshni Chandra',
    product: 'Intraday',
    qty: '25',
    exchange: 'NSE',
    status: 'open',
  },
]);

const orders = ref([
  {
    strategy: "Hunter Matrix NFT",
    script: "BTC/USD 54368OOCE",
    side: { type: "B", price: 8329.89, time: "09:09AM/12 Mar" },
    broker: "Dhan",
    brokerId: "DHAN4368HDW9E",
    qty: "0/25",
    triggerPrice: 'Null',
    ltp: '200',
    profit: "5473",
    status: "Successful",
  },
  {
    strategy: "Intraday Swing",
    script: "ETH/USD 84930XTDS",
    side: { type: "S", price: 4230.45, time: "10:21AM/13 Mar" },
    broker: "Zerodha",
    brokerId: "ZERO8383JSK2",
    qty: "15/15",
    triggerPrice: 'Null',
    ltp: '200',
    profit: "5473",
    status: "Pending",
  },
]);
</script>

<template>
  <main class="bg-white py-4 min-h-[80%]">
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


    <div class="mt-4">
      <!-- !POSITIONS TABLE -->
      <div v-if="activeSection === 'positions'" class="">
        <div class="flex items-center justify-between px-4">
          <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text">
            <i class="pi pi-search opacity-50"></i>

            <input type="text" class="bg-transparent py-1 outline-none" placeholder="Search for user" />

          </div>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey">
                <th class="min-w-[50px] w-[5%] text-left">S.NO</th>
                <th class="min-w-[160px] w-[15%] text-left">Strategy/Symbol</th>
                <th class="min-w-[160px] w-[15%] text-left">Side/Price</th>
                <th class="min-w-[120px] w-[10%] text-left">User/Broker</th>
                <th class="min-w-[100px] w-[5%] text-left ">Product</th>
                <th class="min-w-[70px] w-[5%] text-left">QTY</th>
                <th class="min-w-[100px] w-[5%] text-left">Exchange</th>
                <th class="min-w-[100px] w-[5%] text-left">Status</th>
                <th class="min-w-[80px] w-[5%] text-left">PNL</th>
                <th class="min-w-[120px] w-[10%] text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(pos, index) in positions" :key="pos.tradeId"
                class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-white border-opacity-50">
                <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
                <td class="min-w-[160px] w-[15%] font-medium">
                  <p>{{ pos.strategy }}</p>
                  <p>{{ pos.script }}</p>
                </td>
                <td class="min-w-[160px] w-[15%]">
                  <div v-for="trade in pos.trades" :key="trade.type" class="flex items-center gap-2 mb-1">
                    <p :class="[
                      'px-1 rounded font-bold ',
                      trade.type === 'B'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600',
                    ]">
                      {{ trade.type }}
                    </p>
                    <p class="font-medium">{{ trade.price }} <span class="text-[10px] text-custom-dark-grey">{{ trade.time }}</span></p>
                  </div>
                </td>
                <td class="min-w-[120px] w-[10%]">
                  <p class="font-medium">{{ pos.user }}</p>
                  <p class="font-medium">{{ pos.broker }}</p>
                </td>
                <td class="min-w-[100px] w-[5%]">
                  <p class="font-medium">{{ pos.product }}</p>
                </td>
                <td class="min-w-[70px] w-[5%]">
                  <p class="font-medium">{{ pos.qty }}</p>
                </td>
                <td class="min-w-[100px] w-[5%]">
                  <p class="font-medium">{{ pos.exchange }}</p>
                </td>
                <td class="min-w-[100px] w-[5%]">
                  <p class="font-medium p-1 rounded-lg w-fit"
                    :class="{ 'bg-custom-green/5 text-custom-green': pos.status.toLowerCase() === 'open' }">
                    {{ pos.status }}
                  </p>
                </td>
                <td class="min-w-[80px] w-[5%] ">
                  <p class="text-green-600 font-bold">
                    {{ pos.profit }}
                  </p>
                </td>
                <td class="min-w-[120px] w-[10%] flex justify-end items-center gap-2 ">
                  <button @click="togglePopup(true)" class="sq-off-btn flex items-center gap-1">
                    <i class="pi pi-sync"></i>
                    <p>Sq Off</p>
                  </button>
                  <Tooltip text="View">
                    <button class="pi pi-eye text-[16px]"></button>
                  </Tooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- !ORDERS TABLE -->
      <div v-if="activeSection === 'orders'" class="">
        <div class="flex items-center justify-between px-4">
          <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text">
            <i class="pi pi-search opacity-50"></i>
            <input type="text" class="bg-transparent py-1 outline-none" placeholder="Search for user" />

          </div>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-[99%]">
            <thead>
              <tr
                class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey">
                <th class="min-w-[50px] w-[5%] font-medium">S.NO</th>
                <th class="min-w-[180px] w-[15%] font-medium">Strategy / Script</th>
                <th class="min-w-[180px] w-[20%] font-medium">Side / Price</th>
                <th class="min-w-[150px] w-[15%] font-medium">Broker / ID</th>
                <th class="min-w-[80px] w-[10%] font-medium">QTY</th>
                <th class="min-w-[100px] w-[10%] font-medium">Trigger Price</th>
                <th class="min-w-[100px] w-[10%] font-medium text-right">Status</th>
                <th class="min-w-[100px] w-[10%] font-medium text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(order, index) in orders" :key="order.script"
                class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium">
                <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
                <td class="min-w-[180px] w-[15%] ">
                  <p>{{ order.strategy }}</p>
                  <p>{{ order.script }}</p>
                </td>
                <td class="min-w-[180px] w-[20%]">
                  <div class="flex items-center gap-2">
                    <p :class="[
                      'px-1 rounded font-bold',
                      order.side.type === 'B'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600',
                    ]">
                      {{ order.side.type }}
                    </p>
                    <p>
                      {{ order.side.price }}
                      <span class="text-[10px]"> {{ order.side.time }} </span>
                    </p>
                  </div>
                </td>
                <td class="min-w-[150px] w-[15%]">
                  <p>{{ order.broker }}</p>
                  <p>{{ order.brokerId }}</p>
                </td>
                <td class="min-w-[80px] w-[10%]">
                  <p>{{ order.qty }}</p>
                </td>
                <td class="min-w-[100px] w-[10%]">
                  {{ order.triggerPrice }}
                </td>
                <td class="min-w-[100px] w-[10%] flex justify-end text-[12px]">
                  <p :class="[
                    'px-4 py-[2px] rounded w-fit',
                    order.status === 'Successful'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-700',
                  ]">
                    {{ order.status }}
                  </p>
                </td>
                <td class="min-w-[100px] w-[10%] flex items-center justify-end gap-2">
                  <Tooltip text="View">
                    <button class="pi pi-eye text-[16px]"></button>
                  </Tooltip>
                  <Tooltip text="Delete">
                    <button class="pi pi-trash text-red-500 text-[16px]"></button>
                  </Tooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sidebar Overlay -->
        <transition name="slide">
          <div v-if="showSidebar" class="fixed right-0 top-0 h-full w-[400px] md:w-[800px] bg-white shadow-lg z-50 p-6">
            <!-- Header -->
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">Add Manual Order</h2>
              <div class="flex gap-4">
                <button @click="showSidebar = false"
                  class="text-[16px] border border-custom-blue text-custom-blue px-4 py-1 rounded">
                  Cancel
                </button>
                <button @click="currentStep = currentStep === 1 ? 2 : 1"
                  class="text-[16px] bg-custom-blue text-white font-semibold px-4 py-1 rounded">
                  Done
                </button>
              </div>
            </div>

            <!-- Form -->
            <div class="nrml-text space-y-4 mt-4 overflow-y-auto">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label class="opacity-70">User Broker</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Matrix Strategy</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Trading Symbol</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">PAN Number</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Order varity</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Transaction Type</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Product Type</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Order Varity</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Validity</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Filled Quantity</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Pending Quantity</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Canceled Quantity</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Price</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Trigger Price</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Average Price</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Status</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Created Time</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Update Time</label>
                  <input type="text" class="custom-input" />
                </div>
                <div>
                  <label class="opacity-70">Status Message</label>
                  <input type="text" class="custom-input" />
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- ! MASTER ORDERS -->
      <div v-if="activeSection === 'master-orders'" class="">
        <div class="flex items-center justify-between px-4">

          <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text">
            <i class="pi pi-search opacity-50"></i>
            <input type="text" class="bg-transparent py-1 outline-none" placeholder="Search for user" />
          </div>

          <button v-if="activeSection === 'master-orders'" @click="showSidebar = true"
            class="btn flex items-center gap-2 nrml-text">

            <i class="pi pi-plus"></i>
            <p>Place Order</p>
          </button>
        </div>
        <div class="mt-4 overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey">
                <th class="w-[5%] text-left font-medium">S.NO</th>
                <th class="w-[15%] font-medium">Strategy / Script</th>
                <th class="w-[20%] font-medium">Side / Price</th>
                <th class="w-[15%] font-medium">QTY</th>
                <th class="w-[10%] font-medium">LTP</th>
                <th class="w-[10%] font-medium">Trigger Price</th>
                <th class="w-[10%] font-medium">Profit</th>
                <th class="w-[10%] font-medium">Status</th>
                <th class="w-[10%] text-right font-medium">Action</th>

              </tr>
            </thead>

            <tbody>

              <tr v-for="(order, index) in orders" :key="order.script"
                class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium">
                <td class="w-[5%] text-left">{{ index + 1 }}</td>
                <td class="w-[15%]">
                  <p>{{ order.strategy }}</p>
                  <p>{{ order.script }}</p>
                </td>
                <td class="w-[20%]">
                  <div class="flex items-center gap-2">
                    <p :class="[
                      'px-1 rounded font-bold',
                      order.side.type === 'B'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600',
                    ]">

                      {{ order.side.type }}
                    </p>
                    <p>
                      {{ order.side.price }}
                      <span class="text-[10px]"> {{ order.side.time }} </span>
                    </p>
                  </div>
                </td>

                <td class="w-[15%]">{{ order.qty }}</td>
                <td class="w-[10%]">{{ order.ltp }}</td>
                <td class="w-[10%]">{{ order.triggerPrice }}</td>
                <td class="w-[10%]"
                  :class="{ 'text-custom-green': order.profit >= 0, 'text-custom-red': order.profit < 0 }">{{
                    order.profit > 0 ? `+${order.profit}` : order.profit }}</td>
                <td class="w-[10%]">
                  <p :class="[
                    'px-4 py-[2px] rounded w-fit',
                    order.status === 'Successful'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-700',
                  ]">
                    {{ order.status }}
                  </p>
                </td>
                <td class="w-[10%] text-center flex justify-end items-center gap-4">
                  <Tooltip text="Edit">
                    <button class="pi pi-pen-to-square text-custom-blue text-[16px]"></button>
                  </Tooltip>
                  <Tooltip text="View">
                    <button class="pi pi-eye text-[16px]"></button>
                  </Tooltip>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Popup :isOpen="isPopupOpen" @close="togglePopup(false)">
        <img src="/svg/sq-off-img.svg" alt="" class="w-[200px] mx-auto" />

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
