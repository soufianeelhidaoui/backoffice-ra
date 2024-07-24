<template>
    <div class="center-content pb-3">
        <div v-if="getLoading().post_cgv" class="d-flex flex-column align-items-center justify-content-center">
                <div v-if="getLoading().post_cgv" class="d-flex flex-column align-items-center justify-content-center">
                    <h2>Les CGV sont en cours d'envoi !</h2>
                    <loadingPanel />
                </div>
        </div>
        <div v-if="!getLoading().post_cgv" class="d-flex flex-column align-items-center justify-content-center">
            <div v-if="!getCgvFormData().error">
                <b-alert show class="mb-5 info">
                    <img class="mr-2" :src="svgRight" /> Parfait. Vous avez validé vos CGV (pour ce KVPS uniquement)
                </b-alert>
                <p class="mt-2">Vos conditions générales de vente sont validées mais si vous le souhaitez, vous pouvez
                    les modifier.
                </p>
            </div>
            <div v-if="getCgvFormData().error">
                <b-alert show class="mb-5" variant="danger">
                    <img class="mr-2" :src="svgWarning" /> Erreur de Chargement des CGV
                </b-alert>
                <p class="mt-2">Nous sommes désolés, mais il semble qu'il y ait eu un problème lors du chargement de vos Conditions Générales de Vente. Veuillez vérifier votre connexion Internet et essayer de nouveau. Si le problème persiste, contactez notre support technique pour assistance.
                </p>
            </div>
 
            <base-button @click="modifyCGV" outline class=" btn-rounded mt-2 mb-5 dark-text">Retour à la gestion des CGV</base-button>
        </div>
    </div>
</template>
<script>
 
import { mapGetters } from 'vuex';
import loadingPanel from '../components/LoadingPanel'
export default {
    components: {
        loadingPanel
    },
    methods: {
        modifyCGV() {
            this.$emit('modify-cgv-clicked');
        }
    },
    data() {
        return {
            svgWarning: require('assets/svg/warning.svg'),
            svgRight: require("assets/svg/right.svg"),
        }
    },
    computed: {
        ...mapGetters(['getLoading','getCgvFormData']),
    },
}
</script>
<style lang="scss" scoped>
.alert-info {
    color: white !important;
    background-color: #029640 !important;
    border-color: #029640 !important;
    font-weight: 500;
    font-size: medium;
    width: fit-content;
    margin: auto;
}
.alert-danger {
    color: white !important;
    background-color: #b83131 !important;
    border-color: #b83131 !important;
    font-weight: 500;
    font-size: medium;
    width: fit-content;
    margin: auto;
}
</style>