<template>
  <aside>
    <div class="menu">
      <p class="menu-label">
        <nuxt-link :to="{ name: 'index' }">E-chauffeur</nuxt-link>
      </p>
      <ul class="menu-list">
        <li>
          <nuxt-link :to="{ name: 'dashboard' }">Dashboard</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'rides-drivers' }">Courses</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'history' }">Historique</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'planning' }">Planning</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'campuses' }">Bases</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'users' }">Utilisateurs</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'cars' }">Véhicules</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'pois' }">POIs</nuxt-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

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
