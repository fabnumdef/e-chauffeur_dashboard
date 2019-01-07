<template>
  <aside>
    <div class="menu">
      <p class="menu-label">
        <nuxt-link :to="{ name: 'index' }">
          E-chauffeur
        </nuxt-link>
      </p>
      <ul class="menu-list">
        <li>
          <nuxt-link :to="{ name: 'dashboard' }">
            Dashboard
          </nuxt-link>
        </li>
        <li v-if="hasCampus">
          <nuxt-link :to="campusLink('rides')">
            Courses
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'history' }">
            Historique
          </nuxt-link>
        </li>
        <li v-if="hasCampus">
          <nuxt-link :to="campusLink('planning')">
            Planning
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'campuses' }">
            Bases
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'users' }">
            Utilisateurs
          </nuxt-link>
        </li>
        <li v-if="hasCampus">
          <nuxt-link :to="campusLink('cars')">
            Véhicules
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{name: 'car-models'}">
            Modèles de véhicules
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'pois' }">
            POIs
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'roles' }">
            Roles
          </nuxt-link>
        </li>
      </ul>
    </div>
    <div v-if="$auth.user">
      Current user :
      {{ $auth.user.email }}
    </div>
    <div v-if="$auth.user">
      <search-user-campus
        :value="campus"
        @input="setCampus"
      />
    </div>
  </aside>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import searchUserCampus from '~/components/form/search-user-campus.vue';

export default {
  components: {
    searchUserCampus,
  },
  computed: {
    ...mapGetters({ campus: 'context/campus' }),
  },
  watch: {
    campus(c) {
      if (c && c.id) {
        this.$router.push({
          name: 'campus',
          params: {
            campus: c.id,
          },
        });
      } else {
        this.$router.push({
          name: 'index',
        });
      }
    },
  },
  methods: {
    ...mapMutations({ setCampus: 'context/setCampus' }),
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/css/head";
  @import "~bulma/sass/components/menu.sass";

  .menu-list a {
    border-left: 3px transparent solid;
    padding: $size-normal;
    display: block;

    &:hover,
    &.nuxt-link-active {
      border-left-color: $white;
      background: $white-20;
    }
  }
</style>
