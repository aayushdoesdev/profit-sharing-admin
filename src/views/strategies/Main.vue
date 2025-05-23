<script setup>
import { ref, computed } from "vue";
import Popup from "@/components/Popup.vue";
import Tooltip from "@/components/Tooltip.vue";
import { useStrategiesStore } from "@/stores/strategies";
import { useJoinerStore } from "@/stores/joiners";
import { storeToRefs } from "pinia";
import OrderSidebar from "./OrderSidebar.vue";
import { useOrderStore } from "@/stores/orders";
import JoinerEdit from "./JoinerEdit.vue";

const strategiesStore = useStrategiesStore();
const joinerStore = useJoinerStore();
const orderStore = useOrderStore();

const { strategies } = storeToRefs(strategiesStore);
const { joinersByStrategyId  , joinerToEdit} = storeToRefs(joinerStore);
const { strategyOrders } = storeToRefs(orderStore);

const showSidebar = ref(false);
const showJoinerSidebar = ref(false);
const isEditMode = ref(false);
const editingStrategyId = ref(null);
const deletingStrategyId = ref(null);
const deletingJoinerId = ref(null);
const showOrderModal = ref(false);
const searchQuery = ref('');


const isDeletePopupOpen = ref(false);
const isDeleteJoinerPopupOpen = ref(false)
const showJoinerEditModal = ref(false);

const openEditModal = (joiner) => {
  joinerToEdit.value = joiner;
  showJoinerEditModal.value = true;
}

const filteredStrategies = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return strategies.value;

  return strategies.value.filter(strategy =>
    strategy.name.toLowerCase().includes(query)
  );
});


const form = ref({
  name: "",
  strategy_type: "",
  trailing_active: false,
  exchange: "",
  side: "",
  atm_otm: 0,
  script: "",
  risk: "",
  stop_loss: 0,
  target: 0,
  is_active: false,
  is_locked: false,
  message: "",
  expiry_date: "",
  image_url: "",
  capital_required: "",
});

const resetForm = () => {
  form.value = {
    name: "",
    strategy_type: "",
    expiry_date: "",
    exchange: "",
    side: "",
    image_url: "",
    script: "",
    capital_required: "",
    risk: "",
    message: "",
    stop_loss: "",
    target: "",
    atm_otm: "",
    trailing_active: false,
    is_active: false,
    is_locked: false,
  };
  isEditMode.value = false;
  editingStrategyId.value = null;
};

const openJoinerSidebar = async (strategy) => {
  showJoinerSidebar.value = true;

  try {
    await joinerStore.getJoinersByStrategy(strategy.id);
  } catch (error) {
    console.error(error);
  }
};

const openOrderSidebar = async (strategy) => {
  showOrderModal.value = true;

  try {
    await orderStore.getOrderByStrategyId(strategy.id);
  } catch (error) {
    console.error(error);
  }
};

const openEditSidebar = (strategy) => {
  isEditMode.value = true;
  editingStrategyId.value = strategy.id;
  showSidebar.value = true;

  // Populate form
  form.value = {
    name: strategy.name,
    strategy_type: strategy.strategy_type,
    trailing_active: strategy.trailing_active === "yes",
    exchange: strategy.exchange,
    side: strategy.side,
    atm_otm: strategy.atm_otm,
    script: strategy.script,
    risk: strategy.risk,
    stop_loss: strategy.stop_loss,
    target: strategy.target,
    is_active: strategy.is_active,
    is_locked: strategy.is_locked,
    message: strategy.message,
    expiry_date: strategy.expiry_date,
    image_url: strategy.image_url,
    capital_required: strategy.capital_required,
  };
};

const createStrategy = async () => {
  try {
    const payload = {
      ...form.value,
      trailing_active: form.value.trailing_active ? "yes" : "no", // Convert to API format
    };
    await strategiesStore.createStrategy(payload);
    showSidebar.value = false;
  } catch (error) {
    console.error("Failed to create strategy", error);
  }
};

const editStrategy = async () => {
  if (!editingStrategyId.value) return;

  try {
    await strategiesStore.updateStrategy(editingStrategyId.value, {
      ...form.value,
      trailing_active: form.value.trailing_active ? "yes" : "no",
    });

    showSidebar.value = false;
    resetForm();
  } catch (error) {
    console.error("Edit failed", error);
  }
};

const openDeleteJoinerPopup = (strategy) => {
  isDeleteJoinerPopupOpen.value = true;
  deletingJoinerId.value = strategy.id;
};

const deleteJoiner = async () => {
  if (!deletingJoinerId.value) return;

  try {
    await joinerStore.deleteJoinerById(deletingJoinerId.value)
    isDeleteJoinerPopupOpen.value = false;
  } catch (error) {
    console.error("Deleting Joiner failed", error);
  }
};

const openDeletePopup = (strategy) => {
  isDeletePopupOpen.value = true;
  deletingStrategyId.value = strategy.id;
};

