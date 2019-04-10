<template>
  <div class="claim-footer">
    <div class="lis-container">
      <p>Liscena uses information from your Liscena account to identify you and allow access to Liscena Services. Your use of this site is governed by our Terms of Use and Privacy Policy linked below. Your use of Liscena products and services is governed by the Liscena Customer Agreement linked below unless you have entered into a separate agreement with Liscena. The Liscena Customer Agreement was updated on June 20, 2018. For more information about these updates, see Recent Changes.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';

@Component({
  components: {
  },
})
export default class ClaimHeader extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/lis-resources.scss";

.claim-footer {
  font-size: 0.9rem;
  &__legal-title {
    margin-bottom: 20px;
  }
  height: 280px;
  display: flex;
  align-items: center;
  background: var(--color-blue-5);
  p {
    color: var(--color-blue-4);
  }
}
</style>

