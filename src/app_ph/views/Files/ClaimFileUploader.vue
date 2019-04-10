<template>
  <div class="claim-file-uploader">
    <div class="claim-file-uploader__uploaded" v-if="uploadedFiles.length">
      <div class="lis-container">
        <h2>Uploaded files</h2>
        <div class="claim-file-uploader__files" v-show="uploadedFiles.length">
          <div class="claim-file-uploader__files__item" v-for="(file, i) in uploadedFiles" :key="i">
            <lis-file-thumbnail :file="file"/>
            <div>
              <p>{{ file.name }}</p>
              <p class="date">11th February, 2019</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div ref="dropzone" class="claim-file-uploader__dropzone">
      <div class="lis-container">
        <h2 v-if="uploadedFiles.length">Upload up to 20 photos related to your claim.</h2>
        <h1 v-else>Upload images or files related to your claim</h1>
        <div class="claim-file-uploader__dropzone__files" v-show="queuedFiles.length">
          <lis-file-thumbnail v-for="(file, i) in queuedFiles" :key="i" :file="file"/>
        </div>
        <lis-loader v-if="uploading" color="#0057FF"/>
        <div v-else class="claim-file-uploader__dropzone__actions">
          <lis-button type="white" text="Browse Files" @click="handleFileSelect"/>
          <lis-button
            v-if="queuedFiles.length"
            type="primary"
            text="Upload"
            icon="upload"
            @click="uploadFiles"
          />
          <input ref="fileInput" type="file" @change="addFiles" multiple hidden>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';
import LisButton from '@/components/LisButton.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisFileThumbnail from '@/components/LisFileThumbnail.vue';

@Component({
  components: {
    LisFileThumbnail,
    LisButton,
    LisLoader,
  },
})
export default class ClaimFileUploader extends Vue {

  public fileInput: HTMLElement | null = null;
  public queuedFiles: File[] = [];
  public uploading: boolean = false;
  @Prop({ type: Array, default: () => [] }) private uploadedFiles!: any[];
  @Prop({ type: Object }) private claim!: any;


  public handleFileSelect() {
    const fileInput: HTMLElement = this.$refs.fileInput as HTMLElement;
    fileInput.click();
  }

  public async addFiles(e: any) {
    const fileInput: HTMLElement = this.$refs.fileInput as HTMLElement;
    const files = e.target.files;
    for (const file of files) {
      this.queuedFiles.push(file);
      // const file = await this.readURL(files[i]);
      // console.log('file', file);
    }
    // console.log(files);
  }

  public uploadFiles(e: any) {
    this.uploading = true;
    // setTimeout(() => {
    //   const url = location.protocol + "//" + location.host + location.pathname;
    //   console.log("uploading", url);
    //   window.location.href = url + "?uploaded=true";
    // }, 3000);

    const formData = new FormData();
    for (const file of this.queuedFiles) {
      formData.append('files', file, file.name);
    }

    ApiService.post(`claim/${this.claim.id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        const claim = response.data;
        this.$emit('updateClaim', claim);
        this.queuedFiles = [];
      })
      .finally(() => {
        this.uploading = false;
      });
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/lis-resources.scss";

.claim-file-uploader {
  .lis-file-thumbnail {
    margin: 15px 25px 15px 0;
  }
  &__files {
    display: flex;
    flex-direction: column;
    align-items: center;
    &__item {
      width: 90%;
      border-bottom: 1px solid var(--color-light-1);
      text-align: left;
      display: flex;
      align-items: center;
      margin: 0 20px;
      max-width: 600px;
      .lis-file-thumbnail {
        width: 45px;
        height: 45px;
      }
      .date {
        margin-top: 6px;
        color: var(--color-blue-4);
      }
    }
  }
  &__dropzone {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-blue-5);
    border-top: 1px dashed var(--color-blue-4);
    border-bottom: 1px dashed var(--color-blue-4);
    &__files {
      text-align: center;
      margin-bottom: 40px;
    }
  }
  &__uploaded {
    box-sizing: border-box;
    background: var(--color-white-1);
  }
}

@media screen and (min-width: $breakpoint-mobile) {
  .claim-file-uploader {
    h1 {
      font-size: 2rem;
      margin-bottom: 50px;
    }
    h2 {
      font-size: 1.4rem;
      margin-bottom: 30px;
    }
    &__uploaded {
      padding: 40px 0;
    }
    &__dropzone {
      padding: 80px 0;
      min-height: 300px;
      &__actions {
        .lis-button {
          margin: 0 20px;
        }
      }
    }
  }
}

@media screen and (max-width: $breakpoint-mobile) {
  .claim-file-uploader {
    h1 {
      font-size: 1.4rem;
      line-height: 2rem;
      padding: 0 40px;
      margin-bottom: 20px;
    }
    h2 {
      font-size: 1.2rem;
      line-height: 1.5rem;
      padding: 0 40px;
      margin-bottom: 20px;
    }
    &__uploaded {
      border-top: 1px solid var(--color-light-1);
      padding: 40px 0;
    }
    &__dropzone {
      padding: 40px 0;
      &__actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        .lis-button {
          display: flex;
        }
        .lis-button + .lis-button {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>

