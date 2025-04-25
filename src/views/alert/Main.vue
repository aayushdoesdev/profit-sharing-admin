<script setup>
import { ref } from "vue";
import Tooltip from "@/components/Tooltip.vue";
import { useAlertsStore } from "@/stores/alerts";
import { storeToRefs } from "pinia";

const alertStore = useAlertsStore()

const {alerts} = storeToRefs(alertStore)

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
    <div class="mt-4 overflow-x-auto h-[calc(100vh-100px)]">
      <table class="w-full">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
          >
            <th class="min-w-[50px] w-[5%] font-medium">S.NO</th>
            <th class="min-w-[200px] w-[15%] font-medium">Alert ID</th>
            <th class="min-w-[200px] w-[15%] font-medium">Strategies</th>
            <th class="min-w-[200px] w-[20%] font-medium">Data</th>
            <th class="min-w-[150px] text-right w-[10%] font-medium">Created At</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(alert, index) in alerts"
            :key="alert.alertId"
            class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium"
          >
            <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
            <td class="min-w-[200px] w-[15%]">{{ alert.data }}</td>
            <td class="min-w-[200px] w-[15%]">{{ alert.strategy_name }}</td>
            <td class="min-w-[200px] flex items-center gap-2 w-[20%]">
              <p>{{ alert.data }}</p>
              <Tooltip text="copy"><button class="pi pi-copy text-[20px]"></button></Tooltip>
            </td>
            <td class="min-w-[150px] flex justify-end w-[10%]">{{ formatDate(alert.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
