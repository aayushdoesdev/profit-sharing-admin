<template>
    <teleport to="body">
      <div class="toast-container" :style="{ zIndex: Math.max(zIndexValue + 1, currZindex + 1) }">
        <template v-if="toastsArray.length > 0">
          <div
            v-for="(item, index) in toastsArray"
            :key="item.id"
            class="relative text-white toast flex items-center justify-start gap-6 p-3 w-full"
            :class="{
              'border-[#ed5f4b] bg-gradient-to-l from-[#F6743E] to-[#D42525]': item.severity === 'error',
              'border-[#ffbb01] bg-gradient-to-l from-[#F8B806] to-[#FF8C04]': item.severity === 'warn',
              'border-[#22a94f] bg-gradient-to-l from-[#32BB71] to-[#2A9D8F]': item.severity === 'success',
              'border-[#0483e1] bg-gradient-to-l from-[#2D82B2] to-[#329ABB]': item.severity === 'info'
            }"
          >
            <button
              @click="hideToast(item.id)"
              class="absolute top-2 right-2 pi pi-times"
            ></button>
  
            <div class="rounded-full p-2 bg-white bg-opacity-20">
              <img :src="getIcon(item.severity)" alt="" class="w-7" />
            </div>
  
            <div class="text-white">
              <h4 class="text-[16px] text-wrap font-bold">
                {{ item.summary }}
              </h4>
              <p class="text-[14px]">
                {{ item.detail }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </teleport>
  </template>
  
  <script setup>
  import { storeToRefs } from "pinia";
  import { ref, computed } from "vue";
  import success from "@/assets/svg/tick.svg";
  import cross from "@/assets/svg/cross.svg";
  import pending from "@/assets/svg/pending.svg";
  import info from "@/assets/svg/info.svg";
  
  import { useToastStore } from "@/stores/toast";
  const toastStore = useToastStore();
  let { toasts } = storeToRefs(toastStore);
  
  const currZindex = ref(0);
  
  const toastsArray = computed(() => {
    return toastStore.toasts || [];
  });
  
  const hideToast = (id) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };
  
  function getHighestZIndex() {
    const elements = [...document.querySelectorAll("body *")];
    const zIndexes = elements
      .map((el) => parseFloat(window.getComputedStyle(el).zIndex))
      .filter((zIndex) => !isNaN(zIndex));
    currZindex.value = Math.max(0, ...zIndexes);
    return Math.max(0, ...zIndexes);
  }
  
  const zIndexValue = computed(() => {
    if (toasts.value && toasts.value.length > 0) {
      return getHighestZIndex() + 1;
    }
  });
  
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return success;
      case "error":
        return cross;
      case "warning":
        return pending;
      default:
        return info;
    }
  };
  </script>
  
  <style scoped>
  .toast-container {
    @apply fixed top-5 right-5 flex flex-col items-end;
  }
  
  .toast {
    @apply min-w-[250px] max-w-sm lg:max-w-md rounded transform transition-transform ease-out duration-300 mb-2;
    animation: slideInBottom 0.4s ease-in-out, slideOutBottom 0.4s ease-in-out 3s forwards;
  }
  
  @keyframes slideInBottom {
    0% {
      opacity: 0;
      transform: translateX(100%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideOutBottom {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  </style>
  