<template>
  <p class="box">
    Bienvenue sur le portail e-chauffeur, merci de choisir la base à visualiser via le menu à gauche.
  </p>
</template>
<script>
import titleMixin from '~/helpers/mixins/page-title';

export default {
  mixins: [
    titleMixin('Accueil'),
  ],
};
</script>
