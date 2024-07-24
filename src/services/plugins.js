import eventBus from "@/services/event-bus";

export default {
  install(Vue, options) {
    Vue.prototype.$popin = function (type, data, closeable) {

      if (typeof closeable == 'undefined')
        closeable = true;

      this.$store.commit('popin', {
        type: type,
        data: data,
        closeable: closeable
      });
    };

    Vue.prototype.$update = function(callback){

      if( typeof callback == 'undefined')
        eventBus.$emit('update');
      else
        eventBus.$on('update', callback);
    };
  }
}
