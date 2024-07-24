<template>
  <div id="app">
    <div v-if="isOnBoarded === 'true'">
      <Navbar :show="true" :hasMenu="true" container-classes="container-fluid" class="navbar-top border-bottom navbar-expand" :classes="$route.meta.navbarClasses ? $route.meta.navbarClasses : 'bg-light navbar-dark d-flex'" type="">
      </Navbar>
      <router-view></router-view>
      <Footer></Footer>
      <!-- Modal -->
      <b-modal size="lg" ref="modal-import-cgu" id="modal-1" :hide-footer="true" no-close-on-esc no-close-on-backdrop hide-header-close>
        <div class="d-flex flex-column align-items-center justify-content-center">
          <h2 class="mb-3">Conditions générales</h2>
          <p>Veuillez lire et accepter les <a :href="`/cgu/${pathCGU}`" target="_blank" download>Conditions Générales d'Utilisation</a> avant de continuer.</p>
          <label class="font-italic text-center">
            <input type="checkbox" v-model="acceptCGU" /> En cochant cette case, je déclare avoir pris connaissance des conditions générales d’utilisation du site internet et les accepter
          </label>
          <div class="d-flex flex-column align-items-center justify-content-center">
            <base-button type="info" class="btn-rounded mt-3 dark-text" @click="storeCGUacceptance">Je confirme</base-button>
          </div>
        </div>
      </b-modal>
    </div>
    <div v-else>
      <b-modal size="lg" ref="modal-onboarding" id="modal-1" :hide-footer="true" no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="d-flex flex-column align-items-center justify-content-center">
        <h2 class="mb-3">Vous n'êtes pas adhérent au e-commerce accessoires. </h2>
        <p>Pour bénéficier de cette fonctionnalité, veuillez vous inscrire sur : </P>
        <p>la pateforme Adhésion Programme Service rubrique “e-commerce accessoires”.</p>
        
        <div class="d-flex flex-column align-items-center justify-content-center">
          <base-button type="info" class="btn-rounded mt-3 dark-text" @click="handleClickOnBoarding">Retourner à l’extranet</base-button>
        </div>
      </div>
    </b-modal>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Navbar from './views/Layout/Navbar.vue';
import Footer from './views/Layout/Footer.vue';
import { mapActions } from 'vuex';
import jwt_decode from "jwt-decode";
export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      acceptCGU: false,
      latestCGU:'',
      pathCGU:'',
      isOnBoarded: '',
    };
  },
  methods: {
    ...mapActions(['login', 'setToken', 'setKvps', 'setSelectedKvps']),
    storeCGUacceptance() {
      // Check if the user has accepted the CGU
      if (this.acceptCGU) {
        // Save in local storage that the user has accepted
        localStorage.setItem('cgu_'+this.latestCGU.substring(14,4), 'true');
        this.$refs['modal-import-cgu'].hide();
      } else {
        const vm = new Vue()
        vm.$bvToast.toast('Veuillez accepter les conditions pour continuer.', {
          title: 'Erreur',
          variant: 'danger',
          solid: true,
        })
      }

    },
    showCGUModal() {
      // Check if the user has not accepted the CGU previously
      if (localStorage.getItem('cgu_'+this.latestCGU.substring(14,4)) !== 'true' && this.$refs['modal-import-cgu'] != undefined) {
        // Show the modal
        this.$refs['modal-import-cgu'].show();
      }
    },
    isTokenExpired(token) {
        try {
            const decodedToken = jwt_decode(token);

            // Check if the token has an expiration time
            if (decodedToken.exp) {
                // Check if the expiration time is in the future
                const isExpired = decodedToken.exp < Date.now() / 1000;
                return isExpired;
            } else {
                // If the token does not have an expiration time, consider it expired
                return true;
            }
        } catch (error) {
            // If there is an error decoding the token, consider it expired
            console.error("Error decoding token:", error);
            return true;
        }
    },
    showOnBoardingModal() {
      this.isOnBoarded = localStorage.getItem('isOnBoarded');
      if (this.isOnBoarded == 'false' && this.$refs['modal-onboarding'] != undefined) {
        this.$refs['modal-onboarding'].show();
      }
    },
    handleClickOnBoarding() {
      window.open(process.env.VUE_APP_EXTRANET);
    },
  },
  created() {
    //Si on a le token VGF
    if (this.$route.query.authToken && this.$route.query.appID) {
      this.login({ authToken: this.$route.query.authToken, appID: this.$route.query.appID}).then(() => {
        this.showOnBoardingModal();
      });
    } else {
      this.showOnBoardingModal();
      //sinon on utilise les données en localstorage
      let token = localStorage.getItem('jwt')
      if (!token || this.isTokenExpired(token)) {
        //redirection vers google provisoirement et ensuite vers le vrai lien
        window.location.href = process.env.VUE_APP_EXTRANET;
      } else {
        this.setToken(token)
        let contracts = JSON.parse(localStorage.getItem('contracts'))
        if(localStorage.getItem('contracts')) {
          this.setKvps(contracts)
        }
        if(localStorage.getItem('kvps_actif')) {
          let kvps = JSON.parse(localStorage.getItem('kvps_actif'))
          let find = contracts.find(c => c.kvps == kvps.kvps)
          //Et qu'il est dans notre liste
          if(find) {
            this.setSelectedKvps(kvps)
          }
        }
      }
    }
    this.$nextTick(() => {
    this.latestCGU = latestCGUFileName;
    this.pathCGU = latestCGUFileName;
    // Call showCGUModal method to display the modal only the first time the user enters the website
    this.showCGUModal();
    });
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: "VW Head";
  src: local("VW Head"),
  url(./fonts/vw/VWHead-Regular.otf) format("opentype");
}

