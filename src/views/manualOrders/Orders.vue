<template>
    <div class="h-[80vh] overflow-auto">
        <div class="flex items-center justify-between px-4">
            <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text">
                <i class="pi pi-search opacity-50"></i>
                <input type="text" class="bg-transparent py-1 outline-none" placeholder="Search for user" />

            </div>
        </div>
        <div class="mt-4 overflow-auto h-[calc(100vh-200px)]">
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
                    <tr v-for="(order, index) in orders" 
                        class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium">
                        <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
                        <td class="min-w-[180px] w-[15%] ">
                            <p>{{ order.strategy_name }}</p>
                            <p>{{ order.strategy_script }}</p>
                        </td>
                        <td class="min-w-[180px] w-[20%]">
                            <div class="flex items-center gap-2">
                                <p :class="[
                                    'px-1 rounded font-bold',
                                    order.transaction_type.toLowerCase() === 'buy'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-600',
                                ]">
                                    {{ order.transaction_type.charAt(0).toUpperCase() }}
                                </p>
                                <p>
                                    {{ order.price }}
                                    <span class="text-[10px]"> {{ formatDateTime(order.created_at) }} </span>
                                </p>
                            </div>
                        </td>
                        <td class="min-w-[150px] w-[15%]">
                            <p>{{ order.broker_name }}</p>
                            <p>{{ order.broker_userid }}</p>
                        </td>
                        <td class="min-w-[80px] w-[10%]">
                            <p>{{ order.quantity }}</p>
                        </td>
                        <td class="min-w-[100px] w-[10%]">
                            {{ order.trigger_price }}
                        </td>
                        <td class="min-w-[100px] w-[10%] flex justify-end text-[12px]">
                            <p :class="[
                                'px-4 py-[2px] rounded w-fit',
                                order.status.toLowerCase() === 'complete'
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
                            <Tooltip v-if="order.status.toLowerCase() != 'complete'" text="Delete">
                                <button  class="pi pi-trash text-red-500 text-[16px]"></button>
                            </Tooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        
    </div>
</template>

<script setup>
import Tooltip from '@/components/Tooltip.vue';
import { useOrderStore } from '@/stores/orders';
import { storeToRefs } from 'pinia';

const manualOrderStore = useOrderStore();
const { orders } = storeToRefs(manualOrderStore);

// const orders = ref([
//   {
//     strategy: "Hunter Matrix NFT",
//     script: "BTC/USD 54368OOCE",
//     side: { type: "B", price: 8329.89, time: "09:09AM/12 Mar" },
//     broker: "Dhan",
//     brokerId: "DHAN4368HDW9E",
//     qty: "0/25",
//     triggerPrice: 'Null',
//     ltp: '200',
//     profit: "5473",
//     status: "Successful",
//   },
//   {
//     strategy: "Intraday Swing",
//     script: "ETH/USD 84930XTDS",
//     side: { type: "S", price: 4230.45, time: "10:21AM/13 Mar" },
//     broker: "Zerodha",
//     brokerId: "ZERO8383JSK2",
//     qty: "15/15",
//     triggerPrice: 'Null',
//     ltp: '200',
//     profit: "5473",
//     status: "Pending",
//   },
// ]);

function formatDateTime(isoString) {
  const date = new Date(isoString);

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const formattedHours = ((hours + 11) % 12 + 1).toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  const day = date.getUTCDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getUTCMonth()];

  return `${formattedHours}:${formattedMinutes}${ampm}/${day.toString().padStart(2, '0')} ${month}`;
}

</script>

