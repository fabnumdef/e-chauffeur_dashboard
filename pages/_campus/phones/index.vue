<template>
  <main>
    <crud-header
      title="Téléphones"
      :to-create-new="campusLink('phones-new')"
      :can-create-new="$auth.isAdmin(campus.id) || $auth.isSuperAdmin()"
      :import-csv="$auth.isAdmin(campus.id) || $auth.isSuperAdmin()"
      export-csv
      :mask="mask"
      has-mask
      :pagination="pagination"
      :api-call="$api.phones(campus.id, mask).getPhones"
      @importCSV="importCSV"
    />
    <crud-list
      :columns="{id: 'S/N', assignTo: 'Assigné à'}"
      :data="getPhones"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    >
      <template
        v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
        #actions="{ row }"
      >
        <nuxt-link
          v-if="$auth.isAdmin(campus.id) || $auth.isSuperAdmin()"
          :to="campusLink('phones-id-edit', {
            params: { id: row.id },
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
    </crud-list>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import crudList from '~/components/crud/list.vue';
import crudHeader from '~/components/crud/header.vue';

const FIELDS = [
  'id',
  'owner',
  'campus',
];

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
    crudHeader,
  },
  async asyncData({ $api, query, params }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.phones({ id: params.campus }, FIELDS.join(','))
      .getPhones({ offset, limit });
    return {
      phones: data,
      pagination,
    };
  },
  data() {
    return {
      mask: 'id,imei,model(id,label),number,campus(*),state,comments',
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
        this.updateList();
      }
    },
    async importCSV({ data, params }) {
      try {
        await this.$api.phones(this.campus).postPhones(data, params);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
      this.updateList();
    },
    async updateList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const { data, pagination } = await this.$api.phones(this.campus, FIELDS.join(',')).getPhones(offset, limit);
      this.phones = data;
      this.pagination = pagination;
    },
  },
};
</script>
