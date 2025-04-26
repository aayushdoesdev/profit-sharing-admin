<script setup>
import { ref } from "vue";
import Tooltip from "@/components/Tooltip.vue";
import { usePositionStore } from "@/stores/positions";
import { storeToRefs } from "pinia";

// Position store with grouped + flattened strategy logic
const positionStore = usePositionStore();
const { flatStrategySummary } = storeToRefs(positionStore);

// Helper to format dates
function formatDate(inputDate) {
  const date = new Date(inputDate);
  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}
</script>

<template>
  <main class="bg-white py-2">
    <div class="flex items-center justify-between px-4">
      <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text">
        <i class="pi pi-search opacity-50"></i>
        <input
          type="text"
          class="bg-transparent py-2 outline-none"
          placeholder="Search for user"
        />
      </div>
    </div>

    <div class="mt-4 overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
          >
            <th class="min-w-[50px] w-[5%] font-medium">S.NO</th>
            <th class="min-w-[150px] w-[10%] font-medium">Date</th>
            <th class="min-w-[200px] w-[15%] font-medium">User Name</th>
            <th class="min-w-[150px] w-[15%] font-medium">Strategy Name</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">Total Profit</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">Sharing Ratio</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">Admin Share</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">User Share</th>
            <th class="min-w-[200px] text-right w-[10%] font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in flatStrategySummary"
            :key="item.id"
            class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium"
          >
            <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
            <td class="min-w-[150px] w-[10%]">{{ formatDate(item.created_at) }}</td>
            <td class="min-w-[200px] w-[15%]">{{ item.name }}</td>
            <td class="min-w-[150px] w-[15%]">{{ item.strategy }}</td>
            <td class="min-w-[100px] text-custom-green text-right w-[10%]">₹{{ item.totalProfit }}</td>
            <td class="min-w-[100px] text-right w-[10%]">{{ item.admin_share_ratio }} : {{ 100 - item.admin_share_ratio }}</td>
            <td class="min-w-[100px] text-right w-[10%]">₹{{ item.adminShare }}</td>
            <td class="min-w-[100px] text-right w-[10%]">₹{{ item.userShare }}</td>
            <td class="min-w-[200px] flex justify-end w-[10%] px-4">
              <Tooltip text="Download">
                <button class="pi pi-download text-[20px]"></button>
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
