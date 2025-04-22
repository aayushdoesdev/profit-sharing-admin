<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <section class="flex items-start min-h-screen font-geist">
    <div class="w-[50%] bg-gray-700 h-screen"></div>
    <div class="w-[50%] flex flex-col items-center justify-start py-10 px-32">
      <h1 class="font-semibold text-[40px]">Create an account</h1>

      <div class="w-full mt-6 space-y-4">
        <div class="space-y-1">
          <p>Full name</p>
          <input
            type="text"
            placeholder="Enter name e.g- Roshni chandra"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
        </div>
        <div class="space-y-1">
          <p>Email</p>
          <input
            type="text"
            placeholder="Enter name e.g- Roshni chandra"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
        </div>
        <div class="space-y-1">
          <p>Number</p>
          <input
            type="text"
            placeholder="Enter name e.g- Roshni chandra"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
        </div>
        <div class="space-y-1">
          <p>Password</p>
          <input
            type="text"
            placeholder="Enter name e.g- Roshni chandra"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
        </div>
        <div class="space-y-1">
          <p>Confirm Password</p>
          <input
            type="text"
            placeholder="Enter name e.g- Roshni chandra"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
        </div>
        <div class="flex items-center gap-2 text-[12px]">
          <input type="checkbox" />
          <p>I agree the XYZ T&C and privacy policy</p>
        </div>

        <button class="bg-[#387ED1] w-full text-white py-2 rounded-md">
          Submit
        </button>

        <p class="text-center opacity-50">Already a member? <router-link class="opacity-100 font-semibold" to="/login">Login</router-link></p>
      </div>
    </div>
  </section>
</template>
