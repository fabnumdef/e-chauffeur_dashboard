<template>
  <main>
    <header>
      <nuxt-link
        :to="{ name: 'rides-new' }"
        class="button"
      >
        Nouvelle course
      </nuxt-link>
      <h1 class="title">
        Informations courses
      </h1>
      <nav class="tabs is-toggle is-centered">
        <ul>
          <li>
            <nuxt-link :to="{ name: 'rides-drivers' }">
              Chauffeurs
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ name: 'rides-rides' }">
              Courses
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ name: 'rides-cars' }">
              Véhicules
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </header>
    <nuxt-child />
  </main>
</template>
