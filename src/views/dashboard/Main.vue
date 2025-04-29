<script setup>
import Positions from './position/Positions.vue';

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
            8/34 <span class="small-text">active</span>
          </p>
          <p class="nrml-text">
            <i class="pi pi-arrow-up text-[12px]"></i>
            1.5%
          </p>
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
          <p class="nrml-text">
            <i class="pi pi-arrow-up text-[12px]"></i>
            1.5%
          </p>
        </div>
      </div>

      <!-- <div class="bg-white p-4 space-y-4 rounded-md col-span-2 md:col-span-1">
        <div class="flex items-center justify-between">
          <p class="nrml-text">Brokers</p>
          <img src="/svg/dash5.svg" class="h-[30px] w-[30px]"></img>
        </div>
        <hr class="border border-dashed" />
        <div class="flex items-center justify-between">
          <p class="heading-text">46589</p>
          <button class="text-custom-blue flex items-center font-bold underline underline-offset-4 text-[14px]">
            <p>+ Connect</p>
          </button>
        </div>
      </div> -->
    </div>

    <!-- POSITIONS TABLE -->
    <Positions/>
    
  </main>
</template>
