<template>
  <div id="home">
    <b-breadcrumb class="mt-4 ml-4 custom-breadcrumb">
      <b-breadcrumb-item>Accueil</b-breadcrumb-item>
      <b-breadcrumb-item active>Gestion des CGV</b-breadcrumb-item>
    </b-breadcrumb>

    <h1 class="my-5 ml-5">Valider vos CGV</h1>
    <b-alert show class="my-3 info">
      <img class="mr-2" :src="svgRight" /> Vos CGV ont bien été générées, les
      voici
    </b-alert>

    <div class="mt-5 mx-5">
      <VueEditor class="px-6 pt-6" v-model="content">
      </VueEditor>

      <vue-html2pdf :show-layout="false" :float-layout="true" :enable-download="false" :preview-modal="true"
        filename="cgvpdf" :pdf-quality="2" pdf-format="a4" pdf-orientation="portrait" pdf-content-width="750px"
        @beforeDownload="beforeDownload($event)" @progress="onProgress($event)" @startPagination="startPagination()"
        @hasPaginated="hasPaginated()" :paginate-elements-by-height="1100" :htmlToPdfOptions="opt" ref="html2Pdf">
        <template slot="pdf-content">
          <div class="pl-5 text-dark" v-html="content"></div>
        </template>
      </vue-html2pdf>

      <div class="d-flex flex-row align-items-baseline justify-content-end my-5">
        <div class="dark-text text-underline mr-5" @click="goback">
          Étape précédente
        </div>
        <div v-if="previewSpinner" class="mt-5 mr-5 align-items-center" id="spinner">
          Chargement des CGV
          <span class="spinner-border ml-3" role="status">
          </span>
        </div>
        <base-button v-else @click="previewDoc" type="info" class="mr-5 mt-5 align-items-center btn-rounded dark-text">
          Prévisualiser &#62&#62&#62
        </base-button>

        <div v-if="sendCGVSpinner" class="mt-5 mr-5 align-items-center" id="spinner">
          Envoi des CGV
          <span class="spinner-border ml-3" role="status">
          </span>
        </div>
        <base-button v-else @click="sendCGV" class="btn-rounded mt-5 align-items-center white-text"><img class="mr-1"
            :src="svgFileAdd" /> Valider
          vos CGV
        </base-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { VueEditor } from "vue2-editor";
import VueHtml2pdf from "vue-html2pdf";
import htmldoc from "./TemplateCGV/cgv.html";
import { ref } from "vue";

