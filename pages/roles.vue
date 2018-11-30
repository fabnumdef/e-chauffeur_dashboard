<template>
  <main>
    <nav class="tabs is-toggle is-centered">
      <ul>
        <li>
          <nuxt-link :to="{ name: 'users' }">Utilisateurs</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="{ name: 'roles' }">Roles</nuxt-link>
        </li>
      </ul>
    </nav>
    <nuxt-child />
  </main>
</template>
