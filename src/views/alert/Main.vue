<script setup>
import { ref, computed } from "vue";
import Tooltip from "@/components/Tooltip.vue";
import { useAlertsStore } from "@/stores/alerts";
import { storeToRefs } from "pinia";
import { useToastStore } from '@/stores/toast';

const alertStore = useAlertsStore()
const {alerts} = storeToRefs(alertStore)

const toastStore = useToastStore();
const searchQuery = ref('');

function formatDate(inputDate) {
  const date = new Date(inputDate);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const filteredAlerts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return alerts.value;

  return alerts.value.filter(alert =>
  alert.strategy_name.toLowerCase().includes(query)
  );
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      toastStore.addToast("Success" , "Copied to clipboard", "success", 3000);
    })
    .catch((err) => {
      toastStore.addToast("Error" , "Failed to copy", "error", 3000);
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
          v-model="searchQuery"
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
            <th class="min-w-[200px] w-[15%] font-medium">Strategies</th>
            <th class="min-w-[200px] w-[20%] font-medium">Data</th>
            <th class="min-w-[200px] w-[15%] font-medium">Status</th>
            <th class="min-w-[150px] text-right w-[10%] font-medium">Created At</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(alert, index) in filteredAlerts"
            :key="alert.alertId"
            class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium"
          >
            <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
            <td class="min-w-[200px] w-[15%]">{{ alert.strategy_name }}</td>
            <td class="min-w-[200px] flex items-center gap-2 w-[20%]">
              <p>{{ alert.data }}</p>
              <Tooltip text="copy"><button  @click="copyToClipboard(alert.data)" class="pi pi-copy text-[20px]"></button></Tooltip>
            </td>
            <td class="min-w-[200px] w-[15%]">{{ alert.status }}</td>
            <td class="min-w-[150px] flex justify-end w-[10%]">{{ formatDate(alert.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
