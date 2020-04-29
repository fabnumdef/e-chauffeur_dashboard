<template>
  <div class="calendar column">
    <client-only>
      <vue-cal
        default-view="week"
        locale="fr"
        hide-view-selector
        watch-real-time
        dom-cells
        :hide-weekdays="hideWeekDays"
        :time-from="startDayHour * 60"
        :time-to="endDayHour * 60"
        :time-step="STEP"
        :time-cell-height="35"
        :events="events"
        :disable-views="['years', 'year', 'month', 'day']"
        :on-event-click="openEdit"
        :min-event-width="75"
        :selected-date="shouldUseSelectedDate ? selectedDate : ''"
        @click-and-release="openCreate"
        @view-change="viewChange"
      >
        <template #event-renderer="{ event: { content } }">
          <div
            class="drop"
            :class="{'dropzone': isGrabbing}"
            @dragover.prevent
            @drop.prevent="drop($event, content)"
          >
            <header>
              <span class="hours">
                {{ content.start.toLocaleString(TIME_SIMPLE) }} - {{ content.end.toLocaleString(TIME_SIMPLE) }}
              </span>
              <span class="is-pulled-right">
                <fa-icon icon="user-circle" /> <span v-if="content.drivers">
                  {{ content.drivers.length }}({{ drivers.data.length }})
                </span>
              </span>
            </header>
            <ul class="drivers-list">
              <li
                v-for="(driver, index) of content.drivers"
                :key="index"
              >
                <span v-if="driver.firstname || driver.lastname">{{ driver.firstname }} {{ driver.lastname }}</span>
                <span v-else>{{ driver.id }}</span>
              </li>
            </ul>
          </div>
        </template>
      </vue-cal>
    </client-only>
  </div>
</template>

<script>
import { DateTime } from 'luxon';
import { mapGetters } from 'vuex';

const STEP = 60;
const START_DAY_HOUR = 0;
const END_DAY_HOUR = 24;

export default {
  props: {
    events: {
      type: Array,
      default: () => ([]),
    },
    drivers: {
      type: Object,
      default: () => ({}),
    },
    isGrabbing: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      STEP,
      shouldUseSelectedDate: true,
    };
  },

  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
    ...['TIME_SIMPLE']
      .map((f) => ({ [f]: () => DateTime[f] }))
      .reduce((acc, cur) => Object.assign(acc, cur), {}),
    hideWeekDays() {
      return this.$store.state.context.campus && this.$store.state.context.campus.workedDays
        ? [...(new Array(7)).keys()].map((a) => a + 1)
          .filter((d) => !this.campus.workedDays.includes(d))
        : [6, 7];
    },
    startDayHour() {
      return (this.campus && this.campus.workedHours)
        ? this.campus.workedHours.start : START_DAY_HOUR;
    },
    endDayHour() {
      return (this.campus && this.campus.workedHours)
        ? this.campus.workedHours.end : END_DAY_HOUR;
    },
    selectedDate() {
      return this.$route.query.current;
    },
  },
  methods: {
    openCreate(event) {
      this.$emit('open-create', {
        start: this.$vuecal(STEP).getDateTimeFloorFromVueCal(event.start).toJSDate(),
        end: this.$vuecal(STEP).getDateTimeCeilFromVueCal(event.end).toJSDate(),
      });
    },
    openEdit(content) {
      this.$emit('open-edit', content);
    },
    viewChange({ startDate, endDate }) {
      this.$router.push(this.campusLink(
        'planning-drivers',
        { query: { current: DateTime.fromJSDate(startDate).plus({ day: 5 }).toString() } },
      ));
      this.shouldUseSelectedDate = false;
      this.$emit('view-change', { startDate, endDate });
    },
    drop(event, content) {
      const driver = JSON.parse(event.dataTransfer.getData('application/json'));
      if (driver.id && content.drivers && !content.drivers.find(({ id }) => id === driver.id)) {
        content.drivers.push(driver);
        this.$emit('edit-time-slot', content);
      }
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";
  @import "~assets/css/elements/vue-cal.scss";
  .dropzone {
    outline: 2px dashed white;
    outline-offset: 4px;
  }
  /deep/ {
    .slot-event {
      cursor: pointer;
    }
    .slot-event div {
      height: 100%;
    }
    .vuecal {
      &__cell-events-count {
        display: none;
      }
      &__event {
        background: rgba(62, 170, 40, 1);
        border: 1px solid rgb(62, 170, 40);
        color: $white;
        padding: 8px;
        header {
          text-align: left;
          .hours {
            font-weight: bold;
          }
        }
        .drivers-list {
          font-weight: bold;
        }
      }
    }
  }
</style>
