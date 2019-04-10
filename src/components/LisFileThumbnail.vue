<template>
  <div class="lis-file-thumbnail" :class="{ 'lis-file-thumbnail--clickable': clickable }">
    <template v-if="isImage">
      <div
        v-if="fileSrc"
        @click="$emit('openImage', fileSrc)"
        class="lis-file-thumbnail__image-preview file-thumbnail__image-preview--white"
        :style="{backgroundImage: `url(${fileSrc})`}"
      />
      <div v-else class="lis-file-thumbnail__image-preview">
        <lis-loader/>
      </div>
    </template>
    <template v-else>
      <div class="lis-file-thumbnail__file">
        <lis-icon name="file-outline"/>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LisIcon from '@/components/LisIcon.vue';
import LisLoader from '@/components/LisLoader.vue';

@Component({
  components: {
    LisIcon,
    LisLoader,
  },
})
export default class LisFileThumbnail extends Vue {

  get fileName() {
    return this.file.name;
  }

  get fileSrc() {
    return this.file && this.file[this.urlField]
      ? this.file[this.urlField]
      : this.src;
  }

  get isImage() {
    // TODO: Check type based on image not name
    if (!this.file.name) {
      return !!this.file[this.urlField];
    }
    const fileExt: string = String(this.file.name.split('.').pop());
    return this.allowedImagesTypes.includes(fileExt.toLowerCase());
  }
  public src: string = '';
  private allowedImagesTypes: string[] = ['jpg', 'png', 'bmp', 'gif', 'svg'];

  @Prop() private file!: File | any;
  @Prop({ type: Boolean, default: false }) private clickable!: boolean;
  @Prop({ type: String, default: 'url' }) private urlField!: string;

  public readURL(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function(e: any) {
        resolve(e.target!.result);
      };

      reader.readAsDataURL(file);
    });
  }

  public created() {
    if (!this.file[this.urlField]) {
      this.getPreview();
    }
  }

  public async getPreview() {
    if (this.file) {
      const src = await this.readURL(this.file);
      this.src = src as string;
    }
  }
}
</script>

<style lang="scss" scoped>
.lis-file-thumbnail {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 1px 1px 4px 0 var(--color-light-1);
  display: inline-block;
  width: 100px;
  height: 100px;
  $root: &;
  &--clickable {
    #{$root}__image-preview {
      cursor: pointer;
      &:hover {
        opacity: 0.9;
      }
    }
  }
  &__image-preview {
    background-color: var(--color-blue-4);
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    &--white {
      background-color: var(--color-white-1);
    }
  }
  &__file {
    height: 100%;
    color: var(--color-white-1);
    font-weight: 500;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-blue-4);
  }
}
</style>
