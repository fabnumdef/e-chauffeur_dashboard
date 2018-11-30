<template>
  <main>
    <header class="with-options">
      <h1 class="title">Users</h1>
      <div class="options">
        <nuxt-link
          :to="{name: 'users-new'}"
          class="button is-success">
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'plus']" />
          </span>
          <span>Create</span>
        </nuxt-link>
      </div>
    </header>
    <ec-list
      :columns="{id: 'ID', email: 'E-mail'}"
      :data="users"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      action-edit="users-id-edit"
      @action-remove="deleteUser"
    />

  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';

export default {
  watchQuery: ['offset'],
  components: {
    ecList,
  },
  async asyncData({ $api }) {
    const { data, pagination } = await $api.users.getUsers('id,email');
    return {
      users: data,
      pagination,
    };
  },
  methods: {
    async deleteUser({ id }) {
      await this.$api.users.deleteUser(id);
      const updatedList = await this.$api.users.getUsers('id,email');
      this.users = updatedList.data;
      this.pagination = updatedList.pagination;
    },
  },
};
</script>

<style lang="scss" scoped>
  .with-options {
    display: flex;
    .title {
      flex-grow: 1;
    }
    .options {
      padding: 0 10px 10px;
      float: right;
    }
  }
</style>
