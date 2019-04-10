<template>
  <div class="req-info-driver-license">
    <p>Make sure all information on your licence is visible</p>
    <img src="/img/req_types/driver_license.png"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';

@Component({
  components: {
  },
})
export default class ReqInfoDriverLicense extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/lis-resources.scss";

.req-info-driver-license {
  background: var(--color-blue-5);
  padding: 20px;
  position: relative;
  text-align: left;
  margin: 10px auto;
  border-radius: 5px;
  p {
    font-size: var(--font-size-3);
    line-height: var(--font-size-2);
    color: var(--color-blue-4);
    padding: 10px;
  }
  p + img {
    margin-top: 5px;
  }
  img {
    width: 100%;
  }
}
</style>

