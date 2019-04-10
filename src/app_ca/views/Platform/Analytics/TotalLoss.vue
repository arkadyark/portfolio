<template>
  <div class="total-loss">
    <lis-loader color="#434B65" v-if="loading"/>
    <div class="total-loss__images" v-else>
      <template v-if="processedImages.length">
        <div class="total-loss__images__item" v-for="(file, i) in processedImages" :key="i">
          <lis-file-thumbnail :clickable="true" :file="file" @openImage="openImage"/>
          <div
            class="total-loss__images__item__severity"
            :style="{ 'backgroundColor': getSeverityColor(file.severity) }"
          >{{ file.severity }}</div>
        </div>
      </template>
      <template v-if="unprocessedImages.length">
        <label class="label">Unprocessed images</label>
        <div class="total-loss__images__item" v-for="(file) in unprocessedImages" :key="file.url">
          <lis-file-thumbnail :clickable="true" :file="file" @openImage="openImage"/>
        </div>
        <br>
        <lis-button
          v-if="!processRequested"
          text="Process images"
          type="green"
          @click="processImages('total-loss')"
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
import LisFileThumbnail from '@/components/LisFileThumbnail.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisButton from '@/components/LisButton.vue';
import config from '@/config/index';

@Component({
  components: {
    LisFileThumbnail,
    LisLoader,
    LisButton,
  },
})
export default class DamageSegmentation extends Vue {
  @Prop({ type: Object }) public claim!: any;
  private loading: boolean = false;
  private processRequested: boolean = false;

  public created() {
    this.loadImages();
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

  get processedImages() {
    if (this.claim && this.claim.images) {
      return this.claim.images
        .filter((img: any) => img.severity != null)
        .map((img: any) => {
          return {
            url: img.image_url,
            severity: Number(img.severity.toFixed(4)),
          };
        });
    }
    return [];
  }

  get unprocessedImages() {
    if (!(this.claim && this.claim.images)) {
      return [];
    }

    return this.claim.images.reduce((arr: any[], img: any) => {
      if (img.severity == null) {
        arr.push({
          url: img.image_url,
        });
      }
      return arr;
    }, []);
  }

  public getSeverityColor(value: number) {
    // value from 0 to 1
    const hue = ((1 - value) * 120).toString(10);
    return ['hsl(', hue, ',80%,50%)'].join('');
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
.total-loss {
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
      &__severity {
        position: relative;
        top: -20px;
        background: red;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        width: 100%;
        line-height: 30px;
        padding: 0 10px;
        color: var(--color-white-1);
        font-weight: 600;
        box-sizing: border-box;
        height: 30px;
      }
    }
  }
}
</style>

