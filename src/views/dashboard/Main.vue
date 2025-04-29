<script setup>
import { usePositionStore } from '@/stores/positions';
import { useStrategiesStore } from '@/stores/strategies';
import { useJoinerStore } from '@/stores/joiners';
import Positions from './position/Positions.vue';
import { storeToRefs } from 'pinia';


const positionStore = usePositionStore()
const {positions} = storeToRefs(positionStore)

const strategiesStore = useStrategiesStore()
const joinerStore = useJoinerStore()

const {strategiesCount} = storeToRefs(strategiesStore)
const {joinerCount} = storeToRefs(joinerStore)


</script>

<template>
  <main class="font-geist">
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-4 py-2 gap-2">
      <div class="bg-white p-4 space-y-4 rounded-md">
        <div class="flex items-center justify-between">
          <p class="nrml-text">Overall Profit</p>
          <img src="/svg/dash1.svg" class="h-[30px] w-[30px]"></img>
        </div>
        <hr class="border border-dashed" />
        <div class=" flex items-center justify-between">
          <p class="heading-text">
            1658 <span class="small-text">active</span>
          </p>
          <p class="nrml-text">
            <i class="pi pi-arrow-up text-[12px]"></i>
            1.5%
          </p>
        </div>
      </div>

      <div class="bg-white p-4 space-y-4 rounded-md">
        <div class="flex items-center justify-between">
          <p class="nrml-text">Avg profit</p>
          <img src="/svg/dash2.svg" class="h-[30px] w-[30px]"></img>
        </div>
        <hr class="border border-dashed" />
        <div class="flex items-center justify-between">
          <p class="heading-text">
            1658 <span class="small-text">active</span>
          </p>
          <p class="nrml-text">
            <i class="pi pi-arrow-up text-[12px]"></i>
            1.5%
          </p>
        </div>
      </div>

      <div class="bg-white p-4 space-y-4 rounded-md">
        <div class="flex items-center justify-between">
          <p class="nrml-text">Strategies</p>
          <img src="/svg/dash3.svg" class="h-[30px] w-[30px]"></img>
        </div>
        <hr class="border border-dashed" />
        <div class="flex items-center justify-between">
          <p class="heading-text">
            {{ joinerCount }} / {{ strategiesCount }} <span class="small-text">active</span>
          </p>
          <!-- <p class="nrml-text">
            <i class="pi pi-arrow-up text-[12px]"></i>
            1.5%
          </p> -->
        </div>
      </div>

      <div class="bg-white p-4 space-y-4 rounded-md">
        <div class="flex items-center justify-between">
          <p class="nrml-text">Total Trades</p>
          <img src="/svg/dash4.svg" class="h-[30px] w-[30px]"></img>
        </div>
        <hr class="border border-dashed" />
        <div class="flex items-center justify-between">
          <p class="heading-text">460</p>
          <!-- <p class="nrml-text">
            <i class="pi pi-arrow-up text-[12px]"></i>
            1.5%
          </p> -->
        </div>
      </div>
    </div>

    <!-- POSITIONS TABLE -->
    <Positions/>
    
  </main>
</template>
