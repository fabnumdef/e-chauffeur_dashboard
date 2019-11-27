<template>
  <main>
    <header>
      <h1 class="title">
        Logs
      </h1>
    </header>
    <ec-list
      :columns="columns"
      :data="logs"
    />
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';

const columns = { timestamp: 'Timestamp', level: 'Level', message: 'Message' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data: logs, pagination } = await $api.logs('*').getLogs(offset, limit);
    return {
      logs,
      pagination,
    };
  },
  computed: {
    columns() { return columns; },
  },
};
</script>
