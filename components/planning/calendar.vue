<template>
  <client-only>
    <vue-cal
      class="column"
      default-view="week"
      hide-view-selector
      :hide-weekdays="[6, 7]"
      :events="events"
      locale="fr"
      :disable-views="['years', 'year', 'month', 'day']"
      @cell-click="openCreate"
      :on-event-click="openEdit"
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
</template>

<script>
import { DateTime } from 'luxon';

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
  computed: {
    ...['TIME_SIMPLE']
      .map((f) => ({ [f]: () => DateTime[f] }))
      .reduce((acc, cur) => Object.assign(acc, cur), {}),
  },
  methods: {
    openCreate(date = new Date()) {
      this.$emit('open-create', date);
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
  /deep/ .vuecal__event {
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
</style>
