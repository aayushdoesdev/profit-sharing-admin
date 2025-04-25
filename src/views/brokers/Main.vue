<script setup>
import Tooltip from "@/components/Tooltip.vue";
import { useBrokerStore } from "@/stores/brokers";
import { storeToRefs } from "pinia";

const brokerStore = useBrokerStore();
const { brokers } = storeToRefs(brokerStore);

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
  const year = date.getUTCFullYear();

  return `${formattedHours}:${formattedMinutes}${ampm}/${day.toString().padStart(2, '0')} ${month} ${year}`;
}

const isTokenValid = (date) => {
  const currentDate = new Date();
  const tokenDate = new Date(date);
  return tokenDate === currentDate;
}

const handleConnect = async (brokerId) => {
  const res = await brokerStore.connectBroker(brokerId);
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
    <div class="mt-2 overflow-auto h-[80vh]">
      <table class="w-full">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
          >
            <th class="min-w-[150px] w-[10%] font-medium">Broker ID</th>
            <th class="min-w-[150px] w-[10%] font-medium">Broker</th>
            <th class="min-w-[100px] w-[10%] font-medium">User</th>
            <th class="min-w-[150px] w-[15%]  font-medium">Token Date</th>
            <th class="min-w-[50px] text-center  w-[5%] font-medium">
              Disable
            </th>
            <th class="min-w-[50px] text-center w-[5%] font-medium">Active</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">
              Connect
            </th>
            <th class="min-w-[200px] text-right w-[10%] font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(broker, index) in brokers"
            :key="index"
            class="flex items-center justify-between text-left w-full px-4 py-3 transition-all tracking-wider border-b border-black border-opacity-10 font-medium nrml-text"
          >
            
            <td class="min-w-[150px] w-[10%]">{{ broker.broker_userid }}</td>
            <td class="min-w-[150px] w-[10%]">{{ broker.broker_name }}</td>
            <td class="min-w-[100px] w-[10%]">{{ broker.user_name }}</td>
            <td class="min-w-[150px] w-[15%] ">{{ formatDateTime(broker.broker_token_date) }}</td>
            <td class="min-w-[50px] text-center w-[5%]">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" />
                <div
                  class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"
                ></div>
                <div
                  class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"
                ></div>
              </label>
            </td>
            <td class="min-w-[50px] text-center w-[5%]">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" />
                <div
                  class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"
                ></div>
                <div
                  class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"
                ></div>
              </label>
            </td>
            <td class="min-w-[100px] text-right w-[10%] flex justify-end">
              <template v-if="isTokenValid(broker.broker_token_date)">
                <div
                  class="text-green-600 flex gap-1 items-center font-semibold"
                >
                  <i class="pi pi-check-circle"></i>
                  <p>Connected</p>
                </div>
              </template>
              <template v-else>
                <button
                  class="text-blue-600 hover:text-blue-800 transition-colors flex gap-1"
                  @click="handleConnect(broker.id)"
                >
                  <i class="pi pi-link text-[18px]"></i>
                  <p>Connect</p>
                </button>
              </template>
            </td>
            <td
              class="min-w-[200px] flex gap-2 justify-end w-[10%] space-x-2 relative"
            >
              <Tooltip text="Edit">
                <button class="pi pi-pencil text-[18px]"></button>
              </Tooltip>

              <Tooltip text="Order/Positions">
                <button class="pi pi-briefcase text-[18px]"></button>
              </Tooltip>

              <Tooltip text="Holdings">
                <button class="pi pi-book text-[18px]"></button>
              </Tooltip>

              <Tooltip text="View">
                <button class="pi pi-eye text-[18px]"></button>
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
.tooltip-text {
  position: fixed;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
