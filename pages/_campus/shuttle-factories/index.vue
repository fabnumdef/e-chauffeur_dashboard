<template>
  <crud-list
    :columns="{
      id: 'ID',
      label: 'Label',
      category: 'Catégorie',
      comments: 'Commentaires',
      stops: 'Arrêts',
      reachDuration: 'Temps moyen entre arrêts',
    }"
    :data="data"
    :pagination="pagination"
  >
    <template #intro>
      <div class="columns">
        <div class="column">
          <search-filter
            :value="searchTerms"
            @update="search"
          />
        </div>
        <div
          class="column is-narrow"
        >
          <ec-button
            v-if="$auth.isAdmin(campus.id)"
            :to="campusLink('shuttle-factories-new')"
            is-success
            icon-left="plus"
          >
            Créer
          </ec-button>
        </div>
      </div>
    </template>
    <template
      v-if="$auth.isAdmin(campus.id)"
      #actions="{ row }"
    >
      <ec-button
        :to="campusLink('shuttle-factories-id-edit', {
          params: { id: row.id },
        })"
        is-primary
        icon-left="edit"
      >
        Modifier
      </ec-button>
      <ec-button
        is-danger
        icon-left="trash"
        @click="deleteRow(row)"
      >
        Supprimer
      </ec-button>
    </template>
  </crud-list>
</template>

<script>
import { mapGetters } from 'vuex';
import crudList from '~/components/crud/list.vue';
import updateListMixin from '~/helpers/mixins/crud/update-list';
import searchFilterMixin from '~/helpers/mixins/crud/search-filter';
import deleteInListMixin from '~/helpers/mixins/crud/delete-in-list';
import titleMixin from '~/helpers/mixins/page-title';

const SHUTTLE_FACTORIES = 'shuttleFactories';
const DEFAULT_MASK = 'id,label,category,comments,stops,reachDuration';

export default {
  components: {
    crudList,
  },
  mixins: [
    titleMixin('Trajets de navette'),
    searchFilterMixin(),
    updateListMixin(SHUTTLE_FACTORIES, {
      mask: DEFAULT_MASK,
      customList: async (l, { params }) => {
        const list = await l.setFilter('campus', params.campus);
        list.data = list.data.map((shuttleFactory) => ({
          ...shuttleFactory,
          category: shuttleFactory.category.label,
          stops: shuttleFactory.stops.length > 0
            ? shuttleFactory.stops.length
            : 'Pas d\'arrêts définis',
        }));
        return list;
      },
    }),
    deleteInListMixin(SHUTTLE_FACTORIES, { confirmation: 'Voulez vous vraiment supprimer ce trajet ?' }),
  ],

  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
};
</script>
