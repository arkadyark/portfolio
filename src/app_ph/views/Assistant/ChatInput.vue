<template>
  <div class="chat-input">
    <div
      class="chat-input__text"
      v-if="inputType === 'text' || inputType === 'email' || inputType === 'phone_number' || inputType === 'faq'"
    >
      <textarea-autosize
        @focus.native="focusTextArea"
        rows="1"
        @keydown.native.enter.exact.prevent
        @keyup.native.enter.exact="sendMessage"
        @keydown.native.enter.shift.exact="() => {}"
        :max-height="120"
        :placeholder="placeholderDisplay"
        v-model="textMessage"
        class="chat-input__text__textarea focusable-input"
      ></textarea-autosize>
      <button class="chat-input__text__send-button" :class="buttonClass" @click="sendMessage">
        <lis-icon name="send" size="small"/>
      </button>
    </div>
    <div v-else-if="inputType === 'end'"></div>
    <div class="chat-input__text" v-else-if="inputType === 'multiple_choice'">
      <div class="chat-input__choice" v-for="(choice, i) in choices" @click="sendChoice(i)">
        {{choice}}
      </div>
    </div>
    <div class="chat-input__text" v-else-if="inputType === 'number'">
      <input type="number"
             class="chat-input__text__textarea focusable-input"
             @keydown.enter.exact.prevent
             @keyup.enter.exact="sendMessage"
             v-model="textMessage"
             :placeholder="placeholderDisplay" />
      <button class="chat-input__text__send-button" :class="buttonClass" @click="sendMessage">
        <lis-icon name="send" size="small"/>
      </button>
    </div>
    <div class="chat-input__file-upload" v-else-if="inputType === 'file_upload_single'">
      <p
        class="chat-input__file-upload__placeholder"
        v-if="!queuedFiles.length"
        @click="handleFileSelect"
      >Upload file</p>
      <div class="chat-input__file-upload__previews" v-else-if="queuedFiles.length">
        <transition-group name="fade-in" appear>
          <lis-file-thumbnail v-for="file in queuedFiles" :key="file.name" :file="file"/>
        </transition-group>
      </div>
      <div class="chat-input__file-upload__controls">
        <button class="chat-input__file-upload__browse-files" @click="handleFileSelect">
          <lis-icon name="file-outline" size="small"/>
        </button>
        <button
          class="chat-input__file-upload__send-button"
          v-if="queuedFiles.length"
          @click="sendFile"
        >
          <lis-icon name="send" size="small"/>
        </button>
        <input ref="fileInput" type="file" @change="addFiles" hidden>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import LisIcon from '@/components/LisIcon.vue';
import LisButton from '@/components/LisButton.vue';
import LisFileThumbnail from '@/components/LisFileThumbnail.vue';

@Component({
  components: {
    LisIcon,
    LisButton,
    LisFileThumbnail,
  },
})
export default class ChatInput extends Vue {
  public textMessage: string = '';
  public isDisabled: boolean = false;
  public fileInput: HTMLElement | null = null;
  public queuedFiles: File[] = [];
  public uploading: boolean = false;

  @Prop({ type: Object }) private reqType: any;
  @Prop({ type: String }) private placeholder: any;
  @Prop({ type: Array }) private choices: any;

  @Watch('inputType', {immediate: true})
  private focusInput(val: any) {
    // Next tick waits for when the next input is rendered and available in DOM
    this.$nextTick(() => {
      // We grab the input element by class (Because ref returns Vue component and not HTML element)
      const chatinput = this.$el.querySelector('.focusable-input') as any;
      if (chatinput) {
        chatinput.focus();
      }
    });
  }

  get inputType() {
    if (this.reqType) {
      return this.reqType.input_type;
    }
    return 'faq';
  }

  get placeholderDisplay() {
      if (this.inputType === 'number') {
          return this.placeholder || '0';
      } else {
          return this.placeholder || 'Type here';
      }
  }

