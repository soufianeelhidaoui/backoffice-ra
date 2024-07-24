<template>
  <div id="home">
    <b-breadcrumb class="mt-4 ml-4 custom-breadcrumb">
      <b-breadcrumb-item>Accueil</b-breadcrumb-item>
      <b-breadcrumb-item active>Gestion des CGV</b-breadcrumb-item>
    </b-breadcrumb>

    <h1 class="my-5 ml-5">Générer vos CGV</h1>
    <b-alert show class="my-3 text-black info">
      <img class="mr-2" :src="svgInfo" /> Rappel : Vous devez générer des CGV
      pour chaque KVPS Marque.
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
          <div class="rounded-step">2</div>
          <p class="mt-3">
            Vos moyens <br />
            de contact
          </p>
        </div>
        <img :src="svgArrow" class="mb-7" />
        <div class="step">
          <div class="rounded-step">3</div>
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
        <p>Tous les champs sont obligatoires</p>
        <ValidationObserver v-slot="{ handleSubmit }" ref="observer">
          <form>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <div class="field-group mb-4">

                <input :class="{ 'border-bottom': errors[0] }" type="text" name="Dénomination sociale"
                  v-model="formData.denomination" placeholder="" required ref="denomination"/>
                <label @click="labelClicked('denomination')" v-on:clickout="labelClickeOut('denomination')" :class="{ 'transformed-label': isLabelTransformed.denomination }" for="denomination">Dénomination sociale</label>
                <span :class="{ 'input-error': errors[0] }">{{ errors[0] }}</span>

              </div>
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <div class="field-group mb-4">
                <select v-model="formData.societyNature" @change="$event => setHasValue($event.target)"
                  name="Nature de la société" :class="{ 'border-bottom border-danger': errors[0] }">
                  <option v-for="option in options" :value="option.text">
                    {{ option.text }}&nbsp;&nbsp;&nbsp;
                  </option>
                </select>
                <label>Nature de la société</label>
                <span :class="{ 'input-error': errors[0] }">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
            <ValidationProvider rules="required|numeric" v-slot="{ errors }">
              <div class="field-group mb-4">
                <input :class="{ 'border-bottom border-danger': errors[0] }" type="text" name="capital"
                  v-model="formData.capital" placeholder="" required ref="capital"/>
                <label @click="labelClicked('capital')" v-on:clickout="labelClickeOut('capital')" :class="{ 'transformed-label': isLabelTransformed.capital }" for="capital">Montant du capital social</label>
                <span class="pxSpan" v-show="formData.capital">&#8364</span>
                <span :class="{ 'input-error': errors[0] }">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <div class="field-group mb-4">
                <input :class="{ 'border-bottom border-danger': errors[0] }" ref="local" @input="searchAddress('local')" type="text"
                  name="Lieu du siège social" v-model="formData.local" placeholder="" required />
                <ul v-if="addresses['local'].length > 0" ref="localStyle" v-on:clickout="hideStyle('localStyle')">
                  <li v-for="address in addresses['local']" :key="address.id" @click="selectAddress(address.properties.label,'local')">
                    {{ address.properties.label }}
                  </li>
                </ul>
                <label @click="labelClicked('local')" v-on:clickout="labelClickeOut('local')" :class="{ 'transformed-label': addresses['local'].length > 0 || isLabelTransformed.local }" for="local">Lieu du siège social</label>
                <span :class="{ 'input-error': errors[0] }">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
            <ValidationProvider rules="required|numRcs" v-slot="{ errors }">
              <div class="field-group mb-4">
                <input :class="{ 'border-bottom border-danger': errors[0] }" type="text" name="Numéro RCS"
                  v-model="formData.numeroRCS" placeholder="" required ref="numeroRCS"/>
                <label @click="labelClicked('numeroRCS')" v-on:clickout="labelClickeOut('numeroRCS')" :class="{ 'transformed-label': isLabelTransformed.numeroRCS }" for="numeroRCS">Numéro RCS</label>
                <span :class="{ 'input-error': errors[0] }">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <div class="field-group mb-4">
                <input :class="{ 'border-bottom border-danger': errors[0] }" ref="localRCS" @input="searchAddress('localRCS')" type="text" name="Lieu enregistrement RCS"
                  v-model="formData.localRCS" placeholder="" required />
                  <ul v-if="addresses['localRCS'].length > 0" ref="localRCSStyle" v-on:clickout="hideStyle('localRCSStyle')">
                  <li v-for="address in addresses['localRCS']" :key="address.id" @click="selectAddress(address.properties.label,'localRCS')">
                    {{ address.properties.label }}
                  </li>
                </ul>
                <label @click="labelClicked('localRCS')" v-on:clickout="labelClickeOut('localRCS')" :class="{ 'transformed-label': addresses['localRCS'].length > 0 || isLabelTransformed.localRCS }" for="localRCS">Lieu enregistrement RCS</label>
                <span :class="{ 'input-error': errors[0] }">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
            <base-button @click="handleSubmit(submit)" class="btn-rounded mt-5 white-text">Étape suivante <img class="ml-2"
                :src="svgArrowRight" /></base-button>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import "clickout-event";
