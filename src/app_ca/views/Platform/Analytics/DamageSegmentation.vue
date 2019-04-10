<template>
  <div class="damage-segmentation">
    <lis-loader color="#434B65" v-if="loading"/>
    <div class="damage-segmentation__images" v-else>
      <template v-if="processedImages.length">
        <label class="label">Processed images</label>
        <div class="damage-segmentation__images__item" v-for="(file) in processedImages" :key="file.url">
          <lis-file-thumbnail :clickable="true" :file="file" @openImage="openImage"/>
        </div>
      </template>
      <template v-if="unprocessedImages.length">
        <label class="label">Unprocessed images</label>
        <div
          class="damage-segmentation__images__item"
          v-for="(file) in unprocessedImages"
          :key="file.url"
        >
          <lis-file-thumbnail :clickable="true" :file="file" @openImage="openImage"/>
        </div>
        <br>
        <lis-button
          v-if="!processRequested"
          text="Process images"
          type="green"
          @click="processImages('damage-segmentation')"
        />
        <p
          v-else
          class="lis-notification-text lis-notification-text--success"
        >Images have been sent for analysis.
          <br>Visit this page later to see the results.
        </p>        
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';
import config from '@/config/index.ts';
import LisFileThumbnail from '@/components/LisFileThumbnail.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisButton from '@/components/LisButton.vue';

@Component({
  components: {
    LisFileThumbnail,
    LisLoader,
    LisButton,
  },
})
export default class DamageRecognition extends Vue {
  @Prop({ type: Object }) public claim!: any;
  private loading: boolean = false;
  private processRequested: boolean = false;

  public created() {
    this.loadImages();
  }

  get processedImages() {
    if (!(this.claim && this.claim.images)) {
      return [];
    }

    return this.claim.images.reduce((arr: any[], img: any) => {
      if (img.processed_url) {
        arr.push({
          url: img.processed_url,
        });
      }
      return arr;
    }, []);
  }

  get unprocessedImages() {
    if (!(this.claim && this.claim.images)) {
      return [];
    }

    return this.claim.images.reduce((arr: any[], img: any) => {
      if (!img.processed_url) {
        arr.push({
          url: img.image_url,
        });
      }
      return arr;
    }, []);
  }

  public loadImages() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  public openImage(imageSrc: string) {
    this.$store.dispatch('dashboard/openModalImage', imageSrc);
  }

  public processImages(type: string) {
    this.loading = true;
    this.$store
      .dispatch('dashboard/processClaimImages', {
        claimId: this.claim.id,
        type,
      })
      .then((response) => {
        this.loading = false;
        this.processRequested = true;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
</script>

<style lang="scss" scoped>
.damage-segmentation {
  .label {
    display: block;
    font-weight: 500;
    margin-bottom: 10px;
  }
  &__images {
    &__item {
      display: inline-block;
      margin: 0 20px 20px 0;
      .lis-file-thumbnail {
      }
    }
  }
}
</style>

