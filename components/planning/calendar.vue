<template>
  <div class="calendar column">
    <client-only>
      <vue-cal
        default-view="week"
        :time-from="START_DAY_HOUR * 60"
        :time-to="END_DAY_HOUR * 60"
        :time-step="STEP"
        :time-cell-height="35"
        hide-view-selector
        hide-weekends
        :events="events"
        locale="fr"
        :disable-views="['years', 'year', 'month', 'day']"
        :on-event-click="openEdit"
        @click-and-release="openCreate"
        @view-change="viewChange"
      >
        <template #event-renderer="{ event: { content }, view }">
          <header>
            <span class="hours">
              {{ content.start.toLocaleString(TIME_SIMPLE) }} - {{ content.end.toLocaleString(TIME_SIMPLE) }}
            </span>
            <span class="is-pulled-right">
              <fa-icon icon="user-circle" /> {{ content.drivers.length }}({{ drivers.data.length }})
            </span>
          </header>
          <ul class="drivers-list">
            <li
              v-for="driver of content.drivers"
              :key="driver.id"
            >
              <span v-if="driver.firstname || driver.lastname">{{ driver.firstname }} {{ driver.lastname }}</span>
              <span v-else>{{ driver.id }}</span>
            </li>
          </ul>
        </template>
      </vue-cal>
    </client-only>
  </div>
</template>

<script>
import { DateTime } from 'luxon';

const STEP = 60;
const START_DAY_HOUR = 4;
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
  },

  data() {
    return {
      STEP,
      START_DAY_HOUR,
      END_DAY_HOUR,
    };
  },

  computed: {
    ...['TIME_SIMPLE']
      .map((f) => ({ [f]: () => DateTime[f] }))
      .reduce((acc, cur) => Object.assign(acc, cur), {}),
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
      this.$emit('view-change', {
        startDate,
        endDate,
      });
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";
  .calendar {
    height: calc(100vh - 100px);
    background-color: white;
  }
  /deep/ {
    .slot-event {
      margin-right: 15px;
      cursor: pointer;
    }
    .vuecal {
      &__no-event {
        display: none;
      }
      &__cell-content {
        cursor: crosshair;
      }
      &__cell-hover:hover {
        background-color: rgba(0, 83, 179, 0.4);
      }
      &__event {
        background: $success;
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
