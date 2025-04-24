<template>
    <div  class="h-[80vh] overflow-auto">
        <div class="flex items-center justify-between px-4">
            <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text">
                <i class="pi pi-search opacity-50"></i>

                <input type="text" class="bg-transparent py-1 outline-none" placeholder="Search for user" />

            </div>
        </div>
        <div class="mt-4 overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr
                        class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey">
                        <th class="min-w-[50px] w-[5%] text-left">S.NO</th>
                        <th class="min-w-[160px] w-[15%] text-left">Strategy/Symbol</th>
                        <th class="min-w-[160px] w-[15%] text-left">Side/Price</th>
                        <th class="min-w-[120px] w-[10%] text-left">User/Broker</th>
                        <th class="min-w-[100px] w-[5%] text-left ">Product</th>
                        <th class="min-w-[70px] w-[5%] text-left">QTY</th>
                        <th class="min-w-[100px] w-[5%] text-left">Exchange</th>
                        <th class="min-w-[100px] w-[5%] text-left">Status</th>
                        <th class="min-w-[80px] w-[5%] text-left">PNL</th>
                        <th class="min-w-[120px] w-[10%] text-right">Action</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(pos, index) in positions" :key="pos.tradeId"
                        class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-white border-opacity-50">
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
                                <p class="font-medium">{{ pos.buy_price }} <span
                                        class="text-[10px] text-custom-dark-grey">{{ pos.side.toLowerCase() == 'buy' ? formatDateTime(pos.created_at) : formatDateTime(pos.updated_at) }}</span></p>
                            </div>
                            <div class="flex items-center gap-2 mb-1">
                                <p class='px-1 rounded font-bold bg-red-100 text-red-600'>
                                    S
                                </p>
                                <p class="font-medium">{{ pos.sell_price }} <span
                                        class="text-[10px] text-custom-dark-grey">{{ pos.side.toLowerCase() == 'sell' ? formatDateTime(pos.created_at) : formatDateTime(pos.updated_at) }}</span></p>
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
                            <p class="font-medium">{{ pos.side.toLowerCase() == 'sell' ? `${pos.buy_quantity} / ${pos.sell_quantity}` :  `${pos.sell_quantity} / ${pos.buy_quantity}`}}</p>
                        </td>
                        <td class="min-w-[100px] w-[5%]">
                            <p class="font-medium">{{ pos.exchange }}</p>
                        </td>
                        <td class="min-w-[100px] w-[5%]">
                            <p class="font-medium p-1 rounded-lg w-fit"
                                :class="{ 'bg-custom-green/5 text-custom-green': pos.status.toLowerCase() === 'open' }">
                                {{ pos.status }}
                            </p>
                        </td>
                        <td class="min-w-[80px] w-[5%] ">
                            <p class="text-green-600 font-bold">
                                {{ pos.profit }}
                            </p>
                        </td>
                        <td class="min-w-[120px] w-[10%] flex justify-end items-center gap-2 ">
                            <button @click="togglePopup(true)" class="sq-off-btn flex items-center gap-1">
                                <i class="pi pi-sync"></i>
                                <p>Sq Off</p>
                            </button>
                            <Tooltip text="View">
                                <button class="pi pi-eye text-[16px]"></button>
                            </Tooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Popup :isOpen="isPopupOpen" @close="togglePopup(false)">
        <img src="/svg/sq-off-img.svg" alt="" class="w-[200px] mx-auto" />

        <div class="flex flex-col items-center justify-center text-center gap-4 w-full mt-4">
          <div class="">
            <h2 class="heading-text">Are you sure you want to square off?</h2>
            <p class="nrml-text">
              Once confirmed, this action cannot be reversed
            </p>
          </div>

          <div class="flex items-center gap-2 w-full">
            <button @click="togglePopup(false)"
              class="w-full border border-custom-blue text-custom-blue py-1 rounded-full">
              Cancel
            </button>
            <button class="w-full bg-custom-blue text-white py-1 rounded-full">
              Sq Off
            </button>
          </div>
        </div>
      </Popup>
    </div>
</template>

<script setup>
import Popup from '@/components/Popup.vue';
import { usePositionStore } from '@/stores/positions';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const positionStore = usePositionStore();
const { positions } = storeToRefs(positionStore);

const isPopupOpen = ref(false);

const togglePopup = (button) => {
  isPopupOpen.value = button;
};

const positions1 = ref([
    {
        tradeId: "FER527SJ2SJ2929",
        strategy: "Most profitable source",
        script: "BTC/USD 54368OOCE",
        trades: [
            { type: "B", price: 8329.89, time: "09:09AM/12 Mar" },
            { type: "S", price: 8329.89, time: "09:09AM/12 Mar" },
        ],
        broker: "Zerodha",
        profit: "+5473",
        user: 'Roshni Chandra',
        product: 'Intraday',
        qty: '25',
        exchange: 'NSE',
        status: 'open',
    },
    {
        script: "BTC/USD 54368OOCE",
        tradeId: "RTY83929JS2A838",
        strategy: "BankNifty Beast",
        trades: [
            { type: "B", price: 7400.12, time: "09:09AM/12 Mar" },
            { type: "S", price: 7650.5, time: "09:09AM/12 Mar" },
        ],
        broker: "Zerodha",
        profit: "+250.38",
        user: 'Roshni Chandra',
        product: 'Intraday',
        qty: '25',
        exchange: 'NSE',
        status: 'open',
    },
]);

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

<style lang="scss" scoped></style>