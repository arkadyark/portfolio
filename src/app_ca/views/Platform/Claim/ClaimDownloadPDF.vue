<template>
  <div class="claim-download-pdf">
    <transition name="horizontal-transition" mode="out-in">
      <!-- <div v-if="generating" key="generating">
        <p class="claim-download-pdf__generating-text">Generating PDF</p>
        <lis-loader color="#434B65"/>
      </div>
      <div v-else-if="!error && pdfUrl" key="download">
        <lis-button type="primary" icon="download" text="Download PDF" @click="downloadPDF"/>
      </div>
      <div v-else-if="!error" key="generate">
        <lis-button
          type="white"
          icon="file-pdf"
          text="Generate PDF"
          @click="generatePDF"
        />
      </div>
      <p v-else class="lis-notification-text" key="error">PDF couldn't be generated. Please, try again later</p> -->
      <!-- We need to edit pdf generation on the back-end for the whole claim -->
      <p>Temporarily unavailable</p>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';
import LisIcon from '@/components/LisIcon.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisButton from '@/components/LisButton.vue';
import config from '@/config/index.ts';

@Component({
  components: {
    LisLoader,
    LisButton,
    LisIcon,
  },
})
export default class ClaimDownloadPDF extends Vue {

  public generating: boolean = false;
  public pdfUrl: string | null = null;
  public error: boolean = false;
  @Prop({ type: Array }) private claim!: any[];

  public generatePDF() {
    this.generating = true;
    this.error = false;
    this.$store
      .dispatch('dashboard/generateClaimPDF', {
        claimRef: this.claim[0].ref,
        claimId: this.claim[0].id,
      })
      .then((response) => {
        this.pdfUrl = response.data.pdf_url;
      })
      .catch((err) => {
        console.log(err);
        this.error = true;
      })
      .finally(() => {
        this.generating = false;
      });
  }

  public downloadPDF() {
    if (this.pdfUrl) {
      window.open(this.pdfUrl, '_blank');
    }
  }
}
</script>

<style lang="scss">
.claim-download-pdf {
  display: flex;
  flex-direction: row;
  &__generating-text {
    font-size: var(--font-size-3);
    margin-bottom: 20px;
  }
  &__generating-text + .lis-loader {
    margin: 0;
  }
}
</style>
