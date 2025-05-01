<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { reactive, ref, toRefs } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, email, integer } from '@vuelidate/validators';
import { EyeIcon, EyeOffIcon, AlertTriangleIcon } from 'lucide-vue-next';

// Import your makeRequest function - update path as needed
import { makeRequest, state } from '@/requests/requests';

const router = useRouter();

let passwordFields = reactive({
  showPassword: false,
  showConfirmPassword: false,
});

function togglePasswordVisibility(field) {
  passwordFields[field] = !passwordFields[field];
}

let formData = reactive({
  "name": "",
  "email": "",
  "password": "",
  "confirm_password": "",
  "mobile": "",
  "isAgree": false,
});

let otpVerifyData = reactive({
  "otp": "",
});

const rules = {
  name: {
    required,
    minLength: minLength(4),
  },
  email: {
    required,
    email,
  },
  password: {
    required,
    minLength: minLength(6),
  },
  confirm_password: {
    required,
    sameAsPassword: (value) => {
      return value === formData.password;
    },
  },
  mobile: {
    integer,
    required,
    minLength: minLength(10),
  },
  isAgree: {
    required,
  }
};

const otpRules = {
  otp: {
    required,
    minLength: minLength(4),
  }
};

const validate = useVuelidate(rules, toRefs(formData));
const validateOtp = useVuelidate(otpRules, toRefs(otpVerifyData));

const error = ref("");
const idForOtpVerify = ref(null);

const submitForm = async () => {
  validate.value.$touch();
  if (!validate.value.$invalid) {
    const response = await makeRequest("register", "POST", { name: formData.name, email: formData.email, password: formData.password, mobile: formData.mobile }, {}, {}, 0, null);
    if (response) {
      idForOtpVerify.value = response.data;
    } else {
      error.value = state.error.response.data.message;
    }
  }
};
const checkTnC = ref(false);
const submitVerifyOtp = async () => {
  validateOtp.value.$touch();
  if (!validateOtp.value.$invalid) {

    const responseVerify = await makeRequest("adminOtp", "POST", otpVerifyData);
    if (responseVerify) {
      router.push("/")
    } else {
      error.value = state.error.response.data.message;
    }
  }
};
</script>

