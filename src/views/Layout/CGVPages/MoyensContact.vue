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
          <div class="rounded-step second">2</div>
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
        <ValidationObserver v-slot="{ handleSubmit }" ref="observer">
          <form>
            <ValidationProvider v-slot="{ errors }" rules="">
              <b-form-group
                class="field-group"
                label="Moyen de contact"
                v-slot="{ ariaDescribedby }"
              >
                <div class="checkbox-align-left">
                  <b-form-checkbox
                    :aria-describedby="ariaDescribedby"
                    v-for="option in options"
                    v-model="formData.moyenContact"
                    :key="option.value"
                    :value="option.text"
                    name="checkContact"
                  >
                    {{ option.text }}
                  </b-form-checkbox>
                </div>
                <span
                  v-show="!(formData.moyenContact.length > 0)"
                  class="input-error"
                  >Ce champ est obligatoire</span
                >
              </b-form-group>
            </ValidationProvider>
            <ValidationProvider rules="required|numeric" v-slot="{ errors }">
              <div class="field-group mt-4">
                <input
                  :class="{ 'border-bottom': errors[0] }"
                  type="text"
                  name="delaiPriseContact"
                  v-model="formData.delaiPriseContact"
                  placeholder=""
                  required
                  ref="delaiPriseContact"
                />
                <label  @click="labelClicked('delaiPriseContact')" v-on:clickout="labelClickeOut('delaiPriseContact')" :class="{ 'transformed-label': isLabelTransformed.delaiPriseContact }" for="delaiPriseContact">Délai de prise de contact</label>
                <span class="pxSpan" v-show="formData.delaiPriseContact"
                  >heures</span
                >
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
import { Mixins } from "@/services/mixins.js";
export default {
  mixins: [Mixins],
  data() {
    return {
      svgArrow: require("../../../assets/svg/arrow-right-custom.svg"),
      svgArrowRight: require("../../../assets/svg/arrow-right.svg"),
      formData: this.$store.state.cgv_formData,
      isLabelTransformed: {
        delaiPriseContact: false,
      },
      options: [
        { text: "Téléphone", value: "Tel" },
        { text: "E-mail", value: "E-mail" }
      ],
    };
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    goNext() {
      this.$router.push("/gestion-cgv/mediateur");
    },
    submit() {
      const isValid =
        this.$refs.observer.validate() && this.formData.moyenContact.length > 0;
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

fieldset {
  color: $blueTitle !important;
  font-size: 19px !important;
}

.border-bottom {
  border-bottom: 2px solid $errorInput !important;
}

.checkbox-align-left {
  width: 15%;
  margin: auto;
  text-align: left;
  align-self: center;
}

.input-error {
  font-size: 0.8rem;
  color: $errorInput;
}

form div.field-group {
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
  }

  .pxSpan {
    position: absolute;
    top: 19px;
    right: 10px;
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
