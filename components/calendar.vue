<template>
  <div
    id="calendar"
    ref="calendar"
    class="box"
  >
    <vue-modal
      v-if="$slots.modal"
      :active="modalStatus"
      :with-background="false"
      @toggle-modal="$emit('modal-toggle', !modalStatus)"
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
      <template
        v-if="$slots['modal-submit']"
        slot="submit"
      >
        <slot name="modal-submit" />
      </template>
    </vue-modal>
    <div class="columns is-gapless">
      <div class="column is-narrow">
        <div class="day-title">
&nbsp;
        </div>
        <div
          v-for="s of currentDay.splitBy(SPLIT_MINUTES)"
          :key="s.start.toISO()"
          class="hour-slot"
        >
          {{ s.start.toLocaleString(TIME_SIMPLE) }}
        </div>
      </div>
      <div
        v-if="withEmptyCol"
        class="column"
      >
        <div class="day-title">
          Requêtes utilisateur {{eventsToday(null)}}
        </div>
        <div class="hour-slots">
          <div
            v-for="(e, i) of eventsToday(null)"
            :key="i"
            class="event"
            :class="{ 'event-default': !withoutDefaultEventStyle }"
            :style="getStyle(e, eventsToday(null))"
            @click="clickEvent(e)"
          >
            <slot
              name="event-card"
              :event="e"
            >
              <p>Du {{ e.start.toLocaleString(DATETIME_FULL) }} au {{ e.end.toLocaleString(DATETIME_FULL) }}.</p>
              <p>{{ e.title }}</p>
            </slot>
          </div>
          <div>
            <div
              v-for="s of currentDay.splitBy(SPLIT_MINUTES)"
              :key="s.start.toISO()"
              class="hour-slot"
              :title="s.start.toLocaleString(DATETIME_FULL)"
            />
          </div>
        </div>
      </div>
      <div
        v-for="col of columns"
        :key="col.id"
        class="column"
      >
        <div class="day-title">
          <slot
            name="col-title"
            class="day-title"
            :col="col"
          >
            {{ col.start ? col.start.toLocaleString({ weekday: 'long', day: '2-digit' }) : '' }}
          </slot>
        </div>
        <div class="hour-slots">
          <div
            class="current-time"
            :style="{ top: `${percentTimeChange}%` }"
            :class="{ 'is-today': isToday(col.start ? col : currentDay) }"
          />
          <div
            v-for="(e, i) of eventsToday(col)"
            :key="i"
            class="event"
            :class="{ 'event-default': !withoutDefaultEventStyle }"
            :style="getStyle(e, eventsToday(col))"
            @click="clickEvent(e)"
          >
            <slot
              name="event-card"
              :event="e"
            >
              <p>Du {{ e.start.toLocaleString(DATETIME_FULL) }} au {{ e.end.toLocaleString(DATETIME_FULL) }}.</p>
              <p>{{ e.title }}</p>
            </slot>
          </div>
          <div>
            <div
              v-for="s of (col.start ? col : currentDay).splitBy(SPLIT_MINUTES)"
              :key="s.start.toISO()"
              class="hour-slot"
              :class="{
                'is-selected': isInRange(s.start, col),
                'is-closed': col.start ? (openingHoursFeature && !isOpen(s.start)) : !isOpen(s, col.availabilities)
              }"
              :title="s.start.toLocaleString(DATETIME_FULL)"
              @mousedown="startSelectRange(s.start, col.start ? null : col)"
              @mouseup="endSelectRange(col.start ? null : col)"
              @mouseover="updateSelectedRange(s.end)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime, Interval, Duration } from 'luxon';
import OpeningHours from 'opening_hours';
import vueModal from '~/components/modal.vue';

const SECONDS_IN_A_DAY = 60 * 60 * 24;
const A_DAY = Duration.fromObject({ days: 1 });