import { Mixins } from "@/services/mixins.js";
export default {
  mixins: [Mixins],
  data() {
    return {
      svgInfo: require("../../../assets/svg/warning.svg"),
      svgArrow: require("../../../assets/svg/arrow-right-custom.svg"),
      svgArrowRight: require("../../../assets/svg/arrow-right.svg"),
      formData: this.$store.state.cgv_formData,
      searchAddressTimeOutID: null,
      localStyle: null,
      localRCSStyle: null,
      isLabelTransformed: {
        local: false,
        localRCS: false,
        denomination: false,
        numeroRCS: false,
        capital: false
      },
      addresses: {
        local: [],
        localRCS: [],
      },
      lastApiCallTime: 0,
      options: [
        { text: "Société par actions simplifée (SAS)", value: "SAS" },
        {
          text: "Société par actions simplifée unipersonnelle (SASU)",
          value: "SASU",
        },
        { text: "Société à responsabilité limitée (SARL)", value: "SARL" },
        {
          text: "Entreprise unipersonnelle à responsabilité limitée (EURL)",
          value: "EURL",
        },
        { text: "Entreprise individuelle (EI)", value: "EI" },
        { text: "Société anonyme (SA)", value: "SA" },
        { text: "Société en nom collectif (SNC)", value: "SNC" },
      ],
    };
  },
  mounted() {
    this.localStyle = this.$refs.localStyle;
    this.localRCSStyle = this.$refs.localRCSStyle;
  },
  methods: {
    searchAddress(input) {
      // Delay the api call to avoid reaching the rate limit (throttling).

      // We unregister the previous throttle if any
      if (this.searchAddressTimeOutID) {
        clearTimeout(this.searchAddressTimeOutID);
      }

      // Register a new throttle that will time out at 200 ms (we will do only 5 calls per second).
      this.searchAddressTimeOutID = setTimeout(() => {
        // Make sure that we have enough and not too much characters in the field.
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
    setHasValue(select) {
      if (select.value) {
        select.classList.add("has-value");
      } else {
        select.classList.remove("has-value");
      }
    },
    goNext() {
      this.$router.push("/gestion-cgv/moyens-de-contact");
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

.alert-info {
  color: black !important;
  background-color: #ffd100 !important;
  border-color: #ffd100 !important;
  font-weight: 600;
  font-size: medium;
  width: fit-content;
  margin: auto;
}
.border-bottom {
  border-bottom: 2px solid $errorInput !important;
}

.center-content {
  margin: auto;
  width: 60%;
  text-align: center;
  color: $text !important;

  p {
    font-weight: 400;
    color: $text !important;
  }
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
  select:focus + label,
  input:not(:placeholder-shown) + label,
  select + label {
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

  input,
  select {
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

  .pxSpan {
    position: absolute;
    top: 19px;
    right: 10px;
    font-size: 23px;
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
    width: 100px;
    height: 100px;
    border-radius: 50%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 30px;
  }

  .rounded-step.first {
    background-color: $blueStep !important;
  }

  img {
    width: 45px;
  }
}
</style>
