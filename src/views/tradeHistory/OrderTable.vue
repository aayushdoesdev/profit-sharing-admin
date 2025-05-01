<script setup>
import { ref,computed } from "vue";
import { useOrderHistoryStore } from "@/stores/orderHistory";
import { storeToRefs } from "pinia";
import Tooltip from "@/components/Tooltip.vue";

const orderHistoryStore = useOrderHistoryStore();
const { ordersHistory } = storeToRefs(orderHistoryStore);

const searchQuery = ref('');

function formatDateTime(isoString) {
  const date = new Date(isoString);

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  const formattedHours = (((hours + 11) % 12) + 1).toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  const day = date.getUTCDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getUTCMonth()];

  return `${formattedHours}:${formattedMinutes}${ampm}/${day
    .toString()
    .padStart(2, "0")} ${month}`;
}

const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return ordersHistory.value;

  return ordersHistory.value.filter(order =>
  order.strategy_name.toLowerCase().includes(query)
  );
});
</script>

<template>
  <div class="flex items-center justify-between px-4">
    <div
      class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text"
    >
      <i class="pi pi-search opacity-50"></i>
      <input
        type="text"
        v-model="searchQuery"
        class="bg-transparent py-2 outline-none"
        placeholder="Search for strategy"
      />
    </div>
  </div>

  <div class="mt-4 overflow-auto h-[calc(80vh-50px)]">
    <table class="w-full">
      <thead>
        <tr
          class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
        >
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
        <tr
          v-for="(order, index) in filteredOrders"
          class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium"
        >
          <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
          <td class="min-w-[180px] w-[15%]">
            <p>{{ order.strategy_name }}</p>
            <p>{{ order.strategy_script }}</p>
          </td>
          <td class="min-w-[180px] w-[20%]">
            <div class="flex items-center gap-2">
              <p
                :class="[
                  'px-1 rounded font-bold',
                  order.transaction_type.toLowerCase() === 'buy'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600',
                ]"
              >
                {{ order.transaction_type.charAt(0).toUpperCase() }}
              </p>
              <p>
                {{ order.price }}
                <span class="text-[10px]">
                  {{ formatDateTime(order.created_at) }}
                </span>
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
            <p
              :class="[
                'px-4 py-[2px] rounded w-fit',
                order.status.toLowerCase() === 'open'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-700',
              ]"
            >
              {{ order.status }}
            </p>
          </td>
          <td class="min-w-[100px] w-[10%] flex items-center justify-end gap-2">
            <Tooltip text="View">
              <button class="pi pi-eye text-[16px]"></button>
            </Tooltip>
            <!-- <Tooltip text="Delete">
              <button class="pi pi-trash text-red-500 text-[16px]"></button>
            </Tooltip> -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
