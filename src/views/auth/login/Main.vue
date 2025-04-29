<script setup>
import { ref, reactive } from "vue";
import { RouterLink, useRouter } from "vue-router";
// import { useTickerStore } from "@/stores/matrix/ticker/ticker";
import { required, email, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {
  makeRequest,
  setToken,
  setisAuthenticated,
  state,
} from "@/requests/requests";

const router = useRouter()

const checkTnC = ref(false);

const loginFormData = reactive({
  email: "",
  password: "",
});

const errors = ref({});
const errorMsg = ref("");
const requested = ref(false);

// Validation rules
const loginFormRules = {
  email: { required, email },
  password: { required },
};

// Use Vuelidate for validation
const v$ = useVuelidate(loginFormRules, loginFormData);

const login = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    errors.value.email = v$.value.email.$error
      ? "Please enter a valid email."
      : "";
    errors.value.password = v$.value.password.$error
      ? "Password must be at least 6 characters long."
      : "";
    return;
  }
  if (!v$.value.$invalid) {
    try {
      requested.value = true;
      const response = await makeRequest(
        'login',
        'POST',
        loginFormData,
        {},
        {},
        0,
        null
      );

      if (response) {
        localStorage.setItem("token", `Bearer ${response.data.token}`);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("refresh", true);
        if (localStorage.getItem('tutorial') == null) {
          localStorage.setItem("tutorial", true);
        }
        
        errorMsg.value = "";
        setisAuthenticated(true, response.data.user_role);

        // Navigate to dashboard 
        const redirectPage = localStorage.getItem('redirectAfterLogin');
        
        if(redirectPage){
          checkRedirectAfterLogin();
        } else{
          router.push("/")
        }
      } else {
        errorMsg.value = state["login"].error?.message;
      }
    } catch (error) {
      errorMsg.value = state["login"].error?.message;
      if (!errorMsg.value) {
        errorMsg.value = "An error occurred while logging in. Please try again later."
      }
      console.error("Login error: ", error);
    } finally {
      requested.value = false;
    }
  }
};

// Added function to handle Enter key press
const handleEnterKey = () => {
  if (checkTnC.value) {
    login();
  }
};
</script>

<template>
  <section class="flex flex-col md:flex-row items-center min-h-screen font-geist">
    <!-- Left side - banner area -->
    <div class="hidden lg:block lg:w-1/2 bg-[#1A1919] min-h-[50vh] md:h-screen text-center px-4 py-8 md:py-10">
      <div class="flex items-center justify-center">
        <img src="/svg/logo.svg" alt="Logo" class="h-10 md:h-auto">
      </div>
      
      <div class="flex items-center flex-col gap-2 mt-6 md:mt-10">
        <h2 class="leading-tight text-transparent bg-clip-text text-2xl md:text-[38.2px] max-w-xl font-semibold bg-gradient-to-r from-[#387ED1] to-[#ffffff]">
          One platform. Multiple brokers. Infinite opportunities
        </h2>
        <p class="text-sm md:text-[18px] text-[#ADB2B9] font-[400] px-4">
          Seamlessly manage users, monitor performance, and earn smarter every day.
        </p>
      </div>
      
      <div class="mt-6 md:mt-10">
        <img src="/login.png" alt="login" class="max-w-full mx-auto" />
      </div>
    </div>
    
    <!-- Right side - login form -->
    <div class="w-full md:w-1/2 flex flex-col items-center justify-start py-8 md:py-10 px-6 md:px-10 lg:px-20 xl:px-32">
      <h1 class="font-semibold text-2xl md:text-[40px]">Sign In</h1>

      <form @submit.prevent="login" @keydown.enter.prevent="handleEnterKey" class="w-full mt-4 md:mt-6 space-y-4">
        <div class="space-y-1">
          <p>Email</p>
          <input
            type="email"
            placeholder="Enter your email" 
            v-model="loginFormData.email"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
          <p v-if="errors.email" class="text-red-500 text-sm">
            {{ errors.email }}
          </p>
        </div>
        
        <div class="space-y-1">
          <p>Password</p>
          <input
            type="password"
            v-model="loginFormData.password"
            placeholder="Enter Password"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
          <p v-if="errors.password" class="text-red-500 text-sm">
            {{ errors.password }}
          </p>
          <p v-if="errorMsg" class="text-red-500 text-sm">
            {{ errorMsg }}
          </p>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs md:text-sm gap-2">
          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="checkTnC" id="tnc" class="cursor-pointer"/>
            <label for="tnc" class="cursor-pointer">
              I agree the <a href="" class="hover:underline text-custom-blue">XYZ T&C</a> and <a href="" class="hover:underline text-custom-blue">Privacy Policy</a>
            </label>
          </div>

          <router-link to="/forgot-password" class="text-blue-500 font-semibold">Forget Password</router-link>
        </div>

        <button 
          type="submit" 
          :disabled="!checkTnC" 
          :class="['w-full py-2 rounded-md', checkTnC ? 'bg-[#387ED1] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed']"
        >
          Submit
        </button>

        <p class="text-center opacity-50 text-sm md:text-base">
          Don't have a account?
          <router-link class="opacity-100 font-semibold" to="/register">Register</router-link>
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
@media screen and (max-width: 640px) {
  .font-geist {
    font-size: 14px;
  }
}
</style>