<template>
  <section class="flex items-start min-h-screen font-geist">
    <div class="hidden overflow-hidden md:block md:w-1/2 bg-[#1A1919] min-h-[50vh] md:h-screen text-center px-4 py-8 md:py-10">
      <div class="flex items-center justify-center">
        <img src="/svg/logo.svg" alt="Logo" class="h-10 md:h-auto">
      </div>

      <div class="flex items-center flex-col gap-2 mt-6 md:mt-10">
        <h2
          class="leading-tight text-transparent bg-clip-text text-2xl md:text-[38.2px] max-w-xl font-semibold bg-gradient-to-r from-[#387ED1] to-[#ffffff]">
          One platform. Multiple brokers. Infinite opportunities
        </h2>
        <p class="text-sm md:text-[18px] text-[#ADB2B9] font-[400] px-4">
          Seamlessly manage users, monitor performance, and earn smarter every day.
        </p>
      </div>

      <div class="mt-6 md:mt-10">
        <img src="/signup.png" alt="login" class="max-w-full mx-auto object-contain" />
      </div>
    </div>
    <div class="w-full md:w-1/2 flex flex-col items-center justify-start py-8 md:py-10 px-6 md:px-10 lg:px-20 xl:px-32">
      <div class="flex md:hidden items-center justify-center py-4">
        <img src="/svg/logo.svg" alt="Logo" class="">
      </div>
      <h1 class="font-semibold text-2xl md:text-[40px]">Create an account</h1>

      <div v-if="error" class="w-full mt-4 text-red-500 flex items-center">
        <AlertTriangleIcon class="w-4 h-4 mr-2" /> {{ error }}
      </div>

      <template v-if="!idForOtpVerify">
        <form class="w-full mt-6 space-y-4" @submit.prevent="submitForm">
          <div class="space-y-1">
            <p>Full name</p>
            <input id="name" name="name" v-model.trim="validate.name.$model" type="text"
              placeholder="Enter name e.g- Roshni chandra" :class="{ 'border-red-500': validate.name.$error }"
              class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent" />
            <template v-if="validate.name.$error">
              <div v-for="error of validate.name.$errors" :key="error.$uid" class="text-red-500 text-sm mt-1">
                {{ error.$message }}
              </div>
            </template>
          </div>

          <div class="space-y-1">
            <p>Email</p>
            <input id="email" name="email" v-model.trim="validate.email.$model" type="text"
              placeholder="Enter your email address" :class="{ 'border-red-500': validate.email.$error }"
              class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent" />
            <template v-if="validate.email.$error">
              <div v-for="error of validate.email.$errors" :key="error.$uid" class="text-red-500 text-sm mt-1">
                {{ error.$message }}
              </div>
            </template>
          </div>

          <div class="space-y-1">
            <p>Number</p>
            <input id="mobile" name="mobile" v-model.trim="validate.mobile.$model" type="text"
              placeholder="Enter your mobile number" :class="{ 'border-red-500': validate.mobile.$error }"
              class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent" />
            <template v-if="validate.mobile.$error">
              <div v-for="error of validate.mobile.$errors" :key="error.$uid" class="text-red-500 text-sm mt-1">
                {{ error.$message }}
              </div>
            </template>
          </div>

          <div class="space-y-1">
            <p>Password</p>
            <div class="relative">
              <input id="password" name="password" v-model.trim="validate.password.$model"
                :type="passwordFields.showPassword ? 'text' : 'password'" placeholder="Enter your password"
                :class="{ 'border-red-500': validate.password.$error }"
                class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent" />
              <span @click="togglePasswordVisibility('showPassword')"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
                <EyeOffIcon v-if="passwordFields.showPassword" class="w-5 h-5" />
                <EyeIcon v-else class="w-5 h-5" />
              </span>
            </div>
            <template v-if="validate.password.$error">
              <div v-for="error of validate.password.$errors" :key="error.$uid" class="text-red-500 text-sm mt-1">
                {{ error.$message }}
              </div>
            </template>
            <div class="w-full grid grid-cols-12 gap-4 h-1 mt-3" v-if="formData.password">
              <div class="col-span-3 h-full rounded"
                :class="formData.password.length < 6 ? 'bg-red-500' : formData.password.length < 9 ? 'bg-yellow-500' : 'bg-green-500'">
              </div>
              <div class="col-span-3 h-full rounded"
                :class="formData.password.length > 8 ? 'bg-green-500' : formData.password.length > 5 ? 'bg-yellow-500' : 'bg-gray-200'">
              </div>
              <div class="col-span-3 h-full rounded"
                :class="formData.password.length < 9 ? 'bg-gray-200' : 'bg-green-500'">
              </div>
            </div>
            <span v-if="formData.password.length >= 6"
              :class="formData.password.length < 9 ? 'text-yellow-600' : 'text-green-600'" class="block mt-2 text-xs">
              {{ formData.password.length < 9 ? 'Your password is of average length, keep it up!'
                : 'Your password is a good length, well done!' }} </span>
          </div>

          <div class="space-y-1">
            <p>Confirm Password</p>
            <div class="relative">
              <input id="confirm_password" name="confirm_password" v-model.trim="validate.confirm_password.$model"
                :type="passwordFields.showConfirmPassword ? 'text' : 'password'" placeholder="Confirm your password"
                :class="{ 'border-red-500': validate.confirm_password.$error }"
                class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent" />
              <span @click="togglePasswordVisibility('showConfirmPassword')"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
                <EyeOffIcon v-if="passwordFields.showConfirmPassword" class="w-5 h-5" />
                <EyeIcon v-else class="w-5 h-5" />
              </span>
            </div>
            <template v-if="validate.confirm_password.$error">
              <div class="text-red-500 text-sm mt-1">
                Password and Confirm Password should match
              </div>
            </template>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="checkTnC" id="tnc" class="cursor-pointer"/>
            <label for="tnc" class="cursor-pointer">
              I agree the <a href="" class="hover:underline text-custom-blue">XYZ T&C</a> and <a href="" class="hover:underline text-custom-blue">Privacy Policy</a>
            </label>
          </div>
          <template v-if="validate.isAgree.$error">
            <div class="text-red-500 text-sm mt-1">
              You must agree to the terms and conditions
            </div>
          </template>

          <button :disabled="!checkTnC" type="submit"
          :class="['w-full py-2 rounded-md', checkTnC ? 'bg-[#387ED1] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed']">
            Submit
          </button>

          <p class="text-center opacity-50">Already a member? <router-link class="opacity-100 font-semibold"
              to="/login">Login</router-link></p>
        </form>
      </template>

      <template v-else>
        <form class="w-full mt-6 space-y-4" @submit.prevent="submitVerifyOtp">
          <div class="space-y-1">
            <p>OTP Verification</p>
            <input id="otp" name="otp" v-model.trim="validateOtp.otp.$model" type="text"
              placeholder="Enter your 6 digit email OTP" :class="{ 'border-red-500': validateOtp.otp.$error }"
              class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent" />
            <template v-if="validateOtp.otp.$error">
              <div v-for="error of validateOtp.otp.$errors" :key="error.$uid" class="text-red-500 text-sm mt-1">
                {{ error.$message }}
              </div>
            </template>
          </div>

          <button type="submit" class="bg-[#387ED1] w-full text-white py-2 rounded-md">
            Verify OTP
          </button>
        </form>
      </template>
    </div>
  </section>
</template>