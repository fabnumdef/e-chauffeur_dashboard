<template>
  <div
    id="calendar"
    ref="calendar"
  >
    <vue-modal
      v-if="$slots.modal"
      :active="toggleModal"
      :with-background="false"
      @toggle-modal="toggleModal = !toggleModal"
      @submit="modalSubmit"
    >
      <template slot="title">
        <slot
          v-if="$slots.title"
          name="title"
        />
        <template v-else>
          Créer un nouvel évènement
        </template>
      </template>
      <slot name="modal" />
    </vue-modal>
    <div class="columns is-gapless">
      <template v-if="scheduleWith">
        <div
          v-for="col of scheduleWith"
          :key="col.id"
          class="column"
        >
          <div class="day-title">
            {{ col.name }}
          </div>
          <div class="hour-slots">
            <div
              class="current-time"
              :style="{ top: `${percentTimeChange}%` }"
              :class="{ 'is-today': isToday(currentDay) }"
            />
            <div
              v-for="(e, i) of eventsToday(currentDay)"
              :key="i"
              class="event"
              :style="getStyle(e, i)"
            >
              <div class="content">
                <p>Du {{ e.start.toLocaleString(DATETIME_FULL) }} au {{ e.end.toLocaleString(DATETIME_FULL) }}.</p>
                <p>{{ e.title }}</p>
              </div>
            </div>
            <div>
              <div
                v-for="s of currentDay.splitBy(SPLIT_MINUTES)"
                :key="s.start.toISO()"
                class="hour-slot"
                :class="{
                  'is-selected': isInRange(s.start),
                  'is-closed': !isOpen(s, col.availabilities)
                }"
                :title="s.start.toLocaleString(DATETIME_FULL)"
                @mousedown="startSelectRange(s.start)"
                @mouseup="endSelectRange($event, col)"
                @mouseover="updateSelectedRange(s.end)"
              >
                <template v-if="s.start.minute % 30 === 0">
                  {{ s.start.toLocaleString(TIME_SIMPLE) }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-for="day of days.splitBy(A_DAY)"
          :key="day.start.toISO()"
          class="column"
        >
          <div class="day-title">
            {{ day.start.toLocaleString({ weekday: 'long', day: '2-digit' }) }}
          </div>
          <div class="hour-slots">
            <div
              class="current-time"
              :style="{top: `${percentTimeChange}%` }"
              :class="{'is-today': isToday(day) }"
            />
            <div
              v-for="(e, i) of eventsToday(day)"
              :key="i"
              class="event"
              :style="getStyle(e, i)"
            >
              <div class="content">
                <p>Du {{ e.start.toLocaleString(DATETIME_FULL) }} au {{ e.end.toLocaleString(DATETIME_FULL) }}.</p>
                <p>{{ e.title }}</p>
              </div>
            </div>
            <div>
              <div
                v-for="s of day.splitBy(SPLIT_MINUTES)"
                :key="s.start.toISO()"
                class="hour-slot"
                :class="{
                  'is-selected': isInRange(s.start),
                  'is-closed': openingHoursFeature && !isOpen(s.start)
                }"
                :title="s.start.toLocaleString(DATETIME_FULL)"
                @mousedown="startSelectRange(s.start)"
                @mouseup="endSelectRange"
                @mouseover="updateSelectedRange(s.end)"
              >
                <template v-if="s.start.minute % 30 === 0">
                  {{ s.start.toLocaleString(TIME_SIMPLE) }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import vueModal from '~/components/modal.vue';
import { DateTime, Interval, Duration } from 'luxon';
import OpeningHours from 'opening_hours';

const SECONDS_IN_A_DAY = 60 * 60 * 24;

export default {
  components: {
    vueModal,
  },
  props: {
    events: {
      type: Array,
      default: () => ([]),
    },
    openingHours: {
      type: String,
      default: null,
    },
    withCurrentTime: {
      type: Boolean,
      default: false,
    },
    scheduleWith: {
      type: Array,
      default: null,
    },
    currentDate: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      currentTime: Date.now(),
      rangeStart: null,
      rangeEnd: null,
      toggleModal: false,
    };
  },
  computed: {
    currentDay() {
      return Interval.fromDateTimes(DateTime.local().startOf('days'), DateTime.local().endOf('days'));
    },
    parsedOpeningHours() {
      try {
        return new OpeningHours(this.openingHours);
      } catch (e) {
        return null;
      }
    },
    weekOpeningHoursIntervals() {
      if (!this.parsedOpeningHours) {
        return [];
      }
      return this.parsedOpeningHours
        .getOpenIntervals(this.days.start.toJSDate(), this.days.end.toJSDate())
        .map(([start, end]) => Interval.fromDateTimes(start, end));
    },
    days() {
      const scale = 'week';
      const date = DateTime.local();
      return Interval.fromDateTimes(
        date.startOf(scale),
        date.endOf(scale),
      );
    },
    A_DAY() {
      return Duration.fromObject({ days: 1 });
    },
    SPLIT_MINUTES() {
      return Duration.fromObject({ minutes: 10 });
    },
    TIME_SIMPLE() {
      return DateTime.TIME_SIMPLE;
    },
    DATETIME_FULL() {
      return DateTime.DATETIME_FULL;
    },
    hourSlotHeight() {
      return 7.5;
    },
    openingHoursFeature() {
      return this.$listeners && this.$listeners['opening-hours-update'];
    },
    percentTimeChange() {
      const current = this.currentTime;
      const startOfDay = DateTime.local().startOf('days').toMillis();
      const diff = (current - startOfDay) / 1000;
      return diff / SECONDS_IN_A_DAY * 100;
    },
  },
  mounted() {
    if (this.$el && this.$el.querySelector) {
      const el = this.$el.querySelector('.current-time');
      if (el && el.scrollIntoView) {
        el.scrollIntoView();
      }
    }
  },
  created() {
    setInterval(() => {
      this.currentTime = Date.now();
    }, 30000);
  },
  methods: {
    isOpen(d, availabilities) {
      if (availabilities) {
        if (availabilities.length < 1) {
          return false;
        }
        return availabilities.reduce((result, interval) => (result || interval.engulfs(d)), false);
      }
      if (!this.parsedOpeningHours) {
        return false;
      }
      return this.parsedOpeningHours.getState(d.toJSDate());
    },

    isInRange(dt) {
      return (this.rangeStart && this.rangeEnd)
        ? Interval.fromDateTimes(this.rangeStart, this.rangeEnd).contains(dt)
        : false;
    },

    clearRanges() {
      this.rangeStart = null;
      this.rangeEnd = null;
    },

    startSelectRange(dt) {
      this.rangeStart = dt;
    },

    updateSelectedRange(dt) {
      if (this.rangeStart) {
        this.rangeEnd = dt;
      }
    },

    endSelectRange({ shiftKey = false } = {}, col = null) {
      if (this.openingHoursFeature && shiftKey) {
        this.toggleOpeningHours(this.rangeStart, this.rangeEnd);
      } else {
        this.toggleModal = true;
        this.$emit('dates-update', [this.rangeStart, this.rangeEnd], col);
      }
      this.clearRanges();
    },

    modalSubmit() {
      this.$emit('modal-submit');
      this.toggleModal = !this.toggleModal;
    },

    getClonedEvents() {
      return this.events.map(e => Object.assign({}, e)).map((d) => {
        const date = d;
        date.start = DateTime.fromISO(d.start);
        date.end = DateTime.fromISO(d.end);
        date.interval = Interval.fromDateTimes(d.start, d.end);
        return date;
      });
    },

    eventsToday(today) {
      return this.getClonedEvents().map((ev) => {
        const event = ev;
        event.interval = today.intersection(ev.interval);
        return event;
      }).filter(ev => ev.interval);
    },

    toggleOpeningHours(start, end) {
      const current = Interval.fromDateTimes(start, end);
      const intervals = this.weekOpeningHoursIntervals;
      intervals.push(current);
      // @todo: Recursive reduce intervals
      const oh = this.days
        .splitBy(this.A_DAY).map(d => intervals
          .map(i => i.intersection(d))
          .filter(i => !!i)
          .map((i) => {
            const day = d.start.toFormat('DDDD', { locale: 'en-US' }).substring(0, 2);
            const startTime = i.start.toLocaleString(DateTime.TIME_24_SIMPLE);
            const endTime = i.end.toLocaleString(DateTime.TIME_24_SIMPLE);
            return `${day} ${startTime}-${endTime}`;
          })
          .reduce((acc, s) => (acc.length ? [acc, s].join(';') : s), ''))
        .filter(i => i !== '')
        .reduce((acc, s) => (acc.length ? [acc, s].join(';') : s), '');
      this.$emit('opening-hours-update', oh);
    },

    getStyle(e, count = 0) {
      const rowsToCover = e.interval.splitBy(this.SPLIT_MINUTES);
      const rowsToSkip = Interval
        .fromDateTimes(e.interval.start.startOf('days'), e.interval.start)
        .splitBy(this.SPLIT_MINUTES);
      const height = this.hourSlotHeight * rowsToCover.length;
      const offset = this.hourSlotHeight * rowsToSkip.length;
      const rightMargin = count * (10 + 1);
      return { height: `${height}px`, top: `${offset}px`, right: `${rightMargin}px` };
    },

    isToday(day) {
      const today = DateTime.local();
      return today.startOf('days').toMillis() === day.start.toMillis();
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/css/head";

  .column {
    border-right: 1px solid $white;
    &:last-child {
      border-right: none;
    }
  }
  #calendar {
    overflow-y: scroll;
    height: 500px;
  }

  .day-title {
    position: sticky;
    top: 0;
    z-index: 1;
    background: $primary;
  }

  .hour-slots {
    position: relative;
  }

  .hour-slot {
    font-size: $size-small;
    font-weight: $weight-light;
    user-select: none;
    height: 7.5px;
    cursor: crosshair;
    &:hover, &.is-selected {
      background: rgba($white, 0.1);
    }
  }

  .is-closed {
    background: gray;
  }

  .event {
    display: block;
    max-width: 0;
    position: absolute;
    background: $primary;
    right: 0;
    cursor: pointer;
    overflow: hidden;
    transition: all 150ms linear;
    padding: 5px;
    font-size: $size-small;

    > .content {
      overflow: hidden;
    }

    &:hover {
      width: auto;
      max-width: 250px;
      height: auto !important;
      z-index: 2;
    }
  }

  .current-time {
    height: 1px;
    background: $yellow;
    position: absolute;
    width: 100%;
    &.is-today {
      background: $red
    }
  }
</style>
