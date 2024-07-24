export const Mixins = {
	methods: {
		formatDate(data){

			if( !data || typeof data == 'undefined')
				return ' - ';

			const date = new Date(data);
			const options = { year: 'numeric', month: 'long', day: '2-digit',timeZone: 'Europe/Paris' };

			return date.toLocaleDateString('fr-FR', options)
		},
    formatDigitDate(timestamp){

      if( timestamp === false || typeof timestamp == 'undefined')
        return ' - ';

      const date = new Date(timestamp);
      const options = { year: 'numeric', month: '2-digit', day: '2-digit',timeZone: 'Europe/Paris' };

      return date.toLocaleDateString('fr-FR', options)
    },
    formatInputDate(timestamp){

      if( timestamp === false || typeof timestamp == 'undefined')
        return ' - ';

      const date = new Date(timestamp);
      return date.toISOString().slice(0, 10)
    },
    labelClicked(ref){
      this.isLabelTransformed[ref] = !this.isLabelTransformed[ref];
      this.$refs[ref].focus();
    },
    labelClickeOut(ref){
      this.isLabelTransformed[ref] = false;
    },
	}

};
