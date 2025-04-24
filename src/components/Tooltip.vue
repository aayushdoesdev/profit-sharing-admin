<template>
    <div class="relative group flex items-center justify-center">
      <slot></slot>
      <div
        class="absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10"
      >
        {{ text }}
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    text: {
      type: String,
      required: true,
    },
  });
  </script>
  