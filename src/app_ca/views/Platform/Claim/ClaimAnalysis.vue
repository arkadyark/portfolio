<template>
  <div class="claim-analysis">
    <div class="claim-analysis__buttons-list">
      <lis-button
        v-for="view in analysisViews"
        :icon="view.enabled ? 'check-circle' : 'alert-circle-outline'"
        :type="isActive(view.name) ? 'primary' : 'outline'"
        :text="view.text"
        :key="view.name"
        @click.native="redirect(view)"
      />
    </div>
    <div class="claim-analysis__view">
      <transition name="horizontal-transition" mode="out-in">
        <router-view :claim="claim"/>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';
import LisIcon from '@/components/LisIcon.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisButton from '@/components/LisButton.vue';
import LisFileThumbnail from '@/components/LisFileThumbnail.vue';

interface CAView {
  text: string;
  name: string;
  enabled?: boolean;
}

@Component({
  components: {
    LisLoader,
    LisButton,
    LisIcon,
    LisFileThumbnail,
  },
})
export default class ClaimAnalysis extends Vue {
  @Prop({ type: Object }) private claim!: any;

  private analysisViews: CAView[] = [
    {
      text: 'Damage segmentation',
      name: 'dashboard.claimDetail.analysis.damageSegmentation',
      enabled: true,
    },
    {
      text: 'Total loss analysis',
      name: 'dashboard.claimDetail.analysis.totalLoss',
      enabled: true,
    },
    {
      text: 'Audio analysis',
      name: 'dashboard.claimDetail.analysis.audioAnalysis',
    },
    {
      text: 'Triage',
      name: 'dashboard.claimDetail.analysis.triage',
    },
    {
      text: 'Fraud analysis',
      name: 'dashboard.claimDetail.analysis.fraudAnalysis',
    },
    {
      text: 'Price prediction',
      name: 'dashboard.claimDetail.analysis.pricePrediction',
    },
  ];

  public isActive(viewName: string) {
    return this.$route.name === viewName;
  }

  public redirect(view: CAView) {
    if (view.enabled) {
      this.$router.push({ name: view.name });
    }
  }
}
</script>

<style lang="scss">
.claim-analysis {
  display: flex;
  flex-direction: row;
  &__buttons-list {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    margin-right: 40px;
    .lis-button {
      margin: 10px 0;
      white-space: nowrap;
    }
  }
  &__view {
    padding: 20px 40px;
    box-sizing: border-box;
  }
}
</style>
