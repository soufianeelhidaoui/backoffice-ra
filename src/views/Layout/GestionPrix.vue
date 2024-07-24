<template>
    <div id="home">
        <b-breadcrumb class="mt-4 ml-4 custom-breadcrumb">
            <b-breadcrumb-item>Commande</b-breadcrumb-item>
            <b-breadcrumb-item active>Gestion des prix</b-breadcrumb-item>
        </b-breadcrumb>
        <h1 class="my-5 ml-5">Gestion des prix</h1>

        <div class="center-content">
            <div class="d-flex flex-row align-items-baseline justify-content-center">
                <div>
                    <p>Pour modifier vos tarifs pour votre KVPS marque {{ getSelectedKvps().kvps }},</p>
                    <p>vous devez télécharger et éditer le fichier de prix conseillés actuellement en ligne.</p>
                </div>
                <div id="tooltip-button-interactive" class="rounded-infos ml-3">
                    <img :src="svgInfos">
                </div>
                <b-popover variant="light" placement="topright" target="tooltip-button-interactive" triggers="hover"><img :src="svgDownloadDark"> Télécharger le tutoriel</b-popover>
                <!-- <b-tooltip custom-class="custom-tooltip" variant="light" placement="topright" target="tooltip-button-interactive"><img :src="svgDownloadDark"> Télécharger le tutoriel</b-tooltip> -->
            </div>

            <div class="my-5 pb-5 d-flex">
                <div class="step">
                    <div class="rounded-step">
                        <img :src="svgDownload">
                    </div>
                    <p class="mt-3"><strong>Téléchargez</strong> le fichier des prix conseillés</p>
                </div>
                <img :src="svgArrowRight" class="mb-5">
                <div class="step">
                    <div class="rounded-step">
                        <img :src="svgFileAdd">
                    </div>
                    <p class="mt-3"><strong>Remplissez</strong> la colonne Prix pratiqués sans modifier le reste du fichier</p>
                </div>
                <img :src="svgArrowRight" class="mb-5">
                <div class="step">
                    <div class="rounded-step">
                        <img :src="svgFileChecked">
                    </div>
                    <p class="mt-3"><strong>Enregistrez</strong> vos modifications</p>
                </div>
                <img :src="svgArrowRight" class="mb-5">
                <div class="step">
                    <div class="rounded-step">
                        <img :src="svgUpload">
                    </div>
                    <p class="mt-3"><strong>Importez </strong>le fichier modifié</p>
                </div>
            </div>
            <div class="d-flex justify-content-center my-5">
                <base-button outline type="primary" class="btn-rounded" @click="downloadPrices"><img :src="svgDownloadDark"></img>Télécharger le fichier prix conseillés <span class="toCapitalFirst">{{ getSelectedKvps().brand }}</span></base-button>
                <base-button type="info" class="btn-rounded dark-text" @click="openModalImport"><img :src="svgDownloadDark"></img>Importer votre fichier de prix pratiqués</base-button>
            </div>
            <b-modal size="lg" ref="modal-import-price" id="modal-1" :hide-footer="true">
                <div v-if="!getLoading().post_prices && !error && !success" class="d-flex flex-column align-items-center justify-content-center">
                    <h2 class="mb-3">Importer le fichier prix pratiqués</h2>
                    <p class="text-center" v-if="textModal != ''">{{ textModal }}</p>
                    <p class="text-center" v-else>Attention, une fois chargés vos prix pratiqués seront appliqués sur le site accessoire correspondant. Êtes-vous sur de vouloir continuer ?</p>
                    <div class="d-flex flex-column align-items-center justify-content-center">
                        <b-form-file v-model="file" placeholder="Selectionnez votre fichier" drop-placeholder="Glissez votre fichier ici..."></b-form-file>
                        <base-button @click="sendPrices" :disabled="file == null" :loading="getLoading().post_prices" type="info" class="btn-rounded mt-5 dark-text">Charger</base-button>
                    </div>
                </div>
                <div v-if="getLoading().post_prices" class="d-flex flex-column align-items-center justify-content-center">
                    <h2>Le fichier est en cours de chargement</h2>
                    <loadingPanel />
                </div>
                <div v-if="success || error" class="d-flex flex-column align-items-center justify-content-center">
                    <div v-if="success" class="d-flex flex-column align-items-center justify-content-center">
                        <h2>Le fichier a été chargé avec succès</h2>
                        <p v-if="updatedTotal > 0">Vos prix pratiqués ont été correctement chargés pour {{ updatedTotal }} références.</p>
                        <p v-if="updatedTotal > 0">Sans action de votre part pour les autres références, le prix conseillé sera appliqué par défaut.</p>
                        <p v-if="updatedTotal === 0">Sans action de votre part, le prix conseillé sera appliqué par défaut.</p>
                    </div>
                    <div v-if="error" class="d-flex flex-column align-items-center justify-content-center">
                        <h2>Erreur</h2>
                        <p class="text-danger">Erreur lors du chargement de votre fichier. Veuillez contrôler les informations renseignées dans votre fichier.</p>
                    </div>
                    <base-button type="info" class="btn-rounded mt-5 dark-text" @click="ok()">Terminer</base-button>
                </div>   
            </b-modal>
            <p>Sans action de votre part, les prix affichés seront automatiquement les prix TTC conseillés.</p>

        </div>

    </div>

</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import loadingPanel from '../../../src/components/LoadingPanel'
export default {
    components: {
        loadingPanel
    },
    methods: {
        ...mapActions(['postPrices', 'getPrices']),
        openModalImport() {
            this.$refs['modal-import-price'].show()
        },
        sendPrices() {
            this.postPrices({ file: this.file })
                .then(({ success, error, updatedTotal }) => {
                    console.log({ success, error, updatedTotal })
                    this.updatedTotal = updatedTotal;
                    this.success = success;
                    this.error = error;
                })
        },
        downloadPrices() {
            this.getPrices();
        },
        ok() {
            this.updatedTotal = null;
            this.success = null;
            this.error = null;
            this.file = null;
            this.$refs['modal-import-price'].hide()
        }
    },
    data() {
        return {
            updatedTotal: null,
            file: null,
            error: null,
            loading: null,
            success: null,
            textModal: "",
            svgArrowRight: require('../../assets/svg/arrow-right.svg'),
            svgInfos: require('../../assets/svg/infos.svg'),
            svgDownloadDark: require('../../assets/svg/download-dark.svg'),
            svgDownload: require('../../assets/svg/download-svg.svg'),
            svgUpload: require('../../assets/svg/upload-svg.svg'),
            svgFileAdd: require('../../assets/svg/file-add-svg.svg'),
            svgFileChecked: require('../../assets/svg/file-checked-svg.svg')
        }
    },
    computed: {
        ...mapGetters(['getSelectedKvps', 'getLoading'])
    }
};
</script>
<style lang="scss">
$violet: #7A36B4;
$blueTitle : #102C5B;
$text: #000000;
$blueStep: #001E50;

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
        color: $text;
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

.toCapitalFirst {
    text-transform: capitalize;
}
</style>
  