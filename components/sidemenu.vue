<template>
  <aside>
    <div class="menu">
      <p class="menu-label">
        <NuxtLink :to="{ name: 'index' }">
          E-chauffeur
        </NuxtLink>
      </p>
      <ul class="menu-list">
        <li>
          <NuxtLink :to="{ name: 'dashboard' }">
            Dashboard
          </NuxtLink>
        </li>
        <li v-if="hasCampus">
          <NuxtLink :to="campusLink('rides-drivers')">
            Courses
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: 'history' }">
            Historique
          </NuxtLink>
        </li>
        <li v-if="hasCampus">
          <NuxtLink :to="campusLink('planning')">
            Planning
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: 'campuses' }">
            Bases
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: 'users' }">
            Utilisateurs
          </NuxtLink>
        </li>
        <li v-if="hasCampus">
          <NuxtLink :to="campusLink('cars')">
            Véhicules
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{name: 'car-models'}">
            Modèles de véhicules
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: 'pois' }">
            POIs
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ name: 'roles' }">
            Roles
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div>
      Current user :
      {{ $auth.user }}
    </div>
    <div>
      Current campus : {{ campus }}
    </div>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({ campus: 'context/campus' }),
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
