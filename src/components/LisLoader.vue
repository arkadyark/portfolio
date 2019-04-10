<template functional>
  <div class="lis-loader">
    <div class="bounce1" :style="{backgroundColor: props.color}"/>
    <div class="bounce2" :style="{backgroundColor: props.color}"/>
    <div class="bounce3" :style="{backgroundColor: props.color}"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class LisLoader extends Vue {
  @Prop({type: String}) private color!: string;
}
</script>

<style lang="scss" scoped>
.lis-loader {
  margin: 0 auto;
  width: 70px;
  text-align: center;

  & > div {
    width: 10px;
    height: 10px;
    background-color: #fff;
    margin: 0 4px;
    border-radius: 100%;
    display: inline-block;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  & .bounce1 {
    animation-delay: -0.32s;
  }

  & .bounce2 {
    animation-delay: -0.16s;
  }

  @keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
    }
  }
}
</style>
