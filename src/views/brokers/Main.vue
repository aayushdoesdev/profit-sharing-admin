<script setup>
import { ref, computed } from "vue";
import { useBrokerStore } from "@/stores/brokers";
import { storeToRefs } from "pinia";
import Popup from "@/components/Popup.vue";
import Tooltip from "@/components/Tooltip.vue";
import OrderModal from "./OrderPositionModal.vue";
import { useOrderStore } from "@/stores/orders";
import { usePositionStore } from "@/stores/positions";

const brokerStore = useBrokerStore();
const orderStore = useOrderStore();
const positionStore = usePositionStore();

const { brokers, idToEdit } = storeToRefs(brokerStore);

const showSidebar = ref(false);
const isDeletePopupOpen = ref(false);
const brokerDeletingId = ref(null);
const searchQuery = ref('');

const showHoldingSidebar = ref(false)
const showOrderPositionSidebar = ref(false)

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
  const year = date.getUTCFullYear();

  return `${formattedHours}:${formattedMinutes}${ampm}/${day
    .toString()
    .padStart(2, "0")} ${month} ${year}`;
}

const isTokenValid = (date) => {
  const currentDate = new Date();
  const tokenDate = new Date(date);
  return tokenDate === currentDate;
};

const handleConnect = async (brokerId) => {
  const res = await brokerStore.connectBroker(brokerId);
};

const handleActive = async (brokerId, value) => {
  idToEdit.value = brokerId;
  const res = await brokerStore.addEdit({ is_active: value });
};
const handleDisabled = async (brokerId, value) => {
  idToEdit.value = brokerId;
  const res = await brokerStore.addEdit({ is_active: value });
};

const filteredBrokers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return brokers.value;

  return brokers.value.filter(broker =>
  broker.broker_name.toLowerCase().includes(query)
  );
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
  message: "",
});

const openEditModal = async (broker) => {
  showSidebar.value = true;
  idToEdit.value = broker.user_id;

  const brokerDetails = await brokerStore.getBrokerByUserId(broker.user_id);
  // userData.value = {
  //   name: user.name,
  //   email: user.email,
  //   mobile: user.mobile,
  //   dob: user.dob,
  //   pan_number: user.pan_number,
  //   is_disabled: user.is_disabled,
  //   message: user.message,

  // };

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
    message: brokerDetails.message,
  };
};

const handleBrokerEdit = async () => {
  try {
    await brokerStore.addEdit({ broker: brokerData.value });
    showSidebar.value = false;

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
      message: "",
    };
  } catch (error) {
    console.error("Error in editing broker details", error);
  }
};

const toggleDeleteBrokerPopup = (broker) => {
  isDeletePopupOpen.value = true;
  brokerDeletingId.value = broker?.id;
};

const handleDeleteBroker = async () => {
  try {
    await brokerStore.deleteBroker(brokerDeletingId.value);
    isDeletePopupOpen.value = false;
  } catch (error) {
    console.error("Got Error when trying to delete broker", error);
  }
};

const openHoldingSidebar = (broker) => {
  showHoldingSidebar.value = true

  console.log(broker)
}


