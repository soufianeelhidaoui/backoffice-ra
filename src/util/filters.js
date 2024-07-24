import Vue from 'vue'
import moment from 'moment';
/**
 * Filtre qui formate le timestamp en date au format Français
 * @param {*} value 
 */
Vue.filter('formatDDMMYYYY', value => {
  let date = moment(+value * 1000).format('DD/MM/YYYY')
  return date
})
/**
 * Formate un nombre en euros
 * @param {*} value 
 * @returns 
 */
Vue.filter('formatEuro', value => {

  if (!value && value !== 0) return 0;

  value /= 100;

  let format = (+value).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',

    minimumFractionDigits: 2
  })
  return format
})