@font-face {
  font-family: "VW Head Bold";
  src: local("VW Head Bold"),
  url(./fonts/vw/VWHead-Bold.otf) format("opentype");
}

@font-face {
  font-family: "VW Text";
  src: local("VW Text"),
  url(./fonts/vw/VWText-Regular.otf) format("opentype");
}

@font-face {
  font-family: "VW Text Bold";
  src: local("VW Text Bold"),
  url(./fonts/vw/VWText-Bold.otf) format("opentype");
}

body,
.breadcrumb {

  background-color: #FFFFFE;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "VW Head";
}

p {
  font-family: "VW Text";
}

.kvps-select {
  border: none;
  background-color: #FFFFFE;
  margin: 0;
  padding: 0;
  color: #001E50;

}

.kvps-select:hover {
  background-color: #FFFFFE;
  color: #001E50;
}

.vwhead {
  font-family: 'VW Head';
}

.vwtext {
  font-family: 'VW Text';
}

a.active {
  border-bottom: 2px solid black;
}

.navbar {
  padding-bottom: 0;
}

.btn-light:focus{
  background: none !important;
}

.dropdown-menu.show {
  min-width: 0 !important;
  border-radius: 0;
}

.dropdown-item:hover {
  color: #000000 !important;
  font-weight: bold;
  background-color: #DFE4E8 !important;
}

.btn-status.dropdown-toggle {
  border-radius: 2.25rem;
}

th.custom-column {
  font-family: 'VW Text';
  color: #000000 !important;
  font-weight: 400 !important;
  font-size: 16px !important;
  text-transform: none !important;
}

td.custom-column {
  font-family: 'VW Text';
  color: #000000 !important;
  font-weight: 700 !important;
  font-size: 16px !important;

}

.custom-breadcrumb {
  font-family: "VW Text";

  a {
    color: #000000;
  }
  
  .breadcrumb-item:not(:first-child)::before {
    color: #000000 !important;
    font-family: "Font Awesome 5 Free";
    font-weight: 700;
    content: url(assets/svg/chevron-right.svg);
  }
  .breadcrumb-item {
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    
  }

  .active {
    font-weight: 700;
    color: #000000 !important;

  }
}

.btn-rounded {
  border-radius: 2.25rem;
}

.dark-text {
  color: #000000;
}

.popover {
  border-radius: 0.8rem;
}

.custom-file-label::after {
  content: url(./assets/svg/download-dark.svg) !important;
  background-color: #11CDEF;

}

.custom-file-label {
  background-color: #11CDEF;
  color: #000000;
}

.custom-file-label:hover {
  cursor: pointer !important;

}

// Le b-spinner ne marchant pas j'ai du ajouter le css en dur ...

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: spinner-border .75s linear infinite;
  animation: spinner-border .75s linear infinite;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.page-item {
  button {
  border-color: #001E50 !important;
  }
}
.page-item.disabled {
  span {
  border-color: #001E50 !important;
  }
}
.page-item.active {
  button {
    background-color: #001E50 !important;
  border-color: #001E50 !important;
  }
}
.btn-light:not(:disabled):not(.disabled):active, .btn-light:not(:disabled):not(.disabled).active, .show > .btn-light.dropdown-toggle {
     color: #001E50; 
     background-color: #ffffff; 
     border-color: #ffffff; 
}

#home, #gestion_commandes {
  min-height: 75vh;
}
</style>
