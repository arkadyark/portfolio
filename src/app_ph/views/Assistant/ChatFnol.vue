<template>
  <div class="chat-form-wrapper">
    <h1>Arkady Arkhangorodsky's Engineering Design Portfolio</h1>
    <div class="chat-form">
      <div v-if="loading" class="chat-form__loading">
        <lis-loader color="#434B65"/>
      </div>
      <template v-else>
        <lis-chat-wrapper ref="chat-wrapper" :messages="messages"/>
        <chat-input
          v-if="!uploading"
          @sendMessage="sendUserMessage"
          @sendFiles="sendUserFile"
          :reqType="currentType"
          :placeholder="placeholder"
          :choices="choices"/>
        <div v-if="uploading" class="chat-form__uploading">
          <lis-loader color="#434B65"/>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';
import LisLoader from '@/components/LisLoader.vue';
import LisChatWrapper from '@/components/LisChatWrapper.vue';
import ChatInput from './ChatInput.vue';
import questions from './questions.json';

@Component({
  components: {
    ChatInput,
    LisLoader,
    LisChatWrapper,
  },
})
export default class ChatFnol extends Vue {
  private reqInfo: any = null;
  private loading: boolean = true;
  private uploading: boolean = false;
  private messages: any[] = [];
  private currentID: any = null;
  private currentType: any = {input_type: 'text'};
  private placeholder: any = null;
  private choices: any = [];
  private answers: any = {};

  public created() {
      let firstQuestion: any;
      firstQuestion = questions[0];
      this.messages.push({
        id: firstQuestion.question_id,
        author: 'bot',
        type: 'text',
        message: firstQuestion.question,
      });
      this.currentID = firstQuestion.question_id;
      this.currentType.input_type = firstQuestion.input_type;
      this.choices = firstQuestion.choices || [];
      this.loading = false;
  }

  private evaluateEquals(condition: any) {
      const vals = condition.condition['=='];
      const matches0 = vals[0].match(/\{\{(.*?)\}\}/);
      const val0 = matches0 === null ? vals[0] : this.answers[matches0[1]];
      const matches1 = vals[1].match(/\{\{(.*?)\}\}/);
      const val1 = matches1 === null ? vals[1] : this.answers[matches1[1]];
      return val0 === val1;
  }

  private getNextQuestion(message: any) {
      let next: any;
      next = questions[this.currentID - 1].next;
      if (next === 'end') {
          return null;
      }
      if (!isNaN(next)) {
          return parseInt(next, 10);
      }
      for (const condition of next) {
          if ('==' in condition.condition) {
              if (this.evaluateEquals(condition)) {
                  return condition.goto;
              }
          } else if ('OR' in condition.condition) {
              for (const innerCondition of condition.condition.OR) {
                  if (this.evaluateEquals(innerCondition)) {
                      return condition.goto;
                  }
              }
          }
      }
  }

  private sendUserFile(files: any) {
      console.log('Sending a file');
      this.sendUserMessage('File uploaded.');
  }

  private sendUserMessage(message: any) {
    this.messages.push({
      id: 'question-' + this.currentID,
      author: 'user',
      type: this.currentType.input_type,
      message,
    });
    this.answers[this.currentID] = message;

    const nextQuestionID = this.getNextQuestion(message);
    if (nextQuestionID === null) {
        this.currentType.input_type = null;
        return;
    }
    const nextQuestion = questions[nextQuestionID - 1];
    this.messages.push({
      id: nextQuestion.question_id,
      author: 'bot',
      type: 'text',
      message: nextQuestion.question,
    });
    this.currentID = nextQuestion.question_id;
    this.currentType.input_type = nextQuestion.input_type;
    this.choices = nextQuestion.choices || [];

    setTimeout(() => {
        const el = this.$refs['chat-wrapper'] as any;
        const el2 = el.$refs['chat-wrapper'] as HTMLElement;
        el2.scrollTop = el2.scrollHeight;
    }, 0);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/lis-resources.scss";

.chat-form-wrapper {
  height: calc(100% - 60px);
  width: 100%;

  h1 {
      margin-top: 18px;
      font-size: 24px;
  }
}


.chat-form {
  height: calc(100% - 60px);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  &__no-input {
    font-size: var(--font-size-1);
    padding: 20px;
    border-radius: 10px;
    background: var(--color-blue-5);
  }
  &__subtext {
    padding: 20px;
    font-size: var(--font-size-3);
    line-height: var(--font-size-2);
  }
  &__loading {
    flex: 1;
    display: flex;
    align-items: center;
  }
  &__uploading {
    padding: 30px 0;
  }
}

@media screen and (min-width: $breakpoint-mobile) {
  .chat-form {
    border-radius: 5px;
    overflow: hidden;
    height: 80%;
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid var(--color-light-1);
    box-shadow: 0 2px 20px var(--color-light-1);
  }
}
</style>

