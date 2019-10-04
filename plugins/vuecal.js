import Vue from 'vue';
import VueCal from '@qonfucius/vue-cal';
import { DateTime } from 'luxon';

Vue.component('VueCal', VueCal);
Vue.prototype.$vuecal = (STEP = 60) => ({
  getFloorMinute(minute) {
    const numberOfStep = Math.floor(60 / STEP);
    let res = 0;
    for (let i = 1; i <= numberOfStep; i += 1) {
      const currentStep = STEP * i;
      if (currentStep > minute) {
        break;
      }
      res = currentStep;
    }
    return res;
  },
  getCeilMinute(minute) {
    const numberOfStep = Math.floor(60 / STEP);
    let res = 0;
    for (let i = 0; i <= numberOfStep; i += 1) {
      const currentStep = STEP * i;
      if (currentStep >= minute) {
        res = currentStep;
        break;
      }
    }
    return res;
  },
  getVueCalFloorDateFromISO(date) {
    const exactDate = DateTime.fromISO(date);
    return this.getVueCalFromDatetime(DateTime.fromObject({
      year: exactDate.year,
      month: exactDate.month,
      day: exactDate.day,
      hour: exactDate.hour,
      minute: this.getFloorMinute(exactDate.minute),
    }));
  },
  getVueCalCeilDateFromISO(date) {
    const exactDate = DateTime.fromISO(date);
    const minute = this.getCeilMinute(exactDate.minute);
    return this.getVueCalFromDatetime(DateTime.fromObject({
      year: exactDate.year,
      month: exactDate.month,
      day: exactDate.day,
      hour: minute === 60 ? exactDate.hour + 1 : exactDate.hour,
      minute: minute === 60 ? 0 : minute,
    }));
  },
  getDateTimeFloorFromVueCal(date) {
    const exactDate = this.getDatetimeFromVueCal(date);
    const now = DateTime.local();
    let minute = this.getFloorMinute(exactDate.minute);
    if (now.hasSame(exactDate, 'year') && now.hasSame(exactDate, 'month') && now.hasSame(exactDate, 'hour')
    && this.getFloorMinute(now.minute) === minute) {
      ({ minute } = now);
    }
    return DateTime.fromObject({
      year: exactDate.year,
      month: exactDate.month,
      day: exactDate.day,
      hour: exactDate.hour,
      minute,
    });
  },
  getDateTimeCeilFromVueCal(date) {
    const exactDate = this.getDatetimeFromVueCal(date);
    const minute = this.getCeilMinute(exactDate.minute);
    return DateTime.fromObject({
      year: exactDate.year,
      month: exactDate.month,
      day: exactDate.day,
      hour: minute === 60 ? exactDate.hour + 1 : exactDate.hour,
      minute: minute === 60 ? 0 : minute,
    });
  },
  getVueCalFromDatetime(datetime) {
    return datetime.setLocale('fr')
      .toFormat('yyyy-LL-dd HH:mm');
  },
  getDatetimeFromVueCal(date) {
    return DateTime.fromFormat(date, 'yyyy-LL-dd HH:mm');
  },
});
