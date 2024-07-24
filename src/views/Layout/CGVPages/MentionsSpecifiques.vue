<template>
  <div id="home">
    <b-breadcrumb class="mt-4 ml-4 custom-breadcrumb">
      <b-breadcrumb-item>Accueil</b-breadcrumb-item>
      <b-breadcrumb-item active>Gestion des CGV</b-breadcrumb-item>
    </b-breadcrumb>

    <h1 class="my-5 ml-5">Générer vos CGV</h1>
    <b-alert show class="my-3 info">
      <img class="mr-2" :src="svgInfo" /> Afin de simplifier votre inscription,
      ces champs ont été préremplis avec nos recommandations de délais.
    </b-alert>

    <div class="center-content py-3">
      <div class="my-5 d-flex">
        <div class="step">
          <div class="rounded-step first">1</div>
          <p class="mt-3">
            Vos mentions <br />
            légales
          </p>
        </div>
        <img :src="svgArrow" class="mb-7" />
        <div class="step">
          <div class="rounded-step first">2</div>
          <p class="mt-3">
            Vos moyens <br />
            de contact
          </p>
        </div>
        <img :src="svgArrow" class="mb-7" />
        <div class="step">
          <div class="rounded-step first">3</div>
          <p class="mt-3">
            Votre <br />
            médiateur
          </p>
        </div>
        <img :src="svgArrow" class="mb-7" />
        <div class="step">
          <div class="rounded-step second">4</div>
          <p class="mt-3">
            Vos mentions <br />
            spécifiques
          </p>
        </div>
      </div>
      <div>
        <ValidationObserver v-slot="{ handleSubmit }" ref="observer">
          <form>
          <p>
          <h2>Dans le cas d'une prise de contact par le Vendeur qui a abouti mais
            le rendez-vous n'a pas été honoré par le Client</h2>
          </p>
          <ValidationProvider rules="required|numeric" v-slot="{ errors }">
          <div class="field-group mb-4">
            <input :class="{ 'border-bottom': errors[0] }" type="text" name="delai" v-model="formData.delaiRetraitCommande" placeholder="" required ref="delai"/>
            <label  @click="labelClicked('delai')" v-on:clickout="labelClickeOut('delai')" :class="{ 'transformed-label': isLabelTransformed.delai }" for="delai">Délai pour le retrait de la commande</label>
            <span class="pxSpan" v-show="formData.delaiRetraitCommande">jours calendaires</span>
            <span :class="{ 'input-error': errors[0] }">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>
          <ValidationProvider rules="required|numeric" v-slot="{ errors }">
          <div class="field-group mb-5">

            <input :class="{ 'border-bottom': errors[0] }" type="text" name="delaiSupplementaire" v-model="formData.delaiSupplementaire" placeholder="" required ref="delaiSupplementaire"/>
            <label  @click="labelClicked('delaiSupplementaire')" v-on:clickout="labelClickeOut('delaiSupplementaire')" :class="{ 'transformed-label': isLabelTransformed.delaiSupplementaire }" for="delaiSupplementaire">Délai supplémentaire pour le retrait de la commande avant
              annulation</label>
            <span class="pxSpan" v-show="formData.delaiSupplementaire">jours calendaires</span>
            <span :class="{ 'input-error': errors[0] }">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>
          <p>
          <h2>Dans le cas d'une prise de contact par le Vendeur non aboutie</h2>
          </p>
          <ValidationProvider rules="required|numeric" v-slot="{ errors }">
          <div class="field-group mb-4">

            <input :class="{ 'border-bottom': errors[0] }" type="text" name="delaiAvantEnvoi" v-model="formData.delaiAvantEnvoi" placeholder="" required ref="delaiAvantEnvoi"/>
            <label  @click="labelClicked('delaiAvantEnvoi')" v-on:clickout="labelClickeOut('delaiAvantEnvoi')" :class="{ 'transformed-label': isLabelTransformed.delaiAvantEnvoi }" for="delaiAvantEnvoi">Délai avant envoi d'un courrier</label>
            <span class="pxSpan" v-show="formData.delaiAvantEnvoi">jours calendaires</span>

            <span :class="{ 'input-error': errors[0] }">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>
          <ValidationProvider rules="required|numeric" v-slot="{ errors }">
          <div class="field-group mb-4">

            <input :class="{ 'border-bottom': errors[0] }" type="text" name="delaiAvantAnnulation" v-model="formData.delaiAvantAnnulation" placeholder="" required ref="delaiAvantAnnulation"/>
            <label  @click="labelClicked('delaiAvantAnnulation')" v-on:clickout="labelClickeOut('delaiAvantAnnulation')" :class="{ 'transformed-label': isLabelTransformed.delaiAvantAnnulation }" for="delaiAvantAnnulation">Délai pour le retrait de la commande avant annulation</label>
            <span class="pxSpan" v-show="formData.delaiAvantAnnulation">jours calendaires</span>
            <span :class="{ 'input-error': errors[0] }">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>
        </form>
        <div class="d-flex flex-row align-items-baseline justify-content-center my-5">
          <div class="dart-text text-underline mr-8" @click="goback">Étape précédente</div>
          <base-button @click="handleSubmit(submit)" class="btn-rounded mt-5 white-text"><img class="mr-2" :src="svgFileAdd" /> Générer
            les CGV
          </base-button>
        </div>
      </ValidationObserver>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { Mixins } from "@/services/mixins.js";
