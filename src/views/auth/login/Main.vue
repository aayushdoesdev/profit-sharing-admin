<script setup>
import { ref, reactive } from "vue";
import { RouterLink } from "vue-router";
// import { useTickerStore } from "@/stores/matrix/ticker/ticker";
import { required, email, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {
  makeRequest,
  // setTokenAndRole,
  setisAuthenticated,
  state,
} from "@/requests/requests";


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
    // toast.addToast('Error', 'Please fill the entire form! ', 'warning', 3000);
    // toast.addToast({
    //   severity: 'warning',
    //   summary: 'Error',
    //   detail: 'Please fill the entire form!',
    //   life: 3000
    // });
    return;
  }
  if (!v$.value.$invalid) {
    try {
      requested.value = true;
      const response = await makeRequest(
        "login",
        "POST",
        loginFormData,
        {},
        {},
        0,
        null
      );

      if (response) {
        // currentStep.value = "setup";
        // setTokenAndRole(response.data.access_token, response.data.user_role);
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("role", response.data.user_role);
        // localStorage.setItem("matrix", "auto");
        localStorage.setItem("refresh", true);
        if (localStorage.getItem('tutorial') == null) {
          localStorage.setItem("tutorial", true);
        }
        

        errorMsg.value = "";
        setisAuthenticated(true, response.data.user_role);

        // websocket connection
        const tickerStore = useTickerStore();
        tickerStore.startWebSocket(response.data.access_token);

        // Navigate to dashboard 
        const redirectPage = localStorage.getItem('redirectAfterLogin');
        
        if(redirectPage){
          checkRedirectAfterLogin();
        } else{
          router.push("/").then(() => {
          nextTick(() => {
            // location.reload();
          });
        });
        }
        
        toast.addToast('Success', 'Successfully logged in!', 'success', 3000);
      } else {
        errorMsg.value = state["login"].error.data.message;
      }
    } catch (error) {
      errorMsg.value = state["login"].error.data.message;
      if (!errorMsg.value) {
        errorMsg.value = "An error occurred while logging in. Please try again later."
      }
      console.error("Login error: ", error);
    } finally {
      requested.value = false;
    }
  }
};


</script>

<template>
  <section class="flex items-center min-h-screen font-geist">
    <div class="w-[50%] bg-gray-700 h-screen"></div>
    <div class="w-[50%] flex flex-col items-center justify-start py-10 px-32">
      <h1 class="font-semibold text-[40px]">Sign In</h1>

      <form @submit.prevent="login" @keydown.enter.prevent="handleEnterKey" class="w-full mt-6 space-y-4">
        <div class="space-y-1">
          <p>Email</p>
          <input
            type="text"
            placeholder="yourname@gmail.com" v-model="loginFormData.email"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
          <p v-if="errors.email" class="text-red-500 nrml-text">
                {{ errors.email }}
              </p>
        </div>
        <div class="space-y-1">
          <p>Password</p>
          <input
            type="text"
            v-model="loginFormData.password"
            placeholder="Password"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
          <p v-if="errors.password" class="text-red-500 nrml-text">
                {{ errors.password }}
              </p>
              <p v-if="errorMsg" class="text-red-500 nrml-text">
                {{ errorMsg }}
              </p>
        </div>
        <div class="flex items-center justify-between text-[12px]">
          <div class="flex items-center gap-2">
            <input type="checkbox" />
            <p>I agree the XYZ T&C and privacy policy</p>
          </div>

          <router-link to="/forgot-password" class="text-blue-500 font-semibold">Forget Password</router-link>
        </div>

        <button type="submit" class="bg-[#387ED1] w-full text-white py-2 rounded-md">
          Submit
        </button>

        <p class="text-center opacity-50">
          Don’t have a account?
          <router-link class="opacity-100 font-semibold" to="/register"
            >Register</router-link
          >
        </p>
      </form>
    </div>
  </section>
</template>
