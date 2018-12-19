<template>
  <div
    id="calendar"
    ref="calendar"
  >
    <vue-modal
      v-if="$slots.modal"
      :active="toggleModal"
      @toggle-modal="toggleModal = !toggleModal"
      @submit="modalSubmit"
    >
      <template slot="title">
        Créer un nouvel évènement
      </template>
      <slot name="modal" />
    </vue-modal>
    <div class="columns is-gapless">
      <div
        v-for="day of days.splitBy(A_DAY)"
        :key="day.start.toISO()"
        class="column"
      >
        <div class="day-title">
          {{ day.start.toLocaleString({ weekday: 'long', day: '2-digit' }) }}
        </div>
        <div class="hour-slots">
          <div class="event" v-for="(e, i) of eventsToday(day)" :style="getStyle(e, i)">
            <div class="content">
              <p>Du {{e.start.toLocaleString(DATETIME_FULL)}} au {{e.end.toLocaleString(DATETIME_FULL)}}.</p>
              <p>{{e.title}}</p>
            </div>
          </div>
          <div>
            <div
              v-for="s of day.splitBy(SPLIT_MINUTES)"
              :key="s.start.toISO()"
              class="hour-slot"
              :class="{ 'is-selected': isInRange(s.start) }"
              @mousedown="startSelectRange(s.start)"
              @mouseup="endSelectRange(s.end)"
              @mouseover="updateSelectedRange(s.end)"
              :title="s.start.toLocaleString(DATETIME_FULL)"
            >
              <template v-if="s.start.minute % 30 === 0">
                {{ s.start.toLocaleString(TIME_SIMPLE) }}
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueModal from '~/components/modal.vue';
import { DateTime, Interval, Duration } from 'luxon';

export default {
  props: {
    events: {
      type: Array,
      default: () => ([]),
    },
  },
  components: {
    vueModal,
  },
  data() {
    return {
      rangeStart: null,
      rangeEnd: null,
      toggleModal: false,
    };
  },
  computed: {
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
  },
  methods: {
    isInRange(dt) {
      return (this.rangeStart && this.rangeEnd) ? Interval.fromDateTimes(this.rangeStart, this.rangeEnd).contains(dt) : false;
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
    endSelectRange() {
      this.toggleModal = true;
      this.$emit('dates-update', [this.rangeStart, this.rangeEnd]);
      this.clearRanges();
    },
    modalSubmit() {
      this.$emit('modal-submit');
      this.toggleModal = !this.toggleModal;
    },
    getClonedEvents() {
      return this.events.map(e => Object.assign({}, e)).map(d => {
        d.start = DateTime.fromISO(d.start);
        d.end = DateTime.fromISO(d.end);
        d.interval = Interval.fromDateTimes(d.start, d.end);
        return d;
      });
    },
    eventsToday(today) {
      return this.getClonedEvents().map(ev => {
        ev.interval = today.intersection(ev.interval);
        return ev;
      }).filter(ev => ev.interval);
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
    }
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
    &:hover:not(.is-selected) {
      border-top: 1px solid $white;
    }
    &.is-selected {
        background: rgba($white, 0.1);
      &:first-child {
        border-top: 1px solid $white;
      }
      &:last-child {
        border-bottom: 1px solid $white;
      }
    }
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
</style>
