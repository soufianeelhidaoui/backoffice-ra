import Vue from "vue";
import store from "@/services/store";

export default {

	get(path, params, ttl) {

		if( typeof ttl == 'undefined' )
			ttl = 36000;

		return new Promise((resolve, reject) => {

			let cachedData = false;

			if( ttl )
				cachedData = store.getters.data({type:path, params: params});

			if( cachedData ){

				resolve(cachedData.data);
			}
			else{

				Vue.http.get(path).then(response => {

					let serverData = response.body.response;

					store.commit('data', {
						params: params,
						type: path,
						ttl: ttl,
						data: serverData,
					});

					resolve(serverData);

				}, response=>{

					reject(response);
				});
			}
		});
	},

	clear(path) {

		store.dispatch('clear', path);
	},

	list(path, params, ttl) {

		if( typeof ttl == 'undefined' )
			ttl = 36000;

		return new Promise((resolve, reject) => {

			let cachedData = false;

			if( ttl || (typeof params == 'undefined' || typeof params.offset == 'undefined' || params.offset > 0))
				cachedData = store.getters.data({type:path, params: params});


			if( cachedData && (typeof params == 'undefined' || typeof params.offset == 'undefined' || cachedData.offset >= params.offset) && (!cachedData.count || cachedData.items.length ) ){

				resolve(cachedData);
			}
			else{

				Vue.http.get(path, { params: params }).then(response => {

					let items = [];
					let serverData = response.body.response;

					if( typeof params == 'undefined' || typeof params.offset == 'undefined' || params.offset === 0 || !cachedData )
						items = serverData.items;
					else
						items = cachedData.items.concat(serverData.items);

					let data = {
						items: items,
						limit: (params && 'limit' in params ? params.limit : 0),
						offset: (params && 'offset' in params ? params.offset : 0),
						count: serverData.count
					};

					store.commit('data', {
						params: params,
						type: path,
						ttl: ttl,
						data: data,
					});

					resolve(data);

				}, response=>{

					reject(response);
				});
			}
		})
	}
};
