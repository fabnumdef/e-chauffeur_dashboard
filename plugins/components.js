import Vue from 'vue';
import ecField from '~/components/form/field.vue';
import ecChoice from '~/components/form/choice.vue';
import ecButton from '~/components/form/button.vue';

// Here, we will import only components used widely on the application
Vue.component('ec-field', ecField);
Vue.component('ec-choice', ecChoice);
Vue.component('ec-button', ecButton);