export default {
  mixins: [Mixins],
  mounted() { },
  data() {
    return {
      svgInfo: require("../../../assets/svg/warning.svg"),
      svgArrow: require("../../../assets/svg/arrow-right-custom.svg"),
      svgFileAdd: require("../../../assets/svg/file-add.svg"),
      formData: this.$store.state.cgv_formData,
      isLabelTransformed: {
        delai: false,
        delaiSupplementaire: false,
        delaiAvantEnvoi: false,
        delaiAvantAnnulation: false
      },
    };
  },
  computed: {
        ...mapGetters(['getSelectedKvps'])
  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    goNext() {
      this.$router.push("/gestion-cgv/edition-cgv");
    },
    submit() {
      const isValid = this.$refs.observer.validate();
      if (!isValid) {
        console.log(this.formData)
      } else {
        this.$store.commit('set_cgvFormData', this.formData);
        this.goNext();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
$blueTitle: #102c5b;
$text: #000000;
$blueStep: #001e50;
$grayStep: #c2cacf;
$errorInput: #ff6d6d;

h1 {
  font-weight: 700;
  font-size: 56px;
  line-height: 72px;
}

h2 {
  font-weight: 600;
  font-size: 18px;
  color: $text !important;
}

.alert-info {
  color: black !important;
  background-color: #ffd100 !important;
  border-color: #ffd100 !important;
  font-weight: 600;
  font-size: medium;
  width: fit-content;
  margin: auto;
}

.center-content {
  margin: auto;
  width: 60%;
  text-align: center;
  color: #000000;

  p {
    font-weight: 400;
    color: $text !important;
  }

  .text-underline {
    color: $blueStep !important;
    text-decoration: underline !important;
    cursor: pointer !important;
  }

  .input-error {
    position: absolute;
    right: 0;
    top: 3.5rem;
    font-size: 0.8rem;
    color: $errorInput;
  }
  @media screen and (max-width: 1235px) {
    .input-error {
      top: 5rem;
    }
  }
}

.border-bottom {
  border-bottom: 2px solid $errorInput !important;
}

form div.field-group {

  input:focus+label,
  input:not(:placeholder-shown)+label {
    transform: scale(0.9);
    outline: none;
    cursor: default;
  }

  max-width: 70%;
  margin: auto;
  display: flex;
  text-align: left;
  color: $blueTitle;
  position: relative;

  input {
    width: 100%;
    padding-left: 0;
    padding-bottom: 0.4rem;
    border: none;
    border-bottom: 2px solid $blueStep;
    border-radius: 0;
    background: none;
    padding-top: 1.2rem;
    margin-bottom: 0;
    outline: none;
    text-align: left;
    font-size: 19px;
    color: $blueStep;
  }

  label {
    position: absolute;
    transform: translateY(1.4rem);
    transform-origin: left top;
    cursor: text;
  }
  @media screen and (max-width: 1251px) {
    input {
      padding-top: 2.5rem;
    }
  }

  .pxSpan {
    position: absolute;
    top: 19px;
    right: 10px;
  }
  @media screen and (max-width: 1235px) {
    .pxSpan {
      top: 50px;
    }
  }
  
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;

  .rounded-step {
    background-color: $grayStep;
    border: 1px solid $grayStep;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 30px;
  }

  .rounded-step.first {
    background-color: white;
    border: 3px solid $blueStep;
    color: $blueStep;
  }

  .rounded-step.second {
    background-color: $blueStep;
  }

  img {
    width: 45px;
  }
}
</style>
