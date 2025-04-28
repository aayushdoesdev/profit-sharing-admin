<script setup>
import { ref, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { usePositionStore } from "@/stores/positions";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";

const route = useRoute();
const positionStore = usePositionStore();

const { groupedUserPositions } = storeToRefs(positionStore);

// ⚡ Get user positions based on route ID
const userPositions = computed(() => {
  return groupedUserPositions.value[route.params.id] || null;
});

const currentDate = ref(dayjs());

// 🔥 New function: Convert userPositions.positions to the required format
const generateFormattedData = (positions) => {
  const result = {};

  if (!positions || positions.length === 0) return result;

  positions.forEach((position) => {
    const {
      created_at,
      side,
      status,
      buy_price = 0,
      sell_price = 0,
      last_price = 0,
      buy_quantity = 0,
      sell_quantity = 0,
      admin_share_ratio = 0,
    } = position;

    const dateKey = dayjs(created_at).format("YYYY-MM-DD");

    let profitAmount = 0;

    if (status === "OPEN") {
      if (side === "BUY") {
        profitAmount = (last_price - buy_price) * buy_quantity;
      } else if (side === "SELL") {
        profitAmount = (sell_price - last_price) * sell_quantity;
      } else {
        console.warn(`Unknown side: ${side} in OPEN position`);
      }
    } else if (status === "CLOSED") {
      if (side === "BUY") {
        profitAmount = (sell_price - buy_price) * sell_quantity;
      } else if (side === "SELL") {
        profitAmount = (sell_price - buy_price) * buy_quantity;
      } else {
        console.warn(`Unknown side: ${side} in CLOSED position`);
      }
    } else {
      console.warn(`Unknown status: ${status} in position`);
    }

    const ratio = `${100 - admin_share_ratio}:${admin_share_ratio}`;

    if (!result[dateKey]) {
      result[dateKey] = {
        profit: profitAmount >= 0,
        amount: profitAmount,
        ratio: ratio,
      };
    } else {
      result[dateKey].amount += profitAmount;
      result[dateKey].profit = result[dateKey].amount >= 0;
    }
  });

  return result;
};



// 🆕 Ref: Stores formatted data in the same format as formattedData
const formattedData = ref({});

// Watch for changes in user positions and generate the formatted data
watchEffect(() => {
  formattedData.value = generateFormattedData(userPositions.value?.positions || []);
});

const daysInMonth = computed(() => {
  const start = currentDate.value.startOf("month");
  const end = currentDate.value.endOf("month");
  const startWeekDay = start.day();
  const days = [];

  for (let i = 0; i < startWeekDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= end.date(); day++) {
    days.push(day);
  }

  return days;
});

const monthYear = computed(() => currentDate.value.format("MMMM YYYY"));

const getDateKey = (day) => {
  return currentDate.value.date(day).format("YYYY-MM-DD");
};

const prevMonth = () => {
  currentDate.value = currentDate.value.subtract(1, "month");
};

const nextMonth = () => {
  currentDate.value = currentDate.value.add(1, "month");
};

const calculateShares = (amount, ratio) => {
  const [userRatio, adminRatio] = ratio.split(":").map(Number);
  const total = Math.abs(amount);
  const userShare = (total * userRatio) / 100;
  const adminShare = (total * adminRatio) / 100;
  return { userShare, adminShare };
};

// 🆕 Computed: Use formattedData for current month data
const filteredMonthData = computed(() => {
  return Object.entries(formattedData.value)
    .filter(([date]) => dayjs(date).isSame(currentDate.value, "month"))
    .sort(([a], [b]) => dayjs(a).diff(dayjs(b)));
});
</script>


<template>
  <!-- {{ formattedData }} -->
    <!-- {{ userPositions?.positions[0] }} -->
  <main class="bg-white py-4 h-full overflow-y-auto">
    <div class="px-4">
      <div
        class="flex items-center gap-4 nrml-text mb-4 whitespace-nowrap"
      >
        <button
          @click="prevMonth"
          class="pi pi-angle-left border px-1 py-1 rounded-full"
        ></button>
        <h2 class="text-lg font-bold">{{ monthYear }}</h2>
        <button
          @click="nextMonth"
          class="pi pi-angle-right border px-1 py-1 rounded-full"
        ></button>
        <div class="flex items-center gap-2 ml-auto">
          <p>Profit</p>
          <div
            class="w-[20px] h-[20px] border border-green-500 bg-green-100 rounded"
          ></div>
        </div>
        <div class="flex items-center gap-2">
          <p>Loss</p>
          <div
            class="w-[20px] h-[20px] border border-red-500 bg-red-100 rounded"
          ></div>
        </div>
      </div>

      <div
        class="grid grid-cols-7 text-center nrml-text text-sm overflow-y-auto"
      >
        <div class="font-semibold mb-2">Mon</div>
        <div class="font-semibold">Tue</div>
        <div class="font-semibold">Wed</div>
        <div class="font-semibold">Thu</div>
        <div class="font-semibold">Fri</div>
        <div class="font-semibold">Sat</div>
        <div class="font-semibold">Sun</div>

        <template v-for="(day, index) in daysInMonth" :key="index">
          <div
            v-if="day === null"
            class="border min-h-[97px] max-h-[97px] bg-gray-50 rounded"
          ></div>
          <div
            v-else
            class="border min-h-[97px] max-h-[97px] p-1 text-left rounded relative px-2"
            :class="{
              'bg-green-100 border-green-500':
                formattedData[getDateKey(day)]?.profit === true,
              'bg-red-100 border-red-500':
                formattedData[getDateKey(day)]?.profit === false,
            }"
          >
            <div class="flex justify-between items-center font-bold">
              <span>{{ day }}</span>
              <template v-if="formattedData[getDateKey(day)]">
                <span
                  :class="{
                    'text-custom-green': formattedData[getDateKey(day)].amount > 0,
                    'text-custom-red': formattedData[getDateKey(day)].amount < 0,
                  }"
                  class="hidden md:block text-xs font-semibold"
                >
                  ₹{{ formattedData[getDateKey(day)].amount }}
                </span>
              </template>
            </div>

            <template v-if="formattedData[getDateKey(day)]">
              <div
                class="hidden xl:block text-[12px] mt-2 leading-tight font-medium space-y-1"
              >
                <div class="flex items-center justify-between">
                  <p>Share ratio</p>
                  <p>{{ formattedData[getDateKey(day)].ratio }}</p>
                </div>
                <div class="flex items-center justify-between">
                  <p>User share</p>
                  <p>
                    {{ formattedData[getDateKey(day)].profit ? "+" : "-" }}₹{{
                      calculateShares(
                        formattedData[getDateKey(day)].amount,
                        formattedData[getDateKey(day)].ratio
                      ).userShare.toFixed(0)
                    }}
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <p>Admin share</p>
                  <p>
                    {{ formattedData[getDateKey(day)].profit ? "+" : "-" }}₹{{
                      calculateShares(
                        formattedData[getDateKey(day)].amount,
                        formattedData[getDateKey(day)].ratio
                      ).adminShare.toFixed(0)
                    }}
                  </p>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>

      <div class="xl:hidden mt-4">
        <p>More details</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div
            v-for="([date, info], index) in filteredMonthData"
            :key="index"
            :class="[
              'p-2 rounded nrml-text space-y-2 mt-2',
              info.profit
                ? 'border border-green-500 bg-green-100'
                : 'border border-red-500 bg-red-100',
            ]"
          >
            <div class="flex items-center justify-between">
              <p>{{ dayjs(date).format("D MMM YYYY") }}</p>
              <p
                :class="
                  info.amount > 0 ? 'text-custom-green' : 'text-custom-red'
                "
              >
                {{ info.profit ? "Profit" : "Loss" }} - ₹{{ info.amount }}
              </p>
            </div>

            <div class="flex items-center justify-between">
              <p>
                Admin Share
                <span
                  :class="
                    info.amount > 0 ? 'text-custom-green' : 'text-custom-red'
                  "
                >
                  ₹{{
                    calculateShares(info.amount, info.ratio).adminShare.toFixed(
                      0
                    )
                  }}
                </span>
              </p>
              <p>
                User Share
                <span
                  :class="
                    info.amount > 0 ? 'text-custom-green' : 'text-custom-red'
                  "
                >
                  ₹{{
                    calculateShares(info.amount, info.ratio).userShare.toFixed(
                      0
                    )
                  }}
                </span>
              </p>
              <p>Share ratio {{ info.ratio }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
