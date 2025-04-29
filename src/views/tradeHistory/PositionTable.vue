<script setup>
import { usePositionHistoryStore } from "@/stores/positionHistory";
import { storeToRefs } from "pinia";
import Tooltip from "@/components/Tooltip.vue";

const positionHistoryStore = usePositionHistoryStore();
const { positionsHistory } = storeToRefs(positionHistoryStore);

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

const computedProfit = (pos) => {
  const buy = parseFloat(pos.buy_price) || 0;
  const sell = parseFloat(pos.sell_price) || 0;
  const qty = pos.sell_quantity || pos.buy_quantity || 0;
  return (sell - buy) * qty;
};
</script>

<template>
  <div class="h-[80vh]">
    <div class="flex items-center justify-between px-4">
      <div
        class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text"
      >
        <i class="pi pi-search opacity-50"></i>
        <input
          type="text"
          class="bg-transparent py-2 outline-none"
          placeholder="Search for user"
        />
      </div>
    </div>

    <div class="mt-4 overflow-auto h-[calc(80vh-50px)]">
      <table class="w-full">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
          >
            <th class="min-w-[50px] w-[5%] text-left font-medium">S.NO</th>
            <th class="min-w-[160px] w-[15%] text-left font-medium">Strategy/Symbol</th>
            <th class="min-w-[160px] w-[15%] text-left font-medium">Side/Price</th>
            <th class="min-w-[120px] w-[10%] text-left font-medium">User/Broker</th>
            <th class="min-w-[100px] w-[5%] text-left font-medium">Product</th>
            <th class="min-w-[70px] w-[5%] text-left font-medium">QTY</th>
            <th class="min-w-[100px] w-[5%] text-left font-medium">Exchange</th>
            <th class="min-w-[100px] w-[5%] text-left font-medium">Status</th>
            <th class="min-w-[80px] w-[5%] text-left font-medium">PNL</th>
            <th class="min-w-[120px] w-[10%] text-right font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(pos, index) in positionsHistory"
            :key="pos.tradeId"
            class="flex items-center justify-between text-left w-full px-4 py-3 transition-all nrml-text tracking-wider border-b border-black border-opacity-10"
          >
            <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
            <td class="min-w-[160px] w-[15%] font-medium">
              <p>{{ pos.strategy_name }}</p>
              <p>{{ pos.strategy_script }}</p>
            </td>
            <td class="min-w-[160px] w-[15%]">
              <div class="flex items-center gap-2 mb-1">
                <p class="px-1 rounded font-bold bg-green-100 text-green-600">
                  B
                </p>
                <p class="font-medium">
                  {{ pos.buy_price }}
                  <span class="text-[10px] text-custom-dark-grey">{{
                    pos.side.toLowerCase() == "buy"
                      ? formatDateTime(pos.created_at)
                      : formatDateTime(pos.updated_at)
                  }}</span>
                </p>
              </div>
              <div class="flex items-center gap-2 mb-1">
                <p class="px-1 rounded font-bold bg-red-100 text-red-600">S</p>
                <p class="font-medium">
                  {{ pos.sell_price }}
                  <span class="text-[10px] text-custom-dark-grey">{{
                    pos.side.toLowerCase() == "sell"
                      ? formatDateTime(pos.created_at)
                      : formatDateTime(pos.updated_at)
                  }}</span>
                </p>
              </div>
            </td>
            <td class="min-w-[120px] w-[10%]">
              <p class="font-medium">{{ pos.user_name }}</p>
              <p class="font-medium">{{ pos.broker_name }}</p>
            </td>
            <td class="min-w-[100px] w-[5%]">
              <p class="font-medium">{{ pos.product }}</p>
            </td>
            <td class="min-w-[70px] w-[5%]">
              <p class="font-medium">
                {{
                  pos.side.toLowerCase() == "sell"
                    ? `${pos.buy_quantity} / ${pos.sell_quantity}`
                    : `${pos.sell_quantity} / ${pos.buy_quantity}`
                }}
              </p>
            </td>
            <td class="min-w-[100px] w-[5%]">
              <p class="font-medium">{{ pos.exchange }}</p>
            </td>
            <td class="min-w-[100px] w-[5%]">
              <p
                class="font-medium p-1 rounded-lg w-fit"
                :class="{
                  'bg-custom-green/5 text-custom-green':
                    pos.status.toLowerCase() === 'open',
                  'bg-custom-red/5 text-custom-red':
                    pos.status.toLowerCase() === 'closed',
                }"
              >
                {{ pos.status }}
              </p>
            </td>
            <td class="min-w-[80px] w-[5%]">
              <p
                :class="[
                  'font-bold',
                  computedProfit(pos) > 0 ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{ computedProfit(pos).toFixed(2) }}
              </p>
            </td>
            <td
              class="min-w-[120px] w-[10%] flex justify-end items-center gap-2"
            >
              <Tooltip text="View">
                <button class="pi pi-eye text-[16px]"></button>
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
