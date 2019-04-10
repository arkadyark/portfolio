<template>
  <div class="modal-image" @click="closeModal">
    <img :src="imageSrc"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LisIcon from '@/components/LisIcon.vue';

@Component({
  components: {
    LisIcon,
  },
})
export default class ModalImage extends Vue {
  get imageSrc() {
    return this.$store.state.dashboard.modalImageSrc;
  }

  public closeModal() {
    this.$store.dispatch('dashboard/setModalWindow', null);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.modal-image {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 50px;
  box-sizing: border-box;
  img {
    position: relative;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