export default {
  components: {
    vueModal,
  },
  props: {
    withEmptyCol: {
      type: Boolean,
      default: false,
    },
    withoutDefaultEventStyle: {
      type: Boolean,
      default: false,
    },
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
      type: Date,
      default: () => new Date(),
    },
    modalStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentTime: this.currentDateTime ? this.currentDateTime.toJSDate() : new Date(),
      rangeStart: null,
      rangeEnd: null,
      rangeCol: null,
    };
  },
  computed: {
    columns() {
      return this.scheduleWith ? this.scheduleWith : this.days.splitBy(A_DAY);
    },
    currentDateTime() {
      return DateTime.fromJSDate(this.currentDate);
    },
    currentDay() {
      return Interval.fromDateTimes(this.currentDateTime.startOf('days'), this.currentDateTime.endOf('days'));
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
      const date = this.currentDateTime;
      return Interval.fromDateTimes(
        date.startOf(scale),
        date.endOf(scale),
      );
    },
    SPLIT_MINUTES() {
      return Duration.fromObject({ minutes: 30 });
    },
    TIME_SIMPLE() {
      return DateTime.TIME_SIMPLE;
    },
    DATETIME_FULL() {
      return DateTime.DATETIME_FULL;
    },
    hourSlotHeight() {
      return 25;
    },
    openingHoursFeature() {
      return this.$listeners && this.$listeners['opening-hours-update'];
    },
    percentTimeChange() {
      const current = this.currentTime;
      const startOfDay = this.currentDateTime.startOf('days').toMillis();
      const diff = (current - startOfDay) / 1000;
      return (diff / SECONDS_IN_A_DAY) * 100;
    },
  },
  watch: {
    currentTime() {
      this.$emit('time-pace', this.currentTime);
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
      this.currentTime = new Date();
    }, 3000);
    this.$emit('time-pace', this.currentTime);
  },
  methods: {
    isOpen(d, availabilities) {
      if (availabilities) {
        if (availabilities.length < 1) {
          return false;
        }
        return availabilities.reduce(
          (result, interval) => (result
            || Interval.fromDateTimes(DateTime.fromISO(interval.s), DateTime.fromISO(interval.e)).engulfs(d)
          ),
          false,
        );
      }
      if (!this.parsedOpeningHours) {
        return false;
      }
      return this.parsedOpeningHours.getState(d.toJSDate());
    },

    isInRange(dt, col) {
      if (!Interval.isInterval(col) && (this.rangeCol || {}).id !== col.id) {
        return false;
      }
      return (this.rangeStart && this.rangeEnd)
        ? Interval.fromDateTimes(this.rangeStart, this.rangeEnd).contains(dt)
        : false;
    },

    clearRanges() {
      this.rangeStart = null;
      this.rangeEnd = null;
      this.rangeCol = null;
    },

    startSelectRange(dt, col) {
      this.$emit('init-event');
      this.rangeStart = dt;
      if (col) {
        this.rangeCol = col;
      }
    },

    updateSelectedRange(dt) {
      if (this.rangeStart) {
        this.rangeEnd = dt;
      }
    },

    endSelectRange(col = null) {
      const start = this.currentDateTime.diff(this.rangeStart).valueOf() > 0
      && this.currentDateTime.diff(this.rangeStart).valueOf() < this.SPLIT_MINUTES.valueOf()
        ? this.currentDateTime : this.rangeStart;
      if (this.openingHoursFeature) {
        this.toggleOpeningHours(this.rangeStart, this.rangeEnd);
      } else {
        this.$emit('modal-toggle', true);
        this.$emit('dates-update', [start, this.rangeEnd || this.rangeStart.plus(this.SPLIT_MINUTES)], col);
      }
      this.clearRanges();
    },

    modalSubmit() {
      return this.$emit('modal-submit');
    },

    clickEvent(event) {
      return this.$emit('click-event', event);
    },

    getClonedEvents() {
      return this.events.map((e) => ({ ...e })).map((d) => {
        const date = d;
        date.start = DateTime.fromISO(d.start);
        date.end = DateTime.fromISO(d.end);
        date.interval = Interval.fromDateTimes(d.start, d.end);
        return date;
      });
    },

    eventsToday(col) {
      if (Interval.isInterval(col)) {
        return this.getClonedEvents()
          .map((ev) => {
            const event = ev;
            event.interval = col.intersection(ev.interval);
            return event;
          })
          .filter((ev) => !!ev.interval);
      }
      if (col === null) {
        return this.getClonedEvents()
          .filter((ev) => typeof ev.driver === 'undefined' || ev.driver === null || ev.driver.id === null);
      }
      // todo: make this rule generic
      return this.getClonedEvents()
        .filter((ev) => {
          const end = DateTime.fromISO(ev.end);
          return ev.driver && ev.driver.id === col.id && end.hasSame(this.currentDateTime, 'day');
        });
    },

    toggleOpeningHours(start, end) {
      const current = Interval.fromDateTimes(start, end);
      const intervals = this.weekOpeningHoursIntervals;
      intervals.push(current);
      // @todo: Recursive reduce intervals
      const oh = this.days
        .splitBy(A_DAY).map((d) => intervals
          .map((i) => i.intersection(d))
          .filter((i) => !!i)
          .map((i) => {
            const day = d.start.toFormat('DDDD', { locale: 'en-US' }).substring(0, 2);
            const startTime = i.start.toLocaleString(DateTime.TIME_24_SIMPLE);
            const endTime = i.end.toLocaleString(DateTime.TIME_24_SIMPLE);
            return `${day} ${startTime}-${endTime}`;
          })
          .reduce((acc, s) => (acc.length ? [acc, s].join(';') : s), ''))
        .filter((i) => i !== '')
        .reduce((acc, s) => (acc.length ? [acc, s].join(';') : s), '');
      this.$emit('opening-hours-update', oh);
    },

    getStyle(e, events) {
      const overlaping = events.filter(({ interval }) => e.interval.overlaps(interval));
      const overlapingEventIndex = overlaping.findIndex((ev) => ev.id === e.id);
      const rowsToCover = e.interval.splitBy(this.SPLIT_MINUTES);
      const rowsToSkip = Interval
        .fromDateTimes(e.interval.start.startOf('days'), e.interval.start)
        .splitBy(this.SPLIT_MINUTES);
      if (rowsToSkip[rowsToSkip.length - 1].toDuration().valueOf() - this.SPLIT_MINUTES.valueOf() < 0) {
        rowsToSkip.splice(-1, 1);
      }
      const height = this.hourSlotHeight * rowsToCover.length;
      const offset = this.hourSlotHeight * rowsToSkip.length;
      return {
        height: `${height}px`,
        top: `${offset}px`,
        width: `calc(${100 / overlaping.length}% - 0.7rem)`,
        left: `calc(${(100 / overlaping.length) * overlapingEventIndex}%)`,
      };
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
    padding: 0 $size-small/2;
  }

  .hour-slots {
    position: relative;
  }

  .hour-slot {
    font-size: $size-small;
    font-weight: $weight-light;
    user-select: none;
    height: 25px;
    cursor: crosshair;
    &:hover, &.is-selected {
      background: rgba($primary, 0.4);
    }
    border-bottom: 1px solid $gray;
  }

  .is-closed {
    background: $light-gray;
  }

  .event {
    display: block;
    position: absolute;
    background: $white;
    cursor: pointer;
    left: 0;
    right: 0;
    margin: 0 $size-small;
    font-size: $size-small;
    pointer-events: all;
    &:hover {
      z-index: 100;
    }
    &-default {
      overflow-y: scroll;
      border: 1px solid $primary;
      padding: 5px;
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
