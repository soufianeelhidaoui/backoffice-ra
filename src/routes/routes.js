import GestionCommandes from '@/views/Layout/GestionCommandes.vue';
import AffichageCommande from '@/views/Layout/AffichageCommande.vue';
import MentionLegale from '@/views/Layout/CGVPages/MentionLegale.vue';
import MoyensContact from '@/views/Layout/CGVPages/MoyensContact.vue';
import Mediateur from '@/views/Layout/CGVPages/Mediateur.vue';
import MentionsSpecifiques from '@/views/Layout/CGVPages/MentionsSpecifiques.vue';
import EditionCGV from '@/views/Layout/CGVPages/EditionCGV.vue';
import GestionPrix from '@/views/Layout/GestionPrix.vue';
import GestionCGV from '@/views/Layout/GestionCGV.vue';
import HomePage from '@/views/Layout/HomePage.vue';
import store from '../services/store.js'

// Define the required fields for each route
const routeRequirements = {
  'Moyens de contact': ['denomination', 'societyNature', 'capital', 'local', 'numeroRCS', 'localRCS'],
  'Mediateur': ['denomination', 'societyNature', 'capital', 'local', 'numeroRCS', 'localRCS', 'delaiPriseContact', 'moyenContact'],
  'Mentions specifiques': ['denomination', 'societyNature', 'capital', 'local', 'numeroRCS', 'localRCS', 'delaiPriseContact', 'moyenContact', 'nomMediateur', 'nSIRET', 'adressMediateur'],
  'Edition des CGV': ['denomination', 'societyNature', 'capital', 'local', 'numeroRCS', 'localRCS', 'delaiPriseContact', 'moyenContact', 'nomMediateur', 'nSIRET', 'adressMediateur', 'delaiRetraitCommande', 'delaiSupplementaire', 'delaiAvantEnvoi', 'delaiAvantAnnulation']
};

// Reusable function to check if required form data is filled
const isFormDataFilled = (requiredFields) => {
  return requiredFields.every(field => store.state.cgv_formData[field] !== '');
};

const routes = [
  {
    path: '/',
    component: HomePage,
    name: 'Back office RA'
  },
  {
    path: '/gestion-commandes',
    component: GestionCommandes,
    name: 'Gestion des commandes'
  },
  {
    path: '/commande/:id',
    component: AffichageCommande,
    name: 'Commande'
  },
  {
    path: '/gestion-prix',
    component: GestionPrix,
    name: 'Gestion des prix'
  },
  {
    path: '/gestion-cgv',
    component: GestionCGV,
    name: 'Gestion des cgv'
  },
  {
    path: '/gestion-cgv/mention-legale',
    component: MentionLegale,
    name: 'Mentions Legales'
  },
  {
    path: '/gestion-cgv/moyens-de-contact',
    component: MoyensContact,
    name: 'Moyens de contact',
    beforeEnter: (to, from, next) => {
      const requiredFields = routeRequirements['Moyens de contact'];
      if (isFormDataFilled(requiredFields)) {
        next();
      } else {
        next('/gestion-cgv/mention-legale');
      }
    },
  },
  {
    path: '/gestion-cgv/mediateur',
    component: Mediateur,
    name: 'Mediateur',
    beforeEnter: (to, from, next) => {
      const requiredFields = routeRequirements['Mediateur'];
      if (isFormDataFilled(requiredFields)) {
        next();
      } else {
        next('/gestion-cgv/mention-legale');
      }
    },
  },
  {
    path: '/gestion-cgv/mentions-specifiques',
    component: MentionsSpecifiques,
    name: 'Mentions specifiques',
    beforeEnter: (to, from, next) => {
      const requiredFields = routeRequirements['Mentions specifiques'];
      if (isFormDataFilled(requiredFields)) {
        next();
      } else {
        next('/gestion-cgv/mention-legale');
      }
    },
  },
  {
    path: '/gestion-cgv/edition-cgv',
    component: EditionCGV,
    name: 'Edition des CGV',
    beforeEnter: (to, from, next) => {
      const requiredFields = routeRequirements['Edition des CGV'];
      if (isFormDataFilled(requiredFields)) {
        next();
      } else {
        next('/gestion-cgv/mention-legale');
      }
    },
  },
];

export default routes;
