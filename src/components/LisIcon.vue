<template>
  <component v-on="$listeners" :is="`mdi-${name}`" class="lis-icon" :class="{
    'icon-sm': size === 'small'
  }"/>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MdiMenu from 'vue-material-design-icons/Menu.vue';
import MdiContentCopy from 'vue-material-design-icons/ContentCopy.vue';
import MdiImageFilterCenterFocus from 'vue-material-design-icons/ImageFilterCenterFocus.vue';
import MdiSettings from 'vue-material-design-icons/Settings.vue';
import MdiPower from 'vue-material-design-icons/Power.vue';
import MdiFileOutline from 'vue-material-design-icons/FileOutline.vue';
import MdiUpload from 'vue-material-design-icons/Upload.vue';
import MdiEmailOutline from 'vue-material-design-icons/EmailOutline.vue';
import MdiPhone from 'vue-material-design-icons/Phone.vue';
import MdiFacebookMessenger from 'vue-material-design-icons/FacebookMessenger.vue';
import MdiChat from 'vue-material-design-icons/Chat.vue';
import MdiMessageText from 'vue-material-design-icons/MessageText.vue';
import MdiSend from 'vue-material-design-icons/Send.vue';
import MdiAccountClock from 'vue-material-design-icons/AccountClock.vue';
import MdiPowerStandby from 'vue-material-design-icons/PowerStandby.vue';
import MdiFileCheck from 'vue-material-design-icons/FileCheck.vue';
import MdiTimerSand from 'vue-material-design-icons/TimerSand.vue';
import MdiCalendar from 'vue-material-design-icons/Calendar.vue';
import MdiCalendarCheck from 'vue-material-design-icons/CalendarCheck.vue';
import MdiWrenchOutline from 'vue-material-design-icons/WrenchOutline.vue';
import MdiWrench from 'vue-material-design-icons/Wrench.vue';
import MdiCreditCard from 'vue-material-design-icons/CreditCard.vue';
import MdiCheckCircle from 'vue-material-design-icons/CheckCircle.vue';
import MdiCloseCircle from 'vue-material-design-icons/CloseCircle.vue';
import MdiAlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue';
import MdiClockOutline from 'vue-material-design-icons/ClockOutline.vue';
import MdiMapMarker from 'vue-material-design-icons/MapMarker.vue';
import MdiDownload from 'vue-material-design-icons/Download.vue';
import MdiFilePdf from 'vue-material-design-icons/FilePdf.vue';
import MdiChevronDown from 'vue-material-design-icons/ChevronDown.vue';
import MdiMagnify from 'vue-material-design-icons/Magnify.vue';
import MdiForum from 'vue-material-design-icons/Forum.vue';
import MdiPencil from 'vue-material-design-icons/Pencil.vue';
import MdiCheckboxMarked from 'vue-material-design-icons/CheckboxMarked.vue';
import MdiCheckboxBlankOutline from 'vue-material-design-icons/CheckboxBlankOutline.vue';
import MdiMessageDraw from 'vue-material-design-icons/MessageDraw.vue';
import MdiAccount from 'vue-material-design-icons/Account.vue';
import MdiAccountCircle from 'vue-material-design-icons/AccountCircle.vue';
import MdiBell from 'vue-material-design-icons/Bell.vue';

@Component({
  components: {
    MdiMenu,
    MdiContentCopy,
    MdiImageFilterCenterFocus,
    MdiSettings,
    MdiPower,
    MdiFileOutline,
    MdiUpload,
    MdiEmailOutline,
    MdiPhone,
    MdiFacebookMessenger,
    MdiChat,
    MdiMessageText,
    MdiSend,
    MdiAccountClock,
    MdiPowerStandby,
    MdiFileCheck,
    MdiTimerSand,
    MdiCalendar,
    MdiCalendarCheck,
    MdiWrenchOutline,
    MdiWrench,
    MdiCreditCard,
    MdiCheckCircle,
    MdiCloseCircle,
    MdiAlertCircleOutline,
    MdiClockOutline,
    MdiMapMarker,
    MdiDownload,
    MdiFilePdf,
    MdiChevronDown,
    MdiMagnify,
    MdiForum,
    MdiPencil,
    MdiCheckboxMarked,
    MdiCheckboxBlankOutline,
    MdiMessageDraw,
    MdiAccount,
    MdiAccountCircle,
    MdiBell,
  },
})
export default class LisIcon extends Vue {
  @Prop() private name!: string;
  @Prop() private size!: string;
}
</script>

<style lang="scss">
.lis-icon {
  display: flex;
  align-items: center;  
  &.icon-sm {
    height: 1rem;
    width: 1rem;
  }
  & > .material-design-icon__svg {
    height: inherit;
    width: inherit;
  }
}
</style>
