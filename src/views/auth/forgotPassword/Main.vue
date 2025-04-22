<script setup></script>

<template>
  <section class="flex items-center min-h-screen font-geist">
    <div class="w-[50%] bg-gray-700 h-screen"></div>
    <div class="w-[50%] flex flex-col items-start justify-start py-10 px-32">
        <router-link to="/login" class="border border-black border-opacity-20 px-2 py-2 rounded-full flex items-center justify-center">
            <i class="pi pi-angle-left text-[25px]"></i>
        </router-link>

      <div class="text-left">
        <h1 class="font-semibold text-[40px]">Forgot Password</h1>
        <p class="text-[14px] opacity-50">Please enter your email to reset the password</p>
      </div>

      <div class="w-full mt-6 space-y-4">
        <div class="space-y-1">
          <p>Email</p>
          <input
            type="text"
            placeholder="Enter name e.g- Roshni chandra"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
        </div>
        <div class="flex items-center justify-between text-[12px]">
          <div class="flex items-center gap-2">
            <input type="checkbox" />
            <p>I agree the XYZ T&C and privacy policy</p>
          </div>

          <router-link to="/forgot-password" class="text-blue-500 font-semibold"
            >Forget Password</router-link
          >
        </div>

        <button class="bg-[#387ED1] w-full text-white py-2 rounded-md">
          Reset password
        </button>
      </div>
    </div>
  </section>
</template>
