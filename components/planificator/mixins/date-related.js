import { DateTime } from 'luxon';

const START_DAY_HOUR = 0;
const END_DAY_HOUR = 24;
const STEP = 30;

export default () => ({
  computed: {
    startDayHour() {
      return (this.campus && this.campus.workedHours)
        ? this.campus.workedHours.start : START_DAY_HOUR;
    },
    endDayHour() {
      return (this.campus && this.campus.workedHours)
        ? this.campus.workedHours.end : END_DAY_HOUR;
    },
    step() {
      return (this.campus && this.campus.defaultRideDuration)
        ? this.campus.defaultRideDuration : STEP;
    },
  },
  methods: {
    getFormatedDate(date, unit = 'day') {
      const dt = DateTime.fromJSDate(date);
      let formatedDate = '';
      if (unit === 'day') {
        formatedDate = dt.setLocale('fr').toFormat('cccc dd LLLL');
      } else {
        formatedDate = dt.setLocale('fr').toFormat('LLLL y');
      }
      return formatedDate;
    },
    viewChange(obj) {
      if (obj.view === 'day') {
        this.day = obj.startDate;
      }
      this.$emit('view-change', obj);
    },
  },
});
