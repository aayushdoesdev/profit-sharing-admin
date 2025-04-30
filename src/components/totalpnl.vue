<template>
  <!-- Working  -->
  <div class="font-bold">
    <span
      :class="totalProfit?.totalPnl < 0 ? 'text-custom-red' : totalProfit?.totalPnl > 0 ? 'text-custom-green' : ''">{{
        totalProfit?.totalPnl > 0 ? '+' : '' }}{{ totalProfit?.totalPnl }} ({{ totalProfit?.totalPnlPercentage || 0
      }}%)</span>
  </div>
</template>

<script setup>
import { usePositionStore } from '@/stores/positions';
import { useProfileStore } from '@/stores/profile';
import { useTickerStore } from '@/stores/ticker/ticker';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const tickerStore = useTickerStore();
const positionsStore = usePositionStore()


function getLtp(position) {
  let ltp = tickerStore.getLastPrice(position.instrument_token)
  return ltp || position.last_price
}

const totalProfit = computed(() => {
  let tp = 0, totalInvestment = 0
  if (positionsStore.positions.length > 0) {
    positionsStore.positions.forEach((position) => {
      let pnl = 0;
      let ltp = getLtp(position);
      let first_price = 0;
      if (position.status === "CLOSED") {
        if (position.sell_price && position.buy_price) {
          pnl = position.sell_price * position.quantity - position.buy_price * position.quantity;
          first_price = position.buy_price;
        }
      } else if (position.status === "OPEN") {
        if (position.side === 'BUY') {
          if (position.buy_price && ltp) {
            pnl = (ltp - position.buy_price) * position.quantity;
            first_price = position.buy_price;
          }
        } else if (position.side === 'SELL') {

          if (position.sell_price && ltp) {
            pnl = (position.sell_price - ltp) * position.quantity;
            first_price = ltp;
          }
        }
      }
      tp += pnl;
      totalInvestment += (first_price * position.quantity);
    });
  }

  let totalPnlPercentage = totalInvestment > 0 ? (tp / totalInvestment) * 100 : 0;
  return {
    totalPnl: tp.toFixed(2), // Total PnL
    totalPnlPercentage: totalPnlPercentage.toFixed(2) // Total PnL %
  };
});


</script>