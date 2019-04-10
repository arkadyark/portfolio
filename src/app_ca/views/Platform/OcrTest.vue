<template>
  <div class="ocr-test">
    <div class="ocr-test__images" ref="panzoom">
      <div>
        <img ref="orig-img" src="/img/ocr_test.jpg">
      </div>
      <div v-if="scaleRatio" class="overlay-img">
        <img ref="overlay-img" src="/img/ocr_test.jpg">
        <div
          v-for="(line, i) in ocrData.recognitionResult.lines"
          :key="i"
          class="line"
          :style="{
          left: line.boundingBox[0] * scaleRatio + 'px',
          top: line.boundingBox[1] * scaleRatio + 'px',
          width: (line.boundingBox[2] - line.boundingBox[0]) * scaleRatio + 'px',
          whiteSpace: 'nowrap',
          color: '#000',
          fontSize: (line.boundingBox[5] - line.boundingBox[1] + line.boundingBox[7] - line.boundingBox[3]) / 2 * scaleRatio + 'px',
          backgroundColor: 'rgba(255,255,255,0.5)'
        }"
        >
          <p>{{line.text}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ocrTestData from '../../ocr_test_data';
import panzoom from 'panzoom';

const getRealImgSize = (imgSrc: any) => {
  return new Promise((resolve, reject) => {
    const newImg = new Image();
    let width = null;
    let height = null;

    newImg.onload = function() {
      height = newImg.height;
      width = newImg.width;
      resolve([width, height]);
    };

    newImg.src = imgSrc; // this must be done AFTER setting onload
  });
};

@Component({
  components: {},
})
export default class OcrTest extends Vue {
  private ocrData: any = ocrTestData;
  private scaleRatio: number | null = null;
  private origSize: number[] = [];
  private clientSize: number[] = [];

  public created() {
    const realSizes = getRealImgSize('/img/ocr_test.jpg');
    realSizes.then(([width, height]) => {
      this.origSize = [width, height];
      console.log('Real sizes', this.origSize);

      if (this.clientSize[0]) {
        const ratioWidth = this.clientSize[0] / this.origSize[0];
        const ratioHeight = this.clientSize[1] / this.origSize[1];
        this.scaleRatio = ratioWidth;
      }
    });
  }

  public mounted() {
    const img = this.$refs['orig-img'] as HTMLImageElement;
    setTimeout(() => {
      const width = img.clientWidth;
      const height = img.clientHeight;
      this.clientSize = [width, height];
      console.log('Scaled sizes', this.clientSize);

      if (this.origSize[0]) {
        const ratioWidth = this.clientSize[0] / this.origSize[0];
        const ratioHeight = this.clientSize[1] / this.origSize[1];
        this.scaleRatio = ratioWidth;
      }

      // this.initPanzoom();
    }, 0);
  }

  public initPanzoom() {
    // just grab any DOM element
    const area = this.$refs.panzoom as HTMLElement;

    // And pass it to panzoom
    panzoom(area, {
      onDoubleClick(e) {
        // `e` - is current double click event.

        return false; // tells the library to not preventDefault, and not stop propagation
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.ocr-test {
  display: flex;
  flex: 1;
  align-items: center;
  overflow: hidden;
  &__images {
    display: flex;
    width: 80%;
    margin: 0 auto;
    div {
      width: 50%;
      position: relative;
    }
    img {
      position: relative;
      width: 100%;
    }
    .line {
      position: absolute;
    }
    .overlay-img {
      &:hover {
        img {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>

