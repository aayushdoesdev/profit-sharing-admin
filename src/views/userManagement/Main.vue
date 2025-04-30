<script setup>
import { ref, computed } from "vue";
import { useRouter, RouterLink } from "vue-router";
import Popup from "@/components/Popup.vue";
import Tooltip from "@/components/Tooltip.vue";
import { useUserStore } from "@/stores/users";
import { usePositionStore } from "@/stores/positions";
import { storeToRefs } from "pinia";
import { useBrokerStore } from "@/stores/brokers";

const userStore = useUserStore();
const { users, idtoEdit } = storeToRefs(userStore);

const positionStore = usePositionStore()
const { userTotalProfits } = storeToRefs(positionStore)

const brokerStore = useBrokerStore();


const searchQuery = ref('');
const showSidebar = ref(false);
const currentStep = ref(1); // 1 = Add User, 2 = Add Broker

const isDeletePopup = ref(false);

const toggleDeletePopup = (button) => {
  isDeletePopup.value = button;
};

// Combine users and their profits
const usersWithProfits = computed(() => {
  return users.value.map(user => {
    // Find matching profit data
    const profitData = Object.values(userTotalProfits.value).find(
      profit => profit.user_id === user.id // Assuming user.id matches user_id
    );

    return {
      ...user,
      totalUserProfit: profitData ? profitData.totalUserProfit : "0.00",
    };
  });
});

const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return usersWithProfits.value;

  return usersWithProfits.value.filter(user =>
    user.name.toLowerCase().includes(query)
  );
});

// New form data structure matching the payload
const userData = ref({
  name: "",
  email: "",
  mobile: "",
  dob: "",
  pan_number: "",
  is_disabled: false,
  message: "",
  password: ""
});

const brokerData = ref({
  broker_userid: "",
  broker_password: "",
  broker_qr_key: "",
  broker_api: "",
  broker_api_secret: "",
  broker_name: "",
  token_status: "valid",
  broker_token: "",
  broker_token_date: "",
  is_active: true,
  is_autologin: false,
  is_disabled: false,
  is_editable: true,
  message: ""
});

const addEditUser = async () => {
  
  try {
    await userStore.addEditUser({ user: userData.value, broker: brokerData.value });
    showSidebar.value = false;
    userData.value = {
      name: "",
      email: "",
      mobile: "",
      dob: "",
      pan_number: "",
      is_disabled: false,
      message: "",
      password: ""
    };
    brokerData.value = {
      broker_userid: "",
      broker_password: "",
      broker_qr_key: "",
      broker_api: "",
      broker_api_secret: "",
      broker_name: "",
      token_status: "valid",
      broker_token: "",
      broker_token_date: "",
      is_active: true,
      is_autologin: false,
      is_disabled: false,
      is_editable: true,
      message: ""
    };
  } catch (error) {
    conosle.log(error)
  }
}

const openEditModal = async (user) => {
  showSidebar.value = true;
  currentStep.value = 1;
  idtoEdit.value = user.id;

  const brokerDetails = await brokerStore.getBrokerByUserId(user.id);
  userData.value = {
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    dob: user.dob,
    pan_number: user.pan_number,
    is_disabled: user.is_disabled,
    message: user.message,
    
  };

  brokerData.value = {
    broker_userid: brokerDetails.broker_userid,
    broker_password: brokerDetails.broker_password,
    broker_qr_key: brokerDetails.broker_qr_key,
    broker_api: brokerDetails.broker_api,
    broker_api_secret: brokerDetails.broker_api_secret,
    broker_name: brokerDetails.broker_name,
    token_status: brokerDetails.token_status,
    broker_token: brokerDetails.broker_token,
    broker_token_date: brokerDetails.broker_token_date,
    is_active: brokerDetails.is_active,
    is_autologin: brokerDetails.is_autologin,
    is_disabled: brokerDetails.is_disabled,
    is_editable: brokerDetails.is_editable,
    message: brokerDetails.message
  };
  
}

const closeModal = () => {
  showSidebar.value = false;
  currentStep.value = 1;
  userData.value = {
    name: "",
    email: "",
    mobile: "",
    dob: "",
    pan_number: "",
    is_disabled: false,
    message: "",
    password: ""
  };
  brokerData.value = {
    broker_userid: "",
    broker_password: "",
    broker_qr_key: "",
    broker_api: "",
    broker_api_secret: "",
    broker_name: "",
    token_status: "valid",
    broker_token: "",
    broker_token_date: "",
    is_active: true,
    is_autologin: false,
    is_disabled: false,
    is_editable: true,
    message: ""
  };
}

const handleConnect = async (user) => {
  const brokerDetails = await brokerStore.getBrokerByUserId(user.id);
  if (brokerDetails) {
    // Assuming you have a method to connect the broker
    await brokerStore.connectBroker(brokerDetails.id);
  } else {
    console.error("Broker details not found for user:", user.id);
  }
};
</script>

