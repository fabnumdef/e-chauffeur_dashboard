<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Téléphones
      </h1>
      <div class="options">
        <nuxt-link
          v-if="$auth.isAdmin()"
          :to="campusLink('phones-new')"
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
      :columns="{id: 'S/N', assignTo: 'Assigné à'}"
      :data="getPhones"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    >
      <template
        #actions="{ row }"
        v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
      >
        <nuxt-link
          v-if="$auth.isAdmin(campus.id) || $auth.isSuperAdmin()"
          :to="campusLink('phones-id-edit', {
            params: row,
          })"
          class="button is-primary"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'edit']" />
          </span>
          <span>Modifier</span>
        </nuxt-link>
        <button
          v-if="$auth.isAdmin(campus.id) || $auth.isSuperAdmin()"
          class="button is-danger"
          @click="deletePhone(row)"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'trash']" />
          </span>
          <span>Supprimer</span>
        </button>
      </template>
    </ec-list>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import ecList from '~/components/crud/list.vue';

const FIELDS = [
  'id',
  'owner',
  'campus',
];

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
  },
  async asyncData({ $api, query, params }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.phones({ id: params.campus }, FIELDS.join(','))
      .getPhones(offset, limit);
    return {
      phones: data,
      pagination,
    };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
    getPhones() {
      return this.phones.map(
        (phone) => {
          const phoneComputed = phone;

          if (phone.owner && (phone.owner.name && phone.owner.email)) {
            phoneComputed.assignTo = `${phone.owner.name} (${phone.owner.email})`;
          }

          if (phone.campus && phone.campus.name) {
            phoneComputed.assignTo = phoneComputed.assignTo
              ? `${phoneComputed.assignTo} sur ${phone.campus.name}`
              : phone.campus.name;
          }

          return phoneComputed;
        },
      );
    },
  },
  methods: {
    async deletePhone({ id }) {
      if (window && window.confirm && window.confirm('Voulez vous vraiment supprimer ce téléphone ?')) {
        await this.$api.phones(this.campus).deletePhone(id);
        const offset = parseInt(this.$route.query.offset, 10) || 0;
        const limit = parseInt(this.$route.query.limit, 10) || 30;
        const { data, pagination } = await this.$api.phones(this.campus, FIELDS.join(',')).getPhones(offset, limit);
        this.phones = data;
        this.pagination = pagination;
      }
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