const deleteStrategy = async () => {
  if (!deletingStrategyId.value) return;

  try {
    await strategiesStore.deleteStrategy(deletingStrategyId.value);
    isDeletePopupOpen.value = false;
  } catch (error) {
    console.error("Deleting failed", error);
  }
};

const handleActive = async (id ,value) => {
  await strategiesStore.updateStrategy(id, {
    is_active: value
  });
};

const handleJoinerActive = async (joiner) => {
  joinerToEdit.value = joiner
  await joinerStore.editJoiner({
    is_active: !joiner.is_active
  });
};
</script>

<template>
  <main class="bg-white py-2 overflow-y-auto">
    <JoinerEdit :isOpen="showJoinerEditModal" @close="showJoinerEditModal = false"/>
    <div class="flex items-center justify-between px-4 nrml-text">
      <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md">
        <i class="pi pi-search opacity-50"></i>
        <input
          type="text"
          v-model="searchQuery"
          class="bg-transparent py-2 outline-none"
          placeholder="Search for strategy"
        />
      </div>

      <div>
        <button @click="showSidebar = true" class="flex items-center gap-2 btn">
          <p>Add Strategy</p>
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>

    <div class="mt-4 h-[calc(100vh-100px)] overflow-y-auto">
      <table class="w-full">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
          >
            <th class="min-w-[50px] w-[5%] font-medium">S.NO</th>
            <th class="min-w-[150px] w-[10%] font-medium">Name</th>
            <th class="min-w-[100px] w-[10%] font-medium">Type</th>
            <th class="min-w-[120px] w-[10%] font-medium">Expiry</th>
            <th class="min-w-[100px] w-[10%] font-medium">Entry / Exit</th>
            <th class="min-w-[100px] w-[10%] font-medium">LTP</th>
            <th class="min-w-[120px] w-[10%] font-medium">Position Status</th>
            <th class="min-w-[100px] w-[10%] font-medium">Active</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(strategy, index) in filteredStrategies"
            :key="strategy.id"
            class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium"
          >
            <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
            <td class="min-w-[150px] w-[10%]">
              <p>{{ strategy.name }}</p>
              <p>{{ strategy.script }}</p>
            </td>
            <td class="min-w-[100px] w-[10%]">{{ strategy.strategy_type }}</td>
            <td class="min-w-[100px] w-[10%]">{{ strategy.expiry_date }}</td>
            <td class="min-w-[100px] w-[10%]">
              <p>₹ {{ strategy.entry_price }}</p>
              <p>₹{{ strategy.exit }}</p>
            </td>
            <td class="min-w-[100px] w-[10%]">₹{{ strategy.ltp }}</td>
            <td class="min-w-[120px] w-[10%]">
              <span
                class="px-3 py-1 rounded-full bg-green-100 text-green-600"
                >{{ strategy.status }}</span
              >
            </td>
            <td class="min-w-[100px] w-[10%]">
              <label class="relative inline-flex items-center cursor-pointer">
                <input @click="handleActive(strategy.id ,!strategy.is_active)" v-model="strategy.is_active" type="checkbox" class="sr-only peer" />
                <div
                  class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"
                ></div>
                <div
                  class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"
                ></div>
              </label>
            </td>
            <td class="min-w-[100px] flex w-[10%] gap-4">
              <Tooltip text="Edit">
                <button
                  class="pi pi-pencil text-[18px]"
                  @click="openEditSidebar(strategy)"
                ></button>
              </Tooltip>

              <Tooltip text="Joiner">
                <button
                  @click="openJoinerSidebar(strategy)"
                  class="pi pi-pencil text-[18px]"
                ></button>
              </Tooltip>

              <Tooltip text="Order">
                <button @click="openOrderSidebar(strategy)" class="pi pi-briefcase text-[18px]"></button>
              </Tooltip>

              <Tooltip text="Delete">
                <button
                  class="pi pi-trash text-[18px]"
                  @click="openDeletePopup(strategy)"
                ></button>
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>

      <transition name="slide">
        <div
          v-if="showSidebar"
          class="fixed right-0 top-0 h-full w-[400px] md:w-[600px] bg-white shadow-lg z-40 p-6"
        >
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Add Strategy</h2>
            <div class="flex gap-4">
              <button
                @click="showSidebar = false"
                class="text-[16px] border border-custom-blue text-custom-blue px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                @click="isEditMode ? editStrategy() : createStrategy()"
                class="text-[16px] bg-custom-blue text-white font-semibold px-4 py-1 rounded"
              >
                {{ isEditMode ? "Update" : "Create" }}
              </button>
            </div>
          </div>

          <!-- Form -->
          <div class="nrml-text space-y-4 mt-4">
            <!-- Step 1: Add User Form -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="opacity-70">Strategy name</label>
                <input type="text" class="custom-input" v-model="form.name" />
              </div>
              <div>
                <label class="opacity-70">Strategy Type</label>
                <input
                  type="text"
                  class="custom-input"
                  v-model="form.strategy_type"
                />
              </div>
              <div>
                <label class="opacity-70">Expiry Date</label>
                <input
                  type="text"
                  class="custom-input"
                  v-model="form.expiry_date"
                />
              </div>
              <div>
                <label class="opacity-70">Exchange</label>
                <input
                  type="text"
                  class="custom-input"
                  v-model="form.exchange"
                />
              </div>
              <div>
                <label class="opacity-70">Side</label>
                <input type="text" class="custom-input" v-model="form.side" />
              </div>
              <div>
                <label class="opacity-70">Image Icon</label>
                <input
                  type="text"
                  class="custom-input"
                  v-model="form.image_url"
                />
              </div>
              <div>
                <label class="opacity-70">Script</label>
                <input type="text" class="custom-input" v-model="form.script" />
              </div>
              <div>
                <label class="opacity-70">Capital Required</label>
                <input
                  type="text"
                  class="custom-input"
                  v-model="form.capital_required"
                />
              </div>
              <div>
                <label class="opacity-70">Risk</label>
                <input type="text" class="custom-input" v-model="form.risk" />
              </div>
              <div>
                <label class="opacity-70">Message</label>
                <input
                  type="text"
                  class="custom-input"
                  v-model="form.message"
                />
              </div>
              <div>
                <label class="opacity-70">Stop Loss</label>
                <input
                  type="text"
                  class="custom-input"
                  v-model="form.stop_loss"
                />
              </div>
              <div>
                <label class="opacity-70">Target</label>
                <input type="text" class="custom-input" v-model="form.target" />
              </div>
              <div>
                <label class="opacity-70">ATM / OTM</label>
                <input
                  type="text"
                  class="custom-input"
                  v-model="form.atm_otm"
                />
              </div>
              <div class="flex flex-col items-start gap-1">
                <p class="opacity-70">Traling Active</p>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="sr-only peer"
                    v-model="form.trailing_active"
                  />
                  <div
                    class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"
                  ></div>
                  <div
                    class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"
                  ></div>
                </label>
              </div>
              <div class="flex flex-col items-start gap-1">
                <p class="opacity-70">Is Active</p>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="sr-only peer"
                    v-model="form.is_active"
                  />
                  <div
                    class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"
                  ></div>
                  <div
                    class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"
                  ></div>
                </label>
              </div>
              <div class="flex flex-col items-start gap-1">
                <p class="opacity-70">Is Locked</p>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="sr-only peer"
                    v-model="form.is_locked"
                  />
                  <div
                    class="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300"
                  ></div>
                  <div
                    class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"
                  ></div>
                </label>
              </div>
            </div>

            <!-- <button class="bg-custom-blue text-white px-4 py-2 rounded-md">
              Save
            </button> -->
          </div>
        </div>
      </transition>

      <transition name="slide">
        <div
          v-if="showJoinerSidebar"
          class="fixed right-0 top-0 h-full w-[400px] md:w-[800px] bg-white shadow-lg z-40 py-4"
        >
          <div class="flex justify-between items-center mb-4 px-4">
            <h2 class="text-xl font-bold">Edit Joiners</h2>
            <div class="flex gap-4">
              <button
                @click="showJoinerSidebar = false"
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
                <th class="min-w-[150px] w-[15%]">Broker</th>
                <th class="min-w-[100px] w-[15%]">User</th>
                <th class="min-w-[100px] w-[10%]">Lot Size</th>
                <th class="min-w-[100px] w-[10%]">Re Entry</th>
                <th class="min-w-[100px] w-[15%]">Re Entry Triggered</th>
                <th class="min-w-[100px] w-[10%]">Active</th>
                <th class="min-w-[100px] w-[15%]">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
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
                      @click="handleJoinerActive(item)"
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
                      @click="openEditModal(item)"
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
              </tr>
            </tbody>
          </table>
        </div>
      </transition>

      <OrderSidebar :showOrderModal="showOrderModal" @close="showOrderModal = false"/>

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
              @click="deleteStrategy"
              class="w-full bg-custom-red text-white py-1 rounded-full"
            >
              Delete
            </button>
          </div>
        </div>
      </Popup>

      <Popup :isOpen="isDeleteJoinerPopupOpen" @close="openDeleteJoinerPopup(false)">
        <img src="/svg/delete-img.svg" alt="" class="w-[350px] mx-auto" />

        <div
          class="flex flex-col items-center justify-center text-center gap-4 w-full mt-4"
        >
          <div class="">
            <h2 class="heading-text">Are you sure you want to the joiner delete?</h2>
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
              @click="deleteJoiner"
              class="w-full bg-custom-red text-white py-1 rounded-full"
            >
              Delete
            </button>
          </div>
        </div>
      </Popup>
    </div>
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
</style>
