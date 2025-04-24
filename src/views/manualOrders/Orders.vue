<template>
    <div class="h-[80vh] overflow-auto">
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

        
    </div>
</template>

<script setup>
import Tooltip from '@/components/Tooltip.vue';
import { ref } from 'vue';


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

