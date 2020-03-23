<template>
  <nav class="menu">
    <reconnecting-hero />
    <p class="menu-label">
      <nuxt-link :to="{ name: 'index' }">
        <img
          class="logo"
          src="/logo_ec.svg"
          alt="logo"
        >
      </nuxt-link>
    </p>
    <p
      v-if="hasCampus"
      class="menu-label"
    >
      {{ campus.id }} / {{ campus.name }}
    </p>
    <ul
      v-if="hasCampus"
      class="menu-list"
    >
      <li>
        <nuxt-link :to="campusLink('dashboard')">
          Tableau de bord
        </nuxt-link>
      </li>
      <li>
        <nuxt-link :to="campusLink('history')">
          Historique
        </nuxt-link>
      </li>
      <li v-if="hasCampus">
        <nuxt-link :to="campusLink('planning')">
          Planning
        </nuxt-link>
      </li>
      <li v-if="hasCampus">
        <nuxt-link :to="campusLink('planificator')">
          Planificateur
          <span
            v-if="ridesToValidate.length > 0"
            class="red-dot"
          >{{ ridesToValidate.length }}</span>
        </nuxt-link>
      </li>
      <li v-if="hasCampus && $auth.isRegulator() && !$auth.isAdmin()">
        <nuxt-link :to="campusLink('drivers')">
          Chauffeurs
        </nuxt-link>
      </li>
      <li v-if="hasCampus && $auth.isAdmin()">
        <nuxt-link :to="campusLink('users')">
          Utilisateurs
        </nuxt-link>
      </li>
      <li v-if="hasCampus">
        <nuxt-link :to="campusLink('cars')">
          Véhicules
        </nuxt-link>
      </li>
      <li v-if="hasCampus">
        <nuxt-link
          :to="campusLink('phones')"
        >
          Téléphones
        </nuxt-link>
      </li>
      <li v-if="hasCampus">
        <nuxt-link :to="campusLink('pois')">
          Lieux
        </nuxt-link>
      </li>
      <li v-if="hasCampus && $auth.isAdmin(campus.id)">
        <nuxt-link :to="campusLink('edit')">
          Base
        </nuxt-link>
      </li>
      <li v-if="hasCampus && $auth.isSuperAdmin()">
        <nuxt-link :to="campusLink('ratings')">
          Appréciations
        </nuxt-link>
      </li>
      <li v-if="hasCampus && $auth.isSuperAdmin()">
        <nuxt-link
          :to="campusLink('map-vision')"
        >
          Map vision
        </nuxt-link>
      </li>
    </ul>
    <search-user-campus
      class="search-campus"
      :value="campus"
      @input="setCampus"
    />
    <p class="menu-label">
      Général
    </p>
    <ul class="menu-list">
      <li
        v-if="$auth.isSuperAdmin()"
      >
        <nuxt-link
          :to="{ name: 'dashboard' }"
        >
          Tableau de bord
        </nuxt-link>
      </li>
      <li
        v-if="$auth.isSuperAdmin()"
      >
        <nuxt-link
          :to="{ name: 'campuses' }"
        >
          Bases
        </nuxt-link>
      </li>
      <li v-if="$auth.isSuperAdmin()">
        <nuxt-link
          :to="{ name: 'users' }"
        >
          Utilisateurs
        </nuxt-link>
      </li>
      <li v-if="$auth.isSuperAdmin()">
        <nuxt-link
          :to="{ name: 'phone-models' }"
        >
          Modèles de téléphones
        </nuxt-link>
      </li>
      <li v-if="$auth.isSuperAdmin()">
        <nuxt-link
          :to="{name: 'car-models'}"
        >
          Modèles de véhicules
        </nuxt-link>
      </li>
      <li v-if="$auth.isSuperAdmin()">
        <nuxt-link :to="{ name: 'pois' }">
          Lieux
        </nuxt-link>
      </li>
      <li v-if="$auth.isSuperAdmin()">
        <nuxt-link
          :to="{ name: 'categories' }"
        >
          Catégories
        </nuxt-link>
      </li>
      <li v-if="$auth.isRegulator()">
        <nuxt-link
          :to="{ name: 'feedback' }"
        >
          Contactez-nous
        </nuxt-link>
      </li>
    </ul>
    <p class="menu-label">
      {{ $auth.user.name || $auth.user.email }}
    </p>
    <ul class="menu-list">
      <li>
        <nuxt-link
          :to="{ name: 'account' }"
        >
          Mon compte
        </nuxt-link>
      </li>
      <li>
        <button
          class="button is-text"
          @click="logout()"
        >
          Déconnexion
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { DateTime } from 'luxon';
import searchUserCampus from '~/components/form/search-user-campus.vue';
import reconnectingHero from '~/components/reconnecting-hero.vue';

export default {
  components: {
    searchUserCampus,
    reconnectingHero,
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
      ridesToValidate: 'realtime/ridesToValidate',
    }),
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
    ...mapActions({ fetchCampus: 'context/fetchCampus', setRides: 'realtime/setRides' }),
    async setCampus(campus) {
      await this.fetchCampus(campus ? campus.id : null);
      if (campus) {
        const start = DateTime.local().startOf('days').toJSDate();
        const end = DateTime.local()
          .plus({ seconds: this.campus.defaultReservationScope })
          .toJSDate();
        await this.setRides({ campus: this.campus.id, start, end });
      }
    },
    logout() {
      try {
        this.$auth.logout();
      } finally {
        this.$toasted.success('À bientôt !');
        this.$router.push('/login');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/css/head";
  @import "~bulma/sass/components/menu.sass";

  .menu-label {
    padding: 0 $size-small;
  }

  .logo {
    padding: 20px;
  }

  .red-dot {
    position: absolute;
    top: 16px;
    right: 20px;
    height: 20px;
    width: 20px;
    border-radius: 100%;
    background-color: $red;
    color: $white;
    font-size: .7em;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  a {
    position: relative;
  }

  .menu-list a {
    border-left: 3px transparent solid;
    padding: $size-normal;
    display: block;
    color: $text-invert;

    &:hover,
    &.nuxt-link-active {
      border-left-color: $white;
      background: $white-20;
      color: $text-invert;
    }
  }

  .search-campus {
    margin: $size-small;
    max-width: 90%;
    /deep/ .multiselect__tags{
      color: $text-invert;
    }
  }

  /deep/ .button.is-text {
    color: $text-invert;
  }
</style>