  get buttonClass() {
    let btnClass = 'disabled';
    if (!this.isDisabled && this.textMessage.length > 0) {
      btnClass = 'has-text';
    } else {
      btnClass = 'empty';
    }
    return btnClass;
  }

  private sendMessage() {
    if (this.textMessage !== '') {
      this.$emit('sendMessage', this.textMessage);
      this.textMessage = '';
    }
  }

  private sendChoice(index: number) {
    this.textMessage = this.choices[index];
    this.sendMessage();
  }

  private handleFileSelect() {
    const fileInput: HTMLElement = this.$refs.fileInput as HTMLElement;
    fileInput.click();
  }

  private async addFiles(e: any) {
    const fileInput: HTMLElement = this.$refs.fileInput as HTMLElement;
    const files = e.target.files;
    for (const file of files) {
      this.queuedFiles.push(file);
      // const file = await this.readURL(files[i]);
      // console.log('file', file);
    }
    // console.log(files);
  }

  private sendFile() {
    console.log(this.queuedFiles);
    this.$emit('sendFiles', this.queuedFiles);
  }

  private focusTextArea() {
    // To prevent scrolling to top on mobile when keyboard shows up
    const height = document.body.offsetHeight;
    window.scrollTo(0, height);
    document.body.scrollTop = height;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/lis-resources.scss";

.chat-input {
  &__choice {
    background-color: var(--color-light-2);
    border-radius: 25px;
    padding: 12px 18px;
    margin: 5px;
    line-height: 36px;
    cursor: pointer !important;
  }
  &__text {
    overflow-x: auto;
    white-space: nowrap;
    background: var(--color-white-1);
    min-height: 60px;
    position: relative;
    display: flex;
    flex-direction: row;
    box-shadow: 0 -2px 4px var(--color-light-1);
    &__textarea {
      flex: 1;
      padding: 20px;
      border: none;
      box-sizing: border-box;
      resize: none;
      font-size: var(--font-size-3);
      color: var(--color-blue-2);
      margin-right: 40px;
    }
    &__send-button {
      position: absolute;
      top: 10px;
      right: 10px;
      color: var(--color-white-1);
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      transition: all 0.15s;
      &:active {
        transform: scale(0.6);
      }
      &.disabled {
        .lis-icon {
          background: var(--color-light-1);
        }
      }
      &.has-text {
        .lis-icon {
          background: var(--color-blue-3);
        }
      }
      &.empty {
        .lis-icon {
          background: var(--color-blue-4);
        }
      }
      .lis-icon {
        width: 12px;
        height: 12px;
        font-size: 12px;
        border-radius: 50%;
        padding: 7px;
      }
    }
  }
  &__file-upload {
    background: var(--color-white-1);
    min-height: 60px;
    position: relative;
    display: flex;
    flex-direction: row;
    box-shadow: 0 -2px 4px var(--color-light-1);
    &__previews {
      padding: 20px;
      border-bottom: 1px solid var(--color-light-1);
    }
    &__controls {
      padding: 20px 0;
    }
    .lis-file-thumbnail {
      width: 75px;
      height: 75px;
    }
    &__placeholder {
      padding: 20px;
      font-size: var(--font-size-3);
      line-height: var(--font-size-2);
      color: var(--color-blue-2);
      cursor: pointer;
      &:hover {
        color: var(--color-blue-3);
      }
    }
    &__browse-files {
      cursor: pointer;
      position: absolute;
      top: 17px;
      right: 17px;
      color: var(--color-white-1);
      background: var(--color-blue-3);
      width: 25px;
      height: 25px;
      border: none;
      border-radius: 50%;
      .lis-icon {
        width: 12px;
        height: 12px;
        transform: translate(1px, -1px);
      }
    }
    &__send-button {
      position: absolute;
      top: 17px;
      right: 17px;
      color: var(--color-white-1);
      width: 25px;
      height: 25px;
      border: none;
      border-radius: 50%;
      background: var(--color-blue-3);
      .lis-icon {
        transform: translate(1px, -1px) rotate(-15deg);
      }
    }
  }
}
</style>

