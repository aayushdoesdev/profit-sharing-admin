<template>
  <Transition name="slide">
    <div v-if="showOrderModal" class="fixed right-0 top-0 h-full w-full max-w-[800px] bg-white shadow-lg z-50 py-2">
      <div class="flex justify-between items-center mb-2 px-3">
        <h2 class="text-lg font-bold">Strategy Orders</h2>
        <div class="flex gap-2">
          <button @click="closeModal" class="text-sm border border-custom-blue text-custom-blue px-3 py-1 rounded">
            Cancel
          </button>
        </div>
      </div>

      <div class="w-full overflow-x-auto">
        <table class=" text-sm">
          <thead>
            <tr class="flex items-center justify-between w-full text-left px-3 py-2 text-xs font-bold tracking-wide bg-custom-grey text-custom-dark-grey">
              <th class="w-[5%] min-w-24 font-medium">#</th>
              <th class="w-[18%] min-w-24 font-medium">Strategy</th>
              <th class="w-[20%] min-w-24 font-medium">Side/Price</th>
              <th class="w-[18%] min-w-24 font-medium">Broker</th>
              <th class="w-[10%] min-w-24 font-medium">QTY</th>
              <th class="w-[12%] min-w-24 font-medium">Trigger</th>
              <th class="w-[8%] min-w-24 font-medium text-center">Status</th>
              <th class="w-[9%] min-w-24 font-medium text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(order, index) in strategyOrders" :key="index"
              class="flex items-center justify-between text-left w-full px-3 py-2 transition-all text-xs tracking-wider border-b border-black border-opacity-10  font-medium">
              <td class="w-[5%]">{{ index + 1 }}</td>
              <td class="w-[18%]">
                <p class="truncate">{{ order.strategy_name }}</p>
                <p class="truncate text-xs text-gray-500">{{ order.strategy_script }}</p>
              </td>
              <td class="w-[20%]">
                <div class="flex items-center gap-1">
                  <p :class="[
                    'px-1 rounded font-bold text-xs',
                    order.transaction_type.toLowerCase() === 'buy'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600',
                  ]">
                    {{ order.transaction_type.charAt(0).toUpperCase() }}
                  </p>
                  <div>
                    <p class="text-xs">{{ order.price }}</p>
                    <p class="text-xs text-gray-500">{{ formatDateTime(order.created_at) }}</p>
                  </div>
                </div>
              </td>
              <td class="w-[18%]">
                <p class="truncate">{{ order.broker_name }}</p>
                <p class="truncate text-xs text-gray-500">{{ order.broker_userid }}</p>
              </td>
              <td class="w-[10%]">
                <p>{{ order.quantity }}</p>
              </td>
              <td class="w-[12%]">
                {{ order.trigger_price }}
              </td>
              <td class="w-[8%] flex justify-center">
                <p :class="[
                  'px-2 py-1 rounded text-xs',
                  order.status.toLowerCase() === 'open'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-700',
                ]">
                  {{ order.status }}
                </p>
              </td>
              <td class="w-[9%] flex items-center justify-end gap-1">
                <Tooltip text="View">
                  <button class="pi pi-eye text-xs"></button>
                </Tooltip>
                <Tooltip v-if="order.status.toLowerCase() == 'pending'" text="Delete">
                  <button @click="showDeletePopup(true, order.id)" class="pi pi-trash text-red-500 text-xs"></button>
                </Tooltip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Transition>
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
          <button @click="handleDelete()" class="w-full bg-custom-red text-white py-1 rounded-full">
            Delete
          </button>
        </div>
      </div>
    </Popup>
</template>

<script setup>
import Popup from '@/components/Popup.vue';
import Tooltip from '@/components/Tooltip.vue';
import { useOrderStore } from '@/stores/orders'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const orderStore = useOrderStore();
const { strategyOrders , idToDelete } = storeToRefs(orderStore);

const emit = defineEmits(['close'])
const isDeletePopup = ref(false);


const showDeletePopup = (value , id) => {
  idToDelete.value = id;
  toggleDeletePopup(value);
} 
const toggleDeletePopup = (value) => {
  isDeletePopup.value = value;
}
const props = defineProps({
  showOrderModal: {
    type: Boolean,
    required: true
  },
})

const closeModal = () => {
  strategyOrders.value = []
  emit('close')
}

const handleDelete = async () => {
  await orderStore.deleteOrder();
  toggleDeletePopup(false);
}

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

  return `${formattedHours}:${formattedMinutes}${ampm}/${day.toString().padStart(2, '0')} ${month}`;
}
</script>

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