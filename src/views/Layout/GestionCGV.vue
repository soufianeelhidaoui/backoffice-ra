<template>
    <div id="home">
        <b-breadcrumb class="mt-4 ml-4 custom-breadcrumb">
            <b-breadcrumb-item>Accueil</b-breadcrumb-item>
            <b-breadcrumb-item active>Gestion des CGV</b-breadcrumb-item>
        </b-breadcrumb>
        <h1 class="my-5 ml-5">Gestion des CGV</h1>
        <cgvValidationMessage v-show="shouldShowComponent" @modify-cgv-clicked="handleModifyCgvClicked"></cgvValidationMessage>
        <div v-show="!shouldShowComponent" class="center-content py-5">
            <p class="mt-2">Volkswagen Groupe France met à votre disposition un modèle de conditions générales de ventes à
                compléter.</p>
            <base-button @click="customizeCGV" outline class=" btn-rounded mt-2 mb-5 dark-text"><img class="mr-2"
                    :src="svgDownloadDark" />Utiliser le modèle de CGV</base-button>
            <p class="mt-5">Si vous disposez de vos propres conditions générales de ventes, vous pouvez les importer ici
                directement.</p>
            <base-button @click="openModalImport" type="info" class=" btn-rounded mt-2 dark-text"><img class="mr-2"
                    :src="svgDownloadDark" />Importer mes CGV</base-button>
        </div>
        <b-modal size="lg" ref="modal-import-cgv" id="modal-1" :hide-footer="true">
            <div v-if="!getLoading().send_cgv && !error && !success"
                class="d-flex flex-column align-items-center justify-content-center">
                <h2 class="mb-3">Importer vos CGV</h2>
                <p class="text-danger" v-if="error">{erreur}</p>
                <div class="d-flex flex-column align-items-center justify-content-center">
                    <b-form-file v-model="file" placeholder="Selectionnez votre fichier"
                        drop-placeholder="Glissez votre fichier ici..."></b-form-file>
                    <p class="text-center" v-if="textModal != ''">{{ textModal }}</p>
                    <p class="text-center" v-else>Attention, une fois chargés vos CGV seront mises à disposition sur le site
                        accessoire correspondant. Êtes-vous sur de vouloir continuer ?</p>
                    <base-button @click="sendCGV" type="info" class="btn-rounded mt-5 dark-text">Charger</base-button>
                    <base-button v-if="error" type="outline-primary" class="btn-rounded mt-5 dark-text">En savoir
                        plus</base-button>
                </div>
            </div>
            <div v-if="getLoading().send_cgv" class="d-flex flex-column align-items-center justify-content-center">
                <h2>Le fichier est en cours de chargement</h2>
                <loadingPanel />
            </div>
            <div v-if="success" class="d-flex flex-column align-items-center justify-content-center">
                <h2>Le fichier a été chargé avec succès</h2>
                <p>Merci!</p>
                <p>Vos cgv ont bien été chargées.</p>
                <b-form-checkbox id="checkbox-1" v-model="cgv_checked" name="checkbox-1" value="accepted"
                    unchecked-value="not_accepted">
                    Je confirme que les CGV importées sont bien celles que je souhaite appliquer.
                </b-form-checkbox>
                <base-button type="info" class="btn-rounded mt-5 dark-text">Terminer</base-button>
            </div>
        </b-modal>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import loadingPanel from '../../../src/components/LoadingPanel'
import cgvValidationMessage from '../../../src/components/CgvValidationMessage'
export default {
    components: {
        loadingPanel, cgvValidationMessage
    },
    methods: {
        ...mapActions(['postCGV']),
        openModalImport() {
            this.$refs['modal-import-cgv'].show()
        },
        sendCGV() {
            this.postCGV({ file: this.file, kvps: this.getSelectedKvps().kvps })
        },
        customizeCGV() {
            this.$router.push('/gestion-cgv/mention-legale')
        },
        handleModifyCgvClicked() {
            this.cgv_formData.error= null;
            this.cgv_formData.success= null;
            this.cgv_formData.docResult="";
            this.$store.commit('set_cgvFormData', this.cgv_formData);
            this.shouldShowComponent = this.$store.state.cgv_formData.docResult;
        }
    },
    data() {
        return {
            error: null,
            loading: null,
            file: null,
            success: null,
            textModal: "",
            cgv_checked: false,
            svgDownloadDark: require('../../assets/svg/download-dark.svg'),
            shouldShowComponent: this.$store.state.cgv_formData.docResult !== '',
            cgv_formData: this.$store.state.cgv_formData
        }
    },
    computed: {
        ...mapGetters(['getSelectedKvps', 'getLoading']),
    },
};
</script>
<style lang="scss">
$violet: #7A36B4;
$blueTitle : #102C5B;
$text: #000000;
$textGray: #666666;
$blueStep: #001E50;
$infoBtn: #00b0f0;
 
h1 {
    font-weight: 700;
    font-size: 56px;
    line-height: 72px;
}
 
.center-content {
    margin: auto;
    width: 60%;
    text-align: center;
 
    p {
        color: $textGray;
        font-weight: 400;
    }
 
    h2 {
        color: $blueTitle;
    }
}
 
.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
 
    .rounded-step {
        background-color: $blueStep;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
 
    img {
        width: 45px;
    }
}
 
.rounded-infos {
    background-color: $blueStep;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
}
 
.rounded-infos:hover {
    cursor: pointer;
    background-color: #0082D6;
}
 
.custom-tooltip {
    border: 1px solid grey;
    border-radius: 2.25rem;
}
</style>