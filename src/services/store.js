import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import jwt_decode from "jwt-decode";
import moment from "moment";
axios.defaults.headers.common = {
	Authorization: `bearer ${localStorage.getItem("jwt")}`,
};
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		config: false,
		popin: false,
		user: false,
		selected_commande: null,
		kvps: [],
		selected_kvps: {},
		commandes: {
			items: [],
		},
		statsCommandes: {},
		loading: {
			login: false,
			orders: false,
			statsOrders: false,
			post_prices: false,
			post_cgv: false,
		},
		cgv_formData: {
			denomination: "",
			societyNature: "Société par actions simplifée (SAS)",
			capital: "",
			local: "",
			numeroRCS: "",
			localRCS: "",
			delaiPriseContact: "72",
			moyenContact: ["Téléphone"],
			nomMediateur: "",
			adressMediateur: "",
			nSIRET: "",
			delaiRetraitCommande: "10",
			delaiSupplementaire: "8",
			delaiAvantEnvoi: "10",
			delaiAvantAnnulation: "8",
			docResult: "",
			error: null,
			success: null,
		},
		brandToSiteAccessoires: {
			vw: "https://accessoires.volkswagen.fr/",
			vwu: "https://accessoires.volkswagen-utilitaires.fr/",
			cupra: "https://accessoires.cupra.fr/",
			seat: "https://accessoires.seat.fr/",
			skoda: "https://accessoires.skoda.fr/",
		},
		brand: {
			vw: "volkswagen",
			vwu: "volkswagen utilitaires",
			cupra: "cupra",
			seat: "seat",
			skoda: "skoda",
		},
		brandToContact: {
			vw: "https://www.volkswagen.fr/fr/footer/service-relations-clients.html",
			vwu: "https://www.volkswagen-utilitaires.fr/fr/vw/contact.html",
			cupra: "https://www.cupraofficial.fr/contact",
			seat: "https://www.seat.fr/entreprise/contact",
			skoda: "https://www.skoda.fr/informations/nous-contacter",
		},
	},
	getters: {
		config: (state) => () => {
			return state.config;
		},
		user: (state) => () => {
			return state.user;
		},
		popin: (state) => () => {
			return state.popin;
		},
		commandes: (state) => () => {
			return state.commandes;
		},
		getSelectedCommande: (state) => () => {
			return state.selected_commande;
		},
		getKvps: (state) => () => {
			return state.kvps;
		},
		getSelectedKvps: (state) => () => {
			return state.selected_kvps;
		},
		getLoading: (state) => () => {
			return state.loading;
		},
		getStatsCommandes: (state) => () => {
			return state.statsCommandes;
		},
		getCgvFormData: (state) => () => {
			return state.cgv_formData;
		},
	},
	mutations: {
		config(state, config) {
			state.config = config;
		},
		user(state, user) {
			state.user = user;
		},
		popin(state, popin) {
			state.popin = popin;
		},
		set_loading(state, type) {
			state.loading[type] = !state.loading[type];
		},
		set_commandes(state, commandes) {
			state.commandes = commandes;
		},
		set_selected_commande(state, commande) {
			state.selected_commande = commande;
		},
		set_kvps(state, kvps) {
			state.kvps = kvps;
		},
		set_selected_kvps(state, selected_kvps) {
			state.selected_kvps = selected_kvps;
			localStorage.setItem("kvps_actif", JSON.stringify(selected_kvps));
		},
		set_token(state, jwt) {
			localStorage.setItem("jwt", jwt);
		},
		set_stats_commandes(state, stats) {
			state.statsCommandes = stats;
		},
		set_cgvFormData(state, cgv_formData) {
			state.cgv_formData = cgv_formData;
		},
		set_cgvFeedback(state, error, success) {
			state.cgv_formData.error = error;
			state.cgv_formData.success = success;
		},
	},
	actions: {
		setSelectedCommande({ commit }, commande) {
			let find_commande = this.state.commandes.items.find((item) => item.number == commande.item.ref);
			commit("set_selected_commande", find_commande);
		},
		setCommandes({ commit }, commandes) {
			commit("set_commandes", commandes);
		},
		setKvps({ commit }, kvps) {
			commit("set_kvps", kvps);
		},
		setToken({ commit }, token) {
			commit("set_token", token);
		},
		setSelectedKvps({ commit }, selected_kvps) {
			commit("set_selected_kvps", selected_kvps);
		},
		/**
		 * Appel HTTP Get du login
		 * Réception des KVPS
		 * @param {*} param0
		 * @param {*} tokenVGF
		 */
		async login({ commit }, data) {
			try {
				commit("set_loading", "login");
				//Quand disponible mettre le token VGF en param
				const response = await axios.post(
					`${process.env.VUE_APP_BUSINESS_API_ENDPOINT}/auth/login`,
					{
						authToken: data.authToken,
						appID: data.appID,
					},
				);
				commit("set_token", response.data.token);
				axios.defaults.headers.common = {
					Authorization: `bearer ${localStorage.getItem("jwt")}`,
				};
				let decoded = jwt_decode(response.data.token);
				localStorage.setItem("contracts", JSON.stringify(decoded.contracts));
				localStorage.setItem("isOnBoarded", decoded.contracts.length > 0);
				const kvps_actif = localStorage.getItem("kvps_actif")
				commit("set_kvps", decoded.contracts);
				//Si on a déjà un kvps d'actif
				if (kvps_actif && kvps_actif !== 'undefined') {
					let kvps = JSON.parse(kvps_actif);
					let find = decoded.contracts.find((c) => c.kvps == kvps.kvps);
					//Et qu'il est dans notre liste
					if (find) {
							commit("set_selected_kvps", kvps);
					} else {
						commit("set_selected_kvps", decoded.contracts[0])
					}
				} else {
					commit("set_selected_kvps", decoded.contracts[0]);
					localStorage.setItem(
							"kvps_actif",
							JSON.stringify(decoded.contracts[0]),
					);
				}

				commit("set_loading", "login");
			} catch (error) {
				const vm = new Vue();
				vm.$bvToast.toast("Erreur lors de la connexion", {
					title: "Erreur",
					variant: "danger",
					solid: true,
				});
			}
		},
		/**
		 * Appel HTTP Get des commandes
		 * @param {*} param0
		 * @param {*} page La page voulue
		 * @param {*} filter Le type de filtre (confirmed, new, ...)
		 *
		 */
		async orders({ commit, state }, { limit, offset, filter, sort, order }) {
			try {
				let baseUrl = `${process.env.VUE_APP_BUSINESS_API_ENDPOINT}/orders?&sort=${sort}&order=${order}`;
				let allOrders = [];
				commit("set_loading", "orders");
				if (filter) {
					let url = baseUrl + `&state=${filter}`;
					const response = await axios.get(url, {
						headers: {
							"x-kvps": state.selected_kvps.kvps,
							"brand": state.selected_kvps.brand,
						},
					});
					allOrders = response.data.items;
				} else {
					const states = [
						"new",
						"confirmed",
						"fulfilled",
						"completed",
						"cancelled",
					];
					for (const currentState of states) {
						let url = baseUrl + `&state=${currentState}`;

						const response = await axios.get(url, {
							headers: {
								"x-kvps": state.selected_kvps.kvps,
								"brand": state.selected_kvps.brand,
							},
						});
						allOrders = allOrders.concat(response.data.items);
					}
				}
				allOrders.sort((a, b) => {
					const parseDate = (date) => moment(date, "DD/MM/YYYY");
					const compare = (a, b) =>
						a < b
							? order === "asc"
								? -1
								: 1
							: a > b
								? order === "asc"
									? 1
									: -1
								: 0;

					const keyA = sort === "createdAt" ? parseDate(a[sort]) : a[sort];
					const keyB = sort === "createdAt" ? parseDate(b[sort]) : b[sort];

					return compare(keyA, keyB);
				});

				// Apply the limit and offset to the orders
				const paginatedOrders = allOrders.slice(offset, offset + limit);
				commit("set_commandes", { items: paginatedOrders });
				commit("set_loading", "orders");
			} catch (error) {
				const vm = new Vue();
				vm.$bvToast.toast("Erreur lors du chargement des commandes", {
					title: "Erreur",
					variant: "danger",
					solid: true,
				});
			}
		},
		/**
		 * Appel HTTP Get d'une commande'
		 * @param {*} param0
		 * @param {*} id Id de la commande
		 *
		 */
		async getOneOrder({ commit, state }, { id }) {
			try {
				//Quand disponible mettre le token VGF en param
				commit("set_loading", "orders");
				const response = await axios.get(
					`${process.env.VUE_APP_BUSINESS_API_ENDPOINT}/order/${id}`,
					{
						headers: {
							"x-kvps": state.selected_kvps.kvps,
							"brand": state.selected_kvps.brand,
						},
					},
				);
				commit("set_selected_commande", response.data);
				commit("set_loading", "orders");
			} catch (error) {
				const vm = new Vue();
				vm.$bvToast.toast("Erreur lors du chargement d'une commande", {
					title: "Erreur",
					variant: "danger",
					solid: true,
				});
			}
		},
		/**
		 * Appel HTTP Get des commandes
		 * @param {*} param0
		 *
		 */
		async updateOrder({ commit, state }, datas) {
			try {
				//Quand disponible mettre le token VGF en param
				commit("set_loading", "orders");
				const response = await axios.post(
					`${process.env.VUE_APP_BUSINESS_API_ENDPOINT}/order/${datas.id}`,
					datas,
					{
						headers: {
							"x-kvps": state.selected_kvps.kvps,
            "brand": state.selected_kvps.brand,
						},
					},
				);
				commit("set_loading", "orders");
			} catch (error) {
				const vm = new Vue();
				vm.$bvToast.toast("Erreur lors de la sauvegarde de la commande", {
					title: "Erreur",
					variant: "danger",
					solid: true,
				});
			}
		},
		/**
		 * Appel HTTP Get des statistiques des commandes
		 * @param {*} param0
		 * @param {*} tokenVGF
		 */
		async statsOrders({ commit, state }) {
			try {
				//Quand disponible mettre le token VGF en param
				commit("set_loading", "statsOrders");
				const response = await axios.get(
					`${process.env.VUE_APP_BUSINESS_API_ENDPOINT}/orders/stats`,
					{
						headers: {
							"x-kvps": state.selected_kvps.kvps,
            	"brand": state.selected_kvps.brand,
						},
					},
				);
				commit("set_stats_commandes", response.data);
				commit("set_loading", "statsOrders");
			} catch (error) {
				const vm = new Vue();
				vm.$bvToast.toast("Erreur lors du chargement des stats", {
					title: "Erreur",
					variant: "danger",
					solid: true,
				});
			}
		},
		/**
		 * Appel HTTP POST du fichier de prix
		 * @param {*} param0
		 *
		 */
		async getPrices({ commit, state }) {
			try {
				commit("set_loading", "get_prices");
				const response = await axios.get(
					`${process.env.VUE_APP_BUSINESS_API_ENDPOINT}/prices`,
					{
						headers: {
							"x-kvps": state.selected_kvps.kvps,
							"brand": state.selected_kvps.brand,
						},
						responseType: "blob",
					},
				);
				commit("set_loading", "get_prices");
				// create file link in browser's memory
				const href = URL.createObjectURL(response.data, {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				});

				// create "a" HTML element with href to file & click
				const link = document.createElement("a");
				link.href = href;
				link.setAttribute("download", "file.xlsx"); //or any other extension
				document.body.appendChild(link);
				link.click();

				// clean up "a" element & remove ObjectURL
				document.body.removeChild(link);
				URL.revokeObjectURL(href);
				return response.data;
			} catch (error) {
				const vm = new Vue();
				vm.$bvToast.toast("Erreur lors de l'envoi des prix", {
					title: "Erreur",
					variant: "danger",
					solid: true,
				});
			}
		},
		/**
		 * Appel HTTP POST du fichier de prix
		 * @param {*} param0
		 *
		 */
		async postPrices({ commit, state }, datas) {
			try {
				let formData = new FormData();
				formData.append("file", datas.file);
				//Quand disponible mettre le token VGF en param
				commit("set_loading", "post_prices");
				const response = await axios.post(
					`${process.env.VUE_APP_BUSINESS_API_ENDPOINT}/prices`,
					formData,
					{
						headers: {
							"content-type": "multipart/form-data",
							"x-kvps": state.selected_kvps.kvps,
            	"brand": state.selected_kvps.brand,
						},
					},
				);
				commit("set_loading", "post_prices");
				return {
					success: true,
					error: false,
					updatedTotal: response.data.updatedTotal,
				};
			} catch (error) {
				const vm = new Vue();
				commit("set_loading", "post_prices");
				vm.$bvToast.toast("Erreur lors de l'envoi des prix", {
					title: "Erreur",
					variant: "danger",
					solid: true,
				});

				return { success: false, error: true, updatedTotal: null };
			}
		},
		/**
		 * Appel HTTP POST du fichier des conditions générales de ventes
		 * @param {*} param0
		 *
		 */
		async postCGV({ commit, state }, datas) {
			try {
				let formData = new FormData();
				formData.append("file", datas.file, `${datas.kvps}.pdf`);
				//Quand disponible mettre le token VGF en param
				commit("set_loading", "post_cgv");
				const response = await axios.post(
					`${process.env.VUE_APP_BUSINESS_API_ENDPOINT}/terms`,
					formData,
					{
						headers: {
							"content-type": "multipart/form-data",
							"x-kvps": state.selected_kvps.kvps,
            	"brand": state.selected_kvps.brand,
						},
					},
				);
				commit("set_loading", "post_cgv");
				commit("set_cgvFeedback", false, true);
				return { success: true, error: false };
			} catch (error) {
				commit("set_loading", "post_cgv");
				commit("set_cgvFeedback", true, false);
				const vm = new Vue();
				vm.$bvToast.toast("Erreur lors de l'envoi des CGV", {
					title: "Erreur",
					variant: "danger",
					solid: true,
				});
			}
			return { success: false, error: true };
		},
	},
});

export default store;
