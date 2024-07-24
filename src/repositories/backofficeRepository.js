import Vue from "vue";
import axios from 'axios'
let server_url = process.env.VUE_APP_BUSINESS_API_ENDPOINT;

export default {

	listOrders(params) {
        return new Promise((resolve, reject) => {

			Vue.http.get('listOrder').then(response => {

				resolve(response.body.response)

			}, response=>{

				reject(response);
			})
		});
	},
	viewOrder(params) {
        return new Promise((resolve, reject) => {

			Vue.http.get('viewOrder').then(response => {

				resolve(response.body.response)

			}, response=>{

				reject(response);
			})
		});
	},
	updateOrder(params) {
        return new Promise((resolve, reject) => {

			Vue.http.post('updateOrder').then(response => {

				resolve(response.body.response)

			}, response=>{

				reject(response);
			})
		});
	},
	updatePrices(params) {
        return new Promise((resolve, reject) => {

			Vue.http.post('updatePrices').then(response => {

				resolve(response.body.response)

			}, response=>{

				reject(response);
			})
		});
	},
	updateTerms(params) {
        return new Promise((resolve, reject) => {

			Vue.http.post('updateTerms').then(response => {

				resolve(response.body.response)

			}, response=>{

				reject(response);
			})
		});
	},
	getTerms(params) {
        return new Promise((resolve, reject) => {

			Vue.http.get('getTerms').then(response => {

				resolve(response.body.response)

			}, response=>{

				reject(response);
			})
		});
	},
	getPrices(params) {
        return new Promise((resolve, reject) => {

			Vue.http.get('getPrices').then(response => {

				resolve(response.body.response)

			}, response=>{

				reject(response);
			})
		});
	},
	getOrderStats(params) {
        return new Promise((resolve, reject) => {

			Vue.http.get('getOrderStats').then(response => {

				resolve(response.body.response)

			}, response=>{

				reject(response);
			})
		});
	},
	login(params) {
        return new Promise((resolve, reject) => {
			axios.get(`${server_url}/login`).then(response => {
				console.log(response);
				resolve(response.body.response)

			}, response=>{

				reject(response);
			})
		});
	},

	
};