export default {
  components: { VueEditor, VueHtml2pdf },
  data() {
    return {
      formData: this.$store.state.cgv_formData,
      brand: this.$store.state.brand,
      siteAccess: this.$store.state.brandToSiteAccessoires,
      contactAcess: this.$store.state.brandToContact,
      previewModal: true,
      cgvModal: true,
      svgRight: require("../../../assets/svg/right.svg"),
      svgFileAdd: require("../../../assets/svg/right.svg"),
      content: ref(''),
      kvps: null,
      file: null,
      previewSpinner: false,
      sendCGVSpinner: false,
      opt: {
        enableLinks: true,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          dpi: 192,
          scale: 4,
          letterRendering: true
        },
      }
    };
  },
  computed: {
    ...mapGetters(['getSelectedKvps', 'getLoading']),
  },
  mounted() {
    this.content = this.processHtml(htmldoc);
    this.kvps = this.getSelectedKvps().kvps;
  },
  methods: {
    ...mapActions(['postCGV']),
    showErrorToast(message) {
      const vm = this.$root;
      vm.$bvToast.toast(message, {
        title: 'Erreur',
        variant: 'danger',
        solid: true,
      });
    },
    onProgress(progress) {
      this.previewSpinner = progress < 100 && this.previewModal == false;
    },
    processHtml(html) {
      const selectedBrand = this.getSelectedKvps().brand;
      const brandName = this.brand[selectedBrand];
      const siteAccessoire = this.siteAccess[selectedBrand];
      const contactAcess = this.contactAcess[selectedBrand];
      var variableMapping = {
        date: '19/09',
        website: siteAccessoire,
        brand: brandName.toUpperCase(),
        contact: contactAcess,
        DENOMINATION_SOCIALE: this.formData.denomination,
        NATURE_DE_LA_SOCIETE: this.formData.societyNature,
        MONTANT_DU_CAPITAL_SOCIAL: this.formData.capital,
        LIEU_DU_SIEGE_SOCIAL: this.formData.local,
        LIEU: this.formData.localRCS,
        NUMERO: this.formData.numeroRCS,
        TEL_MAIL_AUTRE: this.formData.moyenContact.length > 1 ? this.formData.moyenContact.join(' ou ') : this.formData.moyenContact,
        NOM_DU_MEDIATEUR: this.formData.nomMediateur,
        ADRESSE_DU_MEDIATEUR: this.formData.adressMediateur,
        NUMERO_SIRET_DU_MEDIATEUR: this.formData.nSIRET,
        DELAI_POUR_LE_RETRAIT: this.formData.delaiRetraitCommande,
        DELAI_SUPPLEMENTAIRE: this.formData.delaiSupplementaire,
        DELAI_AVANT_ENVOI: this.formData.delaiAvantEnvoi,
        DELAI_AVANT_ANNULATION: this.formData.delaiAvantAnnulation,
        DELAI_PRISE_CONTACT: this.formData.delaiPriseContact,
      }
      // Replace variables in the HTML content
      for (const [key, value] of Object.entries(variableMapping)) {
        html = html.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
      }
      return html;
    },

    async beforeDownload({ html2pdf, options, pdfContent }) {
      try {
        const pdf = await html2pdf().set(options).from(pdfContent).outputPdf('blob');
        this.file = pdf;
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    },
    goback() {
      this.$router.go(-1);
    },
    goNext() {
      this.$router.push("/gestion-cgv");
    },
    previewDoc() {
      const isEmptyContent = this.content.replace(/<[^>]+>|style="[^"]+"/gi, '') === '';

      if (isEmptyContent) {
        this.previewSpinner = false;
        this.showErrorToast('Les CGV sont obligatoires et ne doivent pas être vides.');
        return;
      } else {
        this.previewModal = false;
        this.cgvModal = true;
        this.$refs.html2Pdf.generatePdf();
      }

    },
    hideSpinnerAndGoNext() {
      setTimeout( () => {
        if (this.file !== null && this.kvps !== null) {
           this.postCGV({ file: this.file, kvps: this.kvps });
        }
        this.sendCGVSpinner = false; // Hide the spinner
        this.goNext();
      }, 3800);
    },
    async sendCGV() {
      this.cgvModal = false;
      this.previewModal = true;
      this.sendCGVSpinner = true
      const isEmptyContent = this.content.replace(/<[^>]+>|style="[^"]+"/gi, '') === '';

      if (isEmptyContent) {
        this.sendCGVSpinner = false;
        this.showErrorToast('Les CGV sont obligatoires et ne doivent pas être vides.');
      } else {
        this.formData.docResult = this.content;
        this.$refs.html2Pdf.generatePdf();
        this.$store.commit('set_cgvFormData', this.formData);
        await this.$nextTick();
        this.hideSpinnerAndGoNext();
      }
    }
  },
};
</script>
<style lang="scss" scoped>
$blueTitle: #102c5b;
$text: #000000;
$blueStep: #001e50;
$grayStep: #c2cacf;

h1 {
  font-weight: 700;
  font-size: 56px;
  line-height: 72px;
}

strong {
  font-weight: 700 !important;
}

#spinner {
  color: $blueStep;
}

.alert-info {
  color: white !important;
  background-color: #029640 !important;
  border-color: #029640 !important;
  font-weight: 500;
  font-size: medium;
  width: fit-content;
  margin: auto;
}

.text-underline {
  color: $blueStep !important;
  text-decoration: underline !important;
  cursor: pointer !important;
}
</style>
