import Vue from "vue";
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";

import * as rules from "vee-validate/dist/rules";

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

// Custom rules
extend("required", {
  validate(value) {
    return {
      required: true,
      valid: ["", null, undefined].indexOf(value) === -1,
    };
  },
  computesRequired: true,
  message: "Ce champ est obligatoire",
});

extend("numeric", {
  validate(value) {
    return {
      required: true,
      valid: !isNaN(value),
    };
  },
  computesRequired: true,
  message: "Veuillez entrer un nombre valide",
});

extend("numRcs", {
  validate(value) {
    const isValid = /\d/.test(value) && !/\s/.test(value); // Check for digits and no spaces;
    return {
      required: true,
      valid: isValid,
    };
  },
  computesRequired: true,
  message: "Veuillez entrer un numéro RCS valide",
});

extend("numSIRET", {
  validate(value) {
    // Remove spaces from the entered value
    const cleanedValue = value.replace(/\s/g, "");

    // Check if the cleaned value contains only digits
    const isValid = /^\d+$/.test(cleanedValue);

    // Check if the length is exactly 14
    const isLengthValid = cleanedValue.length === 14;

    return {
      required: true,
      valid: isValid && isLengthValid,
    };
  },
  computesRequired: true,
  message: "Le numéro SIRET doit comporter 14 chiffres",
});

// Install vee-validate components globally
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
