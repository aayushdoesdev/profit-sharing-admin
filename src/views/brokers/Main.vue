<script setup>
import Tooltip from "@/components/Tooltip.vue";

const payouts = [
  {
    broker: "Alice",
    user: "sameer",
    tokenDate: "2025-03-07 14:49:16",
    disable: false,
    active: true,
    connect: "Connect",
  },
  {
    broker: "Angel",
    user: "Vishwas Tripathi",
    tokenDate: "2025-04-23 10:20:35",
    disable: false,
    active: false,
    connect: "Connected",
  },
  {
    broker: "Alice",
    user: "Krishnakumari R",
    tokenDate: "2025-03-03 12:13:47",
    disable: true,
    active: true,
    connect: "Connect",
  },
  {
    broker: "Angel",
    user: "Shiva sankar",
    tokenDate: "2025-04-21 09:41:36",
    disable: false,
    active: false,
    connect: "Connect",
  },
  {
    broker: "Zerodha",
    user: "Shiva sankar",
    tokenDate: "2000-01-01 00:00:00",
    disable: false,
    active: false,
    connect: "Connect",
  },
  {
    broker: "Dhan",
    user: "Vicky Rameshcha",
    tokenDate: "2025-03-05 10:04:34",
    disable: true,
    active: false,
    connect: "Connect",
  },
  {
    broker: "Angel",
    user: "Khushi gupta",
    tokenDate: "2025-03-06 09:30:06",
    disable: false,
    active: false,
    connect: "Connect",
  },
  {
    broker: "Angel",
    user: "Aleem shaikh",
    tokenDate: "2025-02-01 08:21:54",
    disable: false,
    active: false,
    connect: "Connect",
  },
  {
    broker: "Angel",
    user: "Ganesh bahadur Chhetri",
    tokenDate: "2025-03-21 14:19:56",
    disable: false,
    active: false,
    connect: "Connect",
  },
  {
    broker: "Angel",
    user: "sandeep reddy",
    tokenDate: "2025-04-23 10:33:49",
    disable: false,
    active: false,
    connect: "Connect",
  },
  {
    broker: "Dhan",
    user: "Samyak Gaikwad",
    tokenDate: "2025-04-23 10:03:31",
    disable: false,
    active: false,
    connect: "Connected",
  },
];
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

    <div class="mt-2 overflow-auto">
      <table class="w-full">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
          >
            <th class="min-w-[100px] w-[10%] font-medium">Broker ID</th>
            <th class="min-w-[150px] w-[10%] font-medium">Broker</th>
            <th class="min-w-[200px] w-[15%] font-medium">User</th>
            <th class="min-w-[100px] w-[15%] font-medium">Token Date</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">
              Disable
            </th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">Active</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">
              Connect
            </th>
            <th class="min-w-[200px] text-right w-[10%] font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(payout, index) in payouts"
            :key="index"
            class="flex items-center justify-between text-left w-full px-4 py-3 transition-all tracking-wider border-b border-black border-opacity-10 font-medium nrml-text"
          >
            <td class="min-w-[100px] w-[10%]">{{ index + 1 }}</td>
            <td class="min-w-[150px] w-[10%]">{{ payout.broker }}</td>
            <td class="min-w-[200px] w-[15%]">{{ payout.user }}</td>
            <td class="min-w-[100px] w-[15%]">{{ payout.tokenDate }}</td>
            <td class="min-w-[100px] text-right w-[10%]">
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
            <td class="min-w-[100px] text-right w-[10%]">
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
              <template v-if="payout.connect === 'Connected'">
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
                  @click="handleConnect(payout)"
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
