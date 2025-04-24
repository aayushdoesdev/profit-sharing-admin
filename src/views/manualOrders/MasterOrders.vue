<template>
    <div  class="">
        <div class="flex items-center justify-between px-4">

            <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text">
                <i class="pi pi-search opacity-50"></i>
                <input type="text" class="bg-transparent py-1 outline-none" placeholder="Search for user" />
            </div>

            <button @click="showSidebar = true"
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
        <!-- Sidebar Overlay -->
        <transition name="slide">
            <div v-if="showSidebar"
                class="fixed right-0 top-0 h-full w-[400px] md:w-[800px] bg-white shadow-lg z-50 p-6">
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
</template>

<script setup>
import Tooltip from '@/components/Tooltip.vue';
import { ref } from 'vue';



const showSidebar = ref(false);
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