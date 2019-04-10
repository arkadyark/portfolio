<template>
  <div class="login">
    <form @submit.prevent="login" class="lis-form">
      <div class="login__header">
        <img src="/img/crawford_logo.png" height="33">
        <p>Policy Holder Portal</p>
      </div>
      <fieldset class="lis-form__fieldset">
        <lis-input placeholder="Email" v-model="formData.email"/>
      </fieldset>
      <fieldset class="lis-form__fieldset">
        <lis-input placeholder="Password" type="password" v-model="formData.password"/>
      </fieldset>
      <lis-button :fullwidth="true" text="Login" type="primary"/>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';
import LisInput from '@/components/LisInput.vue';
import LisButton from '@/components/LisButton.vue';

@Component({
  components: {
    LisInput,
    LisButton,
  },
})
export default class Login extends Vue {
  public formData = {
    email: '',
    password: '',
  };

  public login() {
    console.log('Login with', this.formData);
    ApiService.post(`/test`, {
      data: {},
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });

    this.$router.push({
      name: 'claimStatus',
    });
  }
}
</script>

<style lang="scss" scoped>
.login {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  .lis-form {
    width: 320px;
  }
  &__header {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-bottom: 40px;
    p {
      margin: 40px auto 0;
      font-size: 1.4rem;
    }
  }  
}
</style>