<template>
  <main class="bg-white py-4">
    <!-- Top bar -->
    <div class="flex items-center justify-between px-4 nrml-text">
      <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md">
        <i class="pi pi-search opacity-50"></i>
        <input type="text" v-model="searchQuery" class="bg-transparent py-2 outline-none" placeholder="Search for user" />
      </div>

      <div>
        <button @click="showSidebar = true" class="flex items-center gap-2 btn">
          <p>Add new user</p>
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="mt-4 overflow-x-auto h-[80vh]">

      <table class="w-full">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-3 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey whitespace-nowrap">
            <th class="min-w-[50px] w-[5%] font-medium">S.NO</th>
            <th class="min-w-[200px] w-[20%] font-medium">User Name / Referral ID</th>
            <th class="min-w-[100px] w-[10%] font-medium">Broker</th>
            <th class="min-w-[250px] w-[20%] font-medium">Profit Sharing</th>
            <th class="min-w-[100px] w-[10%] font-medium">Profit</th>
            <th class="min-w-[150px] w-[10%] font-medium">Status</th>
            <th class="min-w-[100px] w-[10%] font-medium">Connect</th>
            <th class="min-w-[100px] text-right w-[15%] font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(user, index) in filteredUsers" :key="user.id"
            class="flex items-center justify-between text-left w-full px-4 py-2 transition-all nrml-text tracking-wider border-b border-black border-opacity-10">
            <td class="min-w-[50px] w-[5%]">
              {{ String(index + 1).padStart(2, "0") }}
            </td>
            <td class="min-w-[200px] flex flex-col items-start w-[20%]">
              <p class="font-medium">{{ user.name }}</p>
              <p class="font-medium">{{ user.refere_by ? user.refere_by : '- -' }}</p>
            </td>

            <td class="min-w-[100px] font-medium w-[10%]">{{ user.broker_name }}</td>
            <td class="min-w-[250px] flex flex-col gap-2 font-medium w-[20%]">
              <p>{{ user.admin_share_ration }} : {{ 100 - user.admin_share_ration }} <span>({{ 100 -
                user.admin_share_ration }} - User & {{ user.admin_share_ration }} - Admin)</span></p>
            </td>
            <td class="min-w-[100px] font-medium w-[10%]">{{ user.totalUserProfit }}</td>
            <td class="min-w-[150px] w-[10%]">
              <p :class="[
                'font-semibold px-2 py-[2px] rounded w-fit capitalize',
                user.is_disabled
                  ? 'bg-green-100 text-custom-green'
                  : 'bg-[#1C1D221F] text-custom-dark-grey',
              ]">
                {{ user.is_disabled }}
              </p>
            </td>
            <td class="min-w-[100px] w-[10%]">
              <template v-if="user.broker_status && user.broker_status.toLowerCase() === 'connected'">
                <div class="text-green-600 flex gap-1 items-center font-semibold">
                  <i class="pi pi-check-circle"></i>
                  <p>Connected</p>
                </div>
              </template>
              <template v-else>
                <button class="text-blue-600 hover:text-blue-800 transition-colors flex gap-1"
                  @click="handleConnect(user)">
                  <i class="pi pi-link text-[18px]"></i>
                  <p>Connect</p>
                </button>
              </template>
            </td>
            <td class="min-w-[100px] w-[15%] flex justify-end items-center gap-4">
              <Tooltip text="Calender">
                <router-link :to="`/calender/${user.id}`" class="pi pi-calendar text-[20px]"></router-link>
              </Tooltip>
              <Tooltip text="Edit">
                <button @click="openEditModal(user)" class="pi pi-pen-to-square text-custom-blue text-[20px]"></button>
              </Tooltip>
              <Tooltip text="View">
                <button class="pi pi-eye text-[18px]"></button>
              </Tooltip>
              <Tooltip text="Delete">
                <button @click="toggleDeletePopup(true)" class="pi pi-trash text-custom-red text-[20px]"></button>
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sidebar Overlay -->
    <transition name="slide">
      <div v-if="showSidebar"
        class="fixed right-0 top-0 h-full w-full max-w-[600px] bg-[#F3F2F7] shadow-lg z-50 p-6 overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            {{ currentStep === 1 ? "Add User" : "Add Broker" }}
          </h2>
          <div class="flex gap-4">
            <button @click="closeModal"
              class="text-[16px] border border-custom-blue text-custom-blue px-4 py-1 rounded">
              Cancel
            </button>
            <button @click="currentStep = currentStep === 1 ? 2 : 1"
              class="text-[16px] bg-custom-blue text-white font-semibold px-4 py-1 rounded">
              {{ currentStep === 1 ? "Next" : "Back" }}
            </button>
          </div>
        </div>

        <!-- Step Indicator -->
        <div class="flex w-full text-sm font-medium gap-2">
          <!-- Step 1 -->
          <div class="relative flex items-center px-4 py-3 rounded-l-md w-full first-step" :class="currentStep >= 1
              ? 'bg-blue-100 text-custom-blue'
              : 'bg-white text-gray-400 border'
            ">
            <div class="flex items-center gap-2">
              <div :class="[
                'w-6 h-6 flex items-center justify-center rounded-full text-xs',
                currentStep >= 1
                  ? 'bg-custom-blue text-white'
                  : 'border border-gray-400 text-gray-400',
              ]">
                ✓
              </div>
              <span>Add user</span>
            </div>
            <!-- Right Arrow -->
            <div class="absolute right-0 top-0 h-full w-4 bg-inherit clip-right-arrow"></div>
          </div>

          <!-- Step 2 -->
          <div class="relative flex items-center px-8 py-3 rounded-r-md w-full second-step" :class="currentStep === 2
              ? 'bg-blue-100 text-custom-blue'
              : 'bg-white text-gray-400 '
            ">
            <div class="flex items-center gap-2">
              <div :class="[
                'w-6 h-6 flex items-center justify-center rounded-full text-xs',
                currentStep === 2
                  ? 'bg-custom-blue text-white'
                  : 'border border-gray-400 text-gray-400',
              ]">
                ✓
              </div>
              <span>Add Broker</span>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="nrml-text mt-4">
          <!-- Step 1: Add User Form -->
          <template v-if="currentStep === 1">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="opacity-70">Username</label>
                <input type="text" v-model="userData.name" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Mobile</label>
                <input type="text" v-model="userData.mobile" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Email</label>
                <input type="email" v-model="userData.email" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Password</label>
                <input type="password" v-model="userData.password" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">PAN Number</label>
                <input type="text" v-model="userData.pan_number" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">DOB</label>
                <input type="date" v-model="userData.dob" class="custom-input" />
              </div>
              <div class="flex flex-col">
                <label class="opacity-70 mb-2">Disabled</label>
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="userData.is_disabled" class="sr-only peer">
                  <div
                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-blue">
                  </div>
                </label>
              </div>
              <div>
                <label class="opacity-70">Message</label>
                <input type="text" v-model="userData.message" class="custom-input" />
              </div>
            </div>
          </template>

          <!-- Step 2: Add Broker Form -->
          <template v-else>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="opacity-70">Broker Name</label>
                <input type="text" v-model="brokerData.broker_name" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Broker User ID</label>
                <input type="text" v-model="brokerData.broker_userid" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Broker Password</label>
                <input type="password" v-model="brokerData.broker_password" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Broker QR Key</label>
                <input type="password" v-model="brokerData.broker_qr_key" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Broker API</label>
                <input type="text" v-model="brokerData.broker_api" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Broker API Secret</label>
                <input type="password" v-model="brokerData.broker_api_secret" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Broker Token</label>
                <input type="text" v-model="brokerData.broker_token" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Token Status</label>
                <input type="text" v-model="brokerData.token_status" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Token Date</label>
                <input type="date" v-model="brokerData.broker_token_date" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Message</label>
                <input type="text" v-model="brokerData.message" class="custom-input" />
              </div>

              <!-- Toggle switches section -->
              <div class="col-span-2 grid grid-cols-2 gap-4 mt-2">
                <div class="flex flex-col">
                  <label class="opacity-70 mb-2">Active</label>
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="brokerData.is_active" class="sr-only peer">
                    <div
                      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-blue">
                    </div>
                  </label>
                </div>
                <div class="flex flex-col">
                  <label class="opacity-70 mb-2">Auto Login</label>
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="brokerData.is_autologin" class="sr-only peer">
                    <div
                      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-blue">
                    </div>
                  </label>
                </div>
                <div class="flex flex-col">
                  <label class="opacity-70 mb-2">Disabled</label>
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="brokerData.is_disabled" class="sr-only peer">
                    <div
                      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-blue">
                    </div>
                  </label>
                </div>
                <div class="flex flex-col">
                  <label class="opacity-70 mb-2">Editable</label>
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="brokerData.is_editable" class="sr-only peer">
                    <div
                      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-blue">
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Submit Button -->
        <div v-if="currentStep == 2" class="mt-6">
          <button @click="addEditUser" class="w-full bg-custom-blue text-white py-2 rounded-md font-medium">
            Save
          </button>
        </div>
      </div>
    </transition>

    <Popup :isOpen="isDeletePopup" @close="toggleDeletePopup(false)">
      <img src="/svg/delete-img.svg" alt="" class="w-[350px] mx-auto" />

      <div class="flex flex-col items-center justify-center text-center gap-4 w-full mt-4">
        <div class="">
          <h2 class="heading-text">Are you sure you want to delete?</h2>
          <p class="nrml-text">
            Once confirmed, this action cannot be reversed
          </p>
        </div>

        <div class="flex items-center gap-2 w-full">
          <button @click="toggleDeletePopup(false)"
            class="w-full border border-custom-blue text-custom-blue py-1 rounded-full">
            Cancel
          </button>
          <button class="w-full bg-custom-red text-white py-1 rounded-full">
            Delete
          </button>
        </div>
      </div>
    </Popup>
  </main>
</template>

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

.first-step {
  clip-path: polygon(90% 0%, 100% 50%, 90% 100%, 0% 100%, 0 52%, 0% 0%);
}

.second-step {
  clip-path: polygon(100% 0, 100% 50%, 100% 100%, 0% 100%, 10% 50%, 0% 0%);
}

.custom-input {
  @apply w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}
</style>