import Vue from "vue";
import store from "@/services/store";
import router from '@/routes/router'

export default {

	get() {
		return new Promise((resolve, reject) => {
			Vue.http.get('user').then(response => {

				let user = response.body.response;

				if(router.app.$route.name === 'login')
					router.push({ name: 'home'});

				store.commit('user', user);

				if( resolve )
					resolve(user);

			}).catch(reject);
		})
	},

	create(form) {

		return Vue.http.post('user', form)
	},

	requestPassword(login) {

		return Vue.http.get('user/password/'+login)
	},

	resetPassword(login, form) {

		return Vue.http.post('user/password/'+login, form)
	},

	refresh() {

		return new Promise((resolve, reject) => {

			Vue.http.post('user/refresh', {refresh_token: localStorage.getItem('refresh_token')}).then(response => {

				let token = response.headers.get('X-Auth-Token');
				let refresh_token = response.headers.get('X-Refresh-Token');

				if( token )
					localStorage.setItem('token', token);

				if( refresh_token )
					localStorage.setItem('refresh_token', refresh_token);

				resolve();

			}).catch(reject)
		})
	},

	login(form) {

		return new Promise((resolve, reject) => {

      let from = localStorage.getItem('from');
      localStorage.clear();

			Vue.http.post('user/login', form).then(response => {

				let data = response.body.response;

				if(form.remember)
					localStorage.setItem('login', form.login);

				let token = response.headers.get('X-Auth-Token');
				let refresh_token = response.headers.get('X-Refresh-Token');

				if( token )
					localStorage.setItem('token', token);

				if( refresh_token )
					localStorage.setItem('refresh_token', refresh_token);

        store.commit('user', data);

        resolve(data);

			}).catch(response => {

				reject(response.body);
			})
		})
	},

	logout(){

		return new Promise((resolve, reject) => {

			Vue.http.post('user/logout', {refresh_token: localStorage.getItem('refresh_token')}).then(response => {

				let login = localStorage.getItem('login');
				localStorage.clear();

				if( login )
					localStorage.setItem('login', login);

				let prop = router.resolve({name: 'login'});

				window.location.href = prop.href;

				resolve();

			}).catch(response => {

				let login = localStorage.getItem('login');
				localStorage.clear();

				if( login )
					localStorage.setItem('login', login);

				let prop = router.resolve({name: 'login'});

				window.location.href = prop.href;

				reject(response.body);
			})
		})
	}
};
