<template>
  <div class="claim-status">
    <div class="claim-status__new-claim-submitted" v-if="message === 'new_claim'">
      <p>Your claim has been successfully submitted.</p>
    </div>
    <div v-if="filesLoading" class="claim-status__files-loading">
      <lis-loader color="#434B65"/>
    </div>
    <claim-file-uploader
      v-else
      :uploaded-files="claimImages"
      :claim="claim"
      @updateClaim="(claim) => $emit('updateClaim', claim)"
    />
    <claim-footer/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import ClaimFooter from './ClaimFooter.vue';
import ClaimFileUploader from './ClaimFileUploader.vue';
import LisLoader from '@/components/LisLoader.vue';
import config from '@/config/index.ts';

@Component({
  components: {
    ClaimFooter,
    ClaimFileUploader,
    LisLoader,
  },
})
export default class ClaimFiles extends Vue {
  public filesLoading: boolean = false;

  @Prop({ type: Object }) private claim!: any;

  get claimImages() {
    if (this.claim && this.claim.images) {
      return this.claim.images.map((imgObject: any) => {
        return {
          name: imgObject.id + '.png',
          url: imgObject.image_url,
        };
      });
    }

    return [];
  }

  get message() {
    return this.$route.query.message;
  }

  get uploaded() {
    return this.$route.query.uploaded;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/lis-resources.scss";

.claim-status {
  &__new-claim-submitted {
    height: 120px;
    background: var(--color-green-1);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0px 2px 5px var(--color-light-1);
    p {
      font-size: 1.5rem;
      font-weight: 500;
      padding: 0 30px;
    }
  }
}

@media screen and (min-width: $breakpoint-mobile) {
  .claim-status {
    &__new-claim-submitted {
      p {
        font-size: 1.5rem;
      }
    }
  }
}

@media screen and (max-width: $breakpoint-mobile) {
  .claim-status {
    &__new-claim-submitted {
      p {
        font-size: 1.2rem;
        line-height: 1.6rem;
      }
    }
  }
}
</style>

