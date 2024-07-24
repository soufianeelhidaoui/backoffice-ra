<template>
  <div id="home">
    <b-breadcrumb class="mt-4 ml-4 custom-breadcrumb">
      <b-breadcrumb-item>Accueil</b-breadcrumb-item>
      <b-breadcrumb-item active>Gestion des CGV</b-breadcrumb-item>
    </b-breadcrumb>

    <h1 class="my-5 ml-5">Générer vos CGV</h1>

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
          <div class="rounded-step second">3</div>
          <p class="mt-3">
            Votre <br />
            médiateur
          </p>
        </div>
        <img :src="svgArrow" class="mb-7" />
        <div class="step">
          <div class="rounded-step">4</div>
          <p class="mt-3">
            Vos mentions <br />
            spécifiques
          </p>
        </div>
      </div>
      <div>
        <ValidationObserver v-slot="{ handleSubmit }" ref="observer">
          <form>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <div class="field-group mb-4">
                <input
                  :class="{ 'border-bottom': errors[0] }"
                  type="text"
                  name="nomMediateur"
                  v-model="formData.nomMediateur"
                  placeholder=""
                  required
                  ref="nomMediateur"
                />
                <label @click="labelClicked('nomMediateur')" v-on:clickout="labelClickeOut('nomMediateur')" :class="{ 'transformed-label': isLabelTransformed.nomMediateur }" for="nomMediateur">Nom du médiateur</label>
                <span :class="{ 'input-error': errors[0] }">{{
                  errors[0]
                }}</span>
              </div>
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <div class="field-group mb-4">
                <input
                  :class="{ 'border-bottom': errors[0] }"
                  type="text"
                  name="adressMediateur"
                  v-model="formData.adressMediateur"
                  placeholder=""
                  @input="searchAddress('adressMediateur')"
                  required
                  ref="adressMediateur"
                />
                <ul
                  v-if="addresses['adressMediateur'].length > 0"
                  ref="mediateurStyle"
                  v-on:clickout="hideStyle('mediateurStyle')"
                >
                  <li
                    v-for="address in addresses['adressMediateur']"
                    :key="address.id"
                    @click="
                      selectAddress(address.properties.label, 'adressMediateur')
                    "
                  >
                    {{ address.properties.label }}
                  </li>
                </ul>
                <label
                  :class="{
                    'transformed-label':
                      addresses['adressMediateur'].length > 0 || isLabelTransformed.adressMediateur
                  }"
                  @click="labelClicked('adressMediateur')" v-on:clickout="labelClickeOut('adressMediateur')"
                  for="adressMediateur"
                  >Adresse du médiateur
                </label>
                <span :class="{ 'input-error': errors[0] }">{{
                  errors[0]
                }}</span>
              </div>
            </ValidationProvider>
            <ValidationProvider rules="required|numSIRET" v-slot="{ errors }">
              <div class="field-group mb-4">
                <input
                  :class="{ 'border-bottom': errors[0] }"
                  type="text"
                  name="nSIRET"
                  v-model="formData.nSIRET"
                  placeholder=""
                  required
                  ref="nSIRET"
                />
                <label @click="labelClicked('nSIRET')" v-on:clickout="labelClickeOut('nSIRET')" :class="{ 'transformed-label': isLabelTransformed.nSIRET }" for="nSIRET">Numéro SIRET du médiateur</label>
                <span :class="{ 'input-error': errors[0] }">{{
                  errors[0]
                }}</span>
              </div>
            </ValidationProvider>
          </form>
          <div
            class="d-flex flex-row align-items-baseline justify-content-center my-5"
          >
            <div class="dart-text text-underline mr-8" @click="goback">
              Étape précédente
            </div>
            <base-button
              @click="handleSubmit(submit)"
              class="btn-rounded mt-5 white-text"
              >Étape suivante <img class="ml-2" :src="svgArrowRight"
            /></base-button>
          </div>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { Mixins } from "@/services/mixins.js";
export default {
  mixins: [Mixins],
  data() {
    return {
      svgArrow: require("../../../assets/svg/arrow-right-custom.svg"),
      svgArrowRight: require("../../../assets/svg/arrow-right.svg"),
      formData: this.$store.state.cgv_formData,
      isLabelTransformed: {
        nomMediateur: false,
        adressMediateur: false,
        nSIRET: false
      },
      addresses: {
        adressMediateur: [],
      },
      mediateurStyle: null,
      searchAddressTimeOutID: null,
      lastApiCallTime: 0,
    };
  },
  mounted() {
    this.mediateurStyle = this.$refs.mediateurStyle;
  },
  methods: {
    searchAddress(input) {
      if (this.searchAddressTimeOutID) {
        clearTimeout(this.searchAddressTimeOutID);
      }

      this.searchAddressTimeOutID = setTimeout(() => {
        if (
          this.formData[input].length >= 3 &&
          this.formData[input].length <= 200
        ) {
          axios
            .get(`https://api-adresse.data.gouv.fr/search`, {
              headers: {
                Authorization: null,
              },
              params: {
                q: this.formData[input],
              },
            })
            .then((response) => {
              console.log(response.data);
              this.addresses[input] = response.data.features;
            })
            .catch((error) => {
              console.error("Erreur de recherche d'adresse :", error.message);
            })
            .finally(() => {
              this.searchAddressTimeOutID = null;
            });
        }
      }, 200);
    },
    selectAddress(address, input) {
      this.formData[input] = address;
      this.addresses[input] = [];
    },
    hideStyle(style) {
      this.$refs[style].style.display = "none";
    },
    goback() {
      this.$router.go(-1);
    },
    goNext() {
      this.$router.push("/gestion-cgv/mentions-specifiques");
    },
    submit() {
      const isValid = this.$refs.observer.validate();
      if (!isValid) {
        console.log(this.formData);
      } else {
        this.$store.commit("set_cgvFormData", this.formData);
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
}

.border-bottom {
  border-bottom: 2px solid $errorInput !important;
}

form div.field-group {
  ul {
    list-style: none;
    padding: 0;
    top: 100%;
    position: absolute;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid #ccc;
  }

  ul li {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  ul li:hover {
    background-color: #f1f1f1;
  }

  input:focus + label,
  input:not(:placeholder-shown) + label {
    transform: scale(0.9);
    outline: none;
    cursor: default;
  }

  width: 60%;
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
    &.transformed-label {
      transform: scale(0.9);
    }
  }

  .input-error {
    position: absolute;
    right: 0;
    top: 3.5rem;
    font-size: 0.8rem;
    color: $errorInput;
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
