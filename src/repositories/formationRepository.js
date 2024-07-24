import Vue from "vue";
import cache from "@/services/cache";

export default {

	list(params) {

		if( 'search' in params && params.search.length )
			return cache.list('formation/course', params, 0);
		else
			return cache.list('formation/course', params);
	},

	get(id) {

		return new Promise((resolve, reject) => {

			Vue.http.get('formation/course/'+id).then(response => {

				resolve(response.body.response)

			}, response=>{

				reject(response);
			})
		});
	},

	search(type, id) {

		return new Promise((resolve, reject) => {

			Vue.http.get('formation/course/search', {params:{type:type, id:id}}).then(response => {

				resolve(response.body.response);

			}, reject)
		});
	}
};