const openOrderPositionSidebar = (broker) => {
  orderStore.getOrderByBrokerId(broker.id);
  positionStore.getPositionByBrokerId(broker.id)
  showOrderPositionSidebar.value = true
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
          placeholder="Search for broker"
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
            <th class="min-w-[150px] w-[15%] font-medium">Token Date</th>
            <th class="min-w-[50px] text-center w-[5%] font-medium">Disable</th>
            <th class="min-w-[50px] text-center w-[5%] font-medium">Active</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">
              Connect
            </th>
            <th class="min-w-[200px] text-right w-[10%] font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(broker, index) in filteredBrokers"
            :key="index"
            class="flex items-center justify-between text-left w-full px-4 py-3 transition-all tracking-wider border-b border-black border-opacity-10 font-medium nrml-text"
          >
            <td class="min-w-[150px] w-[10%]">{{ broker.broker_userid }}</td>
            <td class="min-w-[150px] w-[10%]">{{ broker.broker_name }}</td>
            <td class="min-w-[100px] w-[10%]">{{ broker.user_name }}</td>
            <td class="min-w-[150px] w-[15%]">
              {{ formatDateTime(broker.broker_token_date) }}
            </td>
            <td class="min-w-[50px] text-center w-[5%]">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  @click="handleDisabled(broker.id, !broker.is_disabled)"
                  v-model="broker.is_disabled"
                  type="checkbox"
                  class="sr-only peer"
                />
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
                <input
                  @click="handleActive(broker.id, !broker.is_active)"
                  v-model="broker.is_active"
                  type="checkbox"
                  class="sr-only peer"
                />
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
                <button
                  @click="openEditModal(broker)"
                  class="pi pi-pencil text-[18px]"
                ></button>
              </Tooltip>

              <Tooltip text="Order/Positions">
                <button @click="openOrderPositionSidebar(broker)" class="pi pi-briefcase text-[18px]"></button>
              </Tooltip>

              <Tooltip text="Holdings">
                <button  @click="openHoldingSidebar(broker)" class="pi pi-book text-[18px]"></button>
              </Tooltip>

              <Tooltip text="Delete">
                <button
                  @click="toggleDeleteBrokerPopup(broker)"
                  class="pi pi-trash text-[18px]"
                ></button>
              </Tooltip>

              <Tooltip text="View">
                <button class="pi pi-eye text-[18px]"></button>
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form -->
    <transition name="slide">
      <div
        v-if="showSidebar"
        class="fixed right-0 top-0 h-full w-full max-w-[600px] bg-[#F3F2F7] shadow-lg z-50 p-6 overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Edit Broker</h2>
        </div>
        <div class="nrml-text mt-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="opacity-70">Broker Name</label>
              <input
                type="text"
                v-model="brokerData.broker_name"
                class="custom-input"
              />
            </div>
            <div>
              <label class="opacity-70">Broker User ID</label>
              <input
                type="text"
                v-model="brokerData.broker_userid"
                class="custom-input"
              />
            </div>
            <div>
              <label class="opacity-70">Broker Password</label>
              <input
                type="password"
                v-model="brokerData.broker_password"
                class="custom-input"
              />
            </div>
            <div>
              <label class="opacity-70">Broker QR Key</label>
              <input
                type="password"
                v-model="brokerData.broker_qr_key"
                class="custom-input"
              />
            </div>
            <div>
              <label class="opacity-70">Broker API</label>
              <input
                type="text"
                v-model="brokerData.broker_api"
                class="custom-input"
              />
            </div>
            <div>
              <label class="opacity-70">Broker API Secret</label>
              <input
                type="password"
                v-model="brokerData.broker_api_secret"
                class="custom-input"
              />
            </div>
            <div>
              <label class="opacity-70">Broker Token</label>
              <input
                type="text"
                v-model="brokerData.broker_token"
                class="custom-input"
              />
            </div>
            <div>
              <label class="opacity-70">Token Status</label>
              <input
                type="text"
                v-model="brokerData.token_status"
                class="custom-input"
              />
            </div>
            <div>
              <label class="opacity-70">Token Date</label>
              <input
                type="date"
                v-model="brokerData.broker_token_date"
                class="custom-input"
              />
            </div>
            <div>
              <label class="opacity-70">Message</label>
              <input
                type="text"
                v-model="brokerData.message"
                class="custom-input"
              />
            </div>

            <!-- Toggle switches section -->
            <div class="col-span-2 grid grid-cols-2 gap-4 mt-2">
              <div class="flex flex-col">
                <label class="opacity-70 mb-2">Active</label>
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="brokerData.is_active"
                    class="sr-only peer"
                  />
                  <div
                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-blue"
                  ></div>
                </label>
              </div>
              <div class="flex flex-col">
                <label class="opacity-70 mb-2">Auto Login</label>
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="brokerData.is_autologin"
                    class="sr-only peer"
                  />
                  <div
                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-blue"
                  ></div>
                </label>
              </div>
              <div class="flex flex-col">
                <label class="opacity-70 mb-2">Disabled</label>
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="brokerData.is_disabled"
                    class="sr-only peer"
                  />
                  <div
                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-blue"
                  ></div>
                </label>
              </div>
              <div class="flex flex-col">
                <label class="opacity-70 mb-2">Editable</label>
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="brokerData.is_editable"
                    class="sr-only peer"
                  />
                  <div
                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-blue"
                  ></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-6 flex items-center gap-4">
            <button
              @click="showSidebar = false"
              class="w-full bg-custom-blue text-white py-2 rounded-md font-medium"
            >
              Cancel
            </button>

            <button
              @click="handleBrokerEdit"
              class="w-full bg-custom-blue text-white py-2 rounded-md font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="slide">
      <div
        v-if="showHoldingSidebar"
        class="fixed right-0 top-0 h-full w-[400px] md:w-[800px] bg-white shadow-lg z-50 py-4"
      >
        <div class="flex justify-between items-center mb-4 px-4">
          <h2 class="text-xl font-bold">Holdings</h2>
          <div class="flex gap-4">
            <button
              @click="showHoldingSidebar = false"
              class="text-[16px] border border-custom-blue text-custom-blue px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>

        <table class="w-full">
          <thead>
            <tr
              class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
            >
              <th class="min-w-[150px] w-[15%]">Trading Symbol</th>
              <th class="min-w-[100px] w-[15%]">Product</th>
              <th class="min-w-[100px] w-[10%]">Quantity</th>
              <th class="min-w-[100px] w-[10%]">Average Price</th>
              <th class="min-w-[100px] w-[15%]">LTP</th>
              <th class="min-w-[100px] w-[10%]">PNL</th>
              <th class="min-w-[100px] w-[15%]">Action</th>
            </tr>
          </thead>

          <tbody>
            <!-- <tr
              v-for="(item, index) in joinersByStrategyId"
              :key="item.id"
              class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium"
            >
              <td class="min-w-[150px] w-[15%]">
                {{ item.broker_userid }}
              </td>
              <td class="min-w-[100px] w-[15%]">{{ item.user_name }}</td>
              <td class="min-w-[100px] w-[10%]">{{ item.lot }}</td>
              <td class="min-w-[100px] w-[10%]">{{ item.re_entry }}</td>
              <td class="min-w-[100px] w-[15%]">
                {{ item.re_entry_triggered }}
              </td>
              <td class="min-w-[100px] w-[10%]">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="item.is_active"
                    class="sr-only peer"
                  />
                  <div
                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-blue"
                  ></div>
                </label>
              </td>
              <td class="min-w-[100px] flex items-center gap-4 w-[15%]">
                <Tooltip text="Edit">
                  <button
                    @click="openEditModal(broker)"
                    class="pi pi-pencil text-[18px]"
                  ></button>
                </Tooltip>
                <Tooltip text="Delete">
                  <button
                    @click="openDeleteJoinerPopup(item)"
                    class="pi pi-trash text-[18px]"
                  ></button>
                </Tooltip>
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </transition>

    <!-- ! ORDERS AND POSITIONS -->
    <OrderModal :showOrderPositionSidebar="showOrderPositionSidebar" @close="showOrderPositionSidebar = false" />

    <Popup :isOpen="isDeletePopupOpen" @close="openDeletePopup(false)">
      <img src="/svg/delete-img.svg" alt="" class="w-[350px] mx-auto" />

      <div
        class="flex flex-col items-center justify-center text-center gap-4 w-full mt-4"
      >
        <div class="">
          <h2 class="heading-text">Are you sure you want to delete?</h2>
          <p class="nrml-text">
            Once confirmed, this action cannot be reversed
          </p>
        </div>

        <div class="flex items-center gap-2 w-full">
          <button
            @click="isDeletePopupOpen = false"
            class="w-full border border-custom-blue text-custom-blue py-1 rounded-full"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteBroker"
            class="w-full bg-custom-red text-white py-1 rounded-full"
          >
            Delete
          </button>
        </div>
      </div>
    </Popup>
  </main>
</template>

<style scoped>
.tooltip-text {
  position: fixed;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
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
</style>
