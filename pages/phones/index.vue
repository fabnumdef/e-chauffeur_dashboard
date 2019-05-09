<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Téléphones
      </h1>
      <div class="options">
        <nuxt-link
          v-if="$auth.isAdmin()"
          :to="{name: 'phones-new'}"
          class="button is-success"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'plus']" />
          </span>
          <span>Créer</span>
        </nuxt-link>
      </div>
    </header>
    <ec-list
      :columns="{id: 'S/N', driverNameEmail: 'Assigné à'}"
      :data="getPhones"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      :action-edit="'phones-id-edit'"
      action-remove-confirm="Voulez-vous vraiment supprimer ce téléphone ?"
      @action-remove="deleteUser"
    />
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';

const FIELDS = [
  'id',
  'imei',
  'phone',
  'model',
  'driver',
  'state',
  'comments',
];

export default {
  watchQuery: ['offset'],
  components: {
    ecList,
  },
  computed: {
    getPhones() {
      return this.phones.map(
        (phone) => {
          const phoneComputed = phone;
          if (phone.driver && (phone.driver.name && phone.driver.email)) {
            phoneComputed.driverNameEmail = `${phone.driver.name} (${phone.driver.email})`;
          }
          return phoneComputed;
        },
      );
    },
  },
  async asyncData({ $api }) {
    const { data, pagination } = await $api.phones.getPhones(FIELDS.join(','));
    return {
      phones: data,
      pagination,
    };
  },
  methods: {
    async deleteUser({ id }) {
      await this.$api.phones.deletePhone(id);
      const updatedList = await this.$api.phones.getPhones(FIELDS.join(','));
      this.phones = updatedList.data;
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
