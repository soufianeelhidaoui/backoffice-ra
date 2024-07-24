<template>
    <div id="gestion_commandes">
        <b-breadcrumb class="mt-4 ml-4 custom-breadcrumb" >
            <b-breadcrumb-item disabled>Commande</b-breadcrumb-item>
            <b-breadcrumb-item to="/gestion-commandes">Gestion des commandes</b-breadcrumb-item>
            <b-breadcrumb-item  v-if="!getLoading().orders" active><strong>Commandes N°: {{ selectedCommande.number }}</strong></b-breadcrumb-item>
        </b-breadcrumb>

        <p class="ml-4 pl-3 previous">
            &#60 <router-link to="/gestion-commandes"> Précédent</router-link>
        </p>


        <div v-if="!getLoading().orders">
            <div class="d-flex align-items-center justify-content-between">
                <h1 class="mb-5 ml-5">Commandes N°: {{ selectedCommande.number }}</h1>
                <div class="d-flex mr-5 align-items-baseline">
                    <p class="font-weight-bold">Statut de la commande :</p>
                    <b-dropdown toggle-class='btn-status ml-3' variant="primary">
                        <template #button-content>
                            Statut : {{ textModal === "" ? stateTraduction(stateModal) : "..."}}
                        </template>
                        <b-dropdown-item  @click="openModal('new')" :disabled="getStepByStateValue()>=1">À traiter</b-dropdown-item>
                        <b-dropdown-item @click="openModal('confirmed')" :disabled="getStepByStateValue()>=2">En préparation</b-dropdown-item>
                        <b-dropdown-item @click="openModal('fulfilled')" :disabled="getStepByStateValue()>=3 || getStepByStateValue()<=1">À retirer</b-dropdown-item>
                        <b-dropdown-item  @click="openModal('completed')" :disabled="getStepByStateValue()>=4 || getStepByStateValue()<=2">Terminée</b-dropdown-item>
                        <b-dropdown-item @click="openModal('cancelled')" :disabled="getStepByStateValue()>=4">Annulée</b-dropdown-item>
                    </b-dropdown>
                    <b-modal size="lg" ref="modal-alert-state" id="modal-1" :hide-footer="true" @hidden="resetModal">
                        <div class="d-flex flex-column align-items-center  justify-content-center">
                            <h2 v-if="this.stateModal === 'completed'">Vous êtes sur le point de terminer cette commande</h2>
                            <h2 v-else>Vous êtes sur le point de changer le statut de cette commande</h2>
                            <p class="text-center">{{ textModal }}</p>
                            <div class="d-flex justify-content-center">
                                <base-button @click="cancelModal()" outline type="primary" class="btn-status">Annuler</base-button>
                                <base-button @click="saveCommande()" type="info" class="btn-status ml-3 dark-text">Confirmer</base-button>
                            </div>
                        </div>
                    </b-modal>
                </div>
            </div>
            <div id="info-client" class="ml-5 p-4">
                <h2>Informations client</h2>
                <p>{{ selectedCommande.customer.firstName + " " + selectedCommande.customer.lastName }}</p>
                <p>{{ selectedCommande.customer.phoneNumber }}</p>
                <p>{{ selectedCommande.customer.email }}</p>
                <p>{{ selectedCommande.customer.street }}</p>
                <p>{{ selectedCommande.customer.postcode + ", " + selectedCommande.customer.city }}</p>
            </div>
            <div class="d-flex justify-content-end mr-5">
                <p>Date de la commande : <span class="date-commande">{{ selectedCommande.createdAt }}</span></p>
            </div>
            <div class="mx-5">
                <b-table :fields="fieldsTable" :items="formatItemsCommande" :bordered="true">
                    <template slot="thead-top" slot-scope="data">
                        <tr>
                            <th colspan="5" class="detail-panier">Détail du panier</th>
                        </tr>
                    </template>
                    <template #cell(price)="data">
                        {{ data.item.total / data.item.quantity | formatEuro }} TTC
                    </template>
                    <template #cell(total)="data">
                        {{ data.item.total  | formatEuro }} TTC
                    </template>
                    <template v-slot:custom-foot>
                        <tr>
                            <td colspan="5">
                                <div class="d-flex justify-content-end mr-5">
                                    <p class="total-table"> Total : <span>{{ selectedCommande.total | formatEuro }} TTC</span></p>
                                </div>
                            </td>
                        </tr>
                    </template>
                </b-table>
            </div>

            <div class="mx-5">
                <base-input label="Mes commentaires">
                    <textarea v-model="notes_commande" class="form-control" rows="3"></textarea>
                </base-input>
            </div>
            <div class="d-flex justify-content-end mr-5 mb-5">
                <base-button @click="saveCommande()" outline type="primary" class="btn-status">Enregistrer les modifications</base-button>
            </div>
        </div>
        <div v-else class="mt-5 pt-5 d-flex flex-row align-items-center justify-content-center">
            <p class="mr-3 font-weight-bold">Chargement de la commande</p>
            <div class="spinner-border" role="status">
                <span class="sr-only">...</span>
            </div>
        </div>
    </div>

</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    mounted() {
        if (this.$route.params.id) {
            this.getOneOrder({id: this.$route.params.id, kvps: this.getSelectedKvps().kvps})
                .then(() => {
                    if (this.getSelectedCommande().notes) {
                    this.notes_commande = this.getSelectedCommande().notes;
                    }
                    if (this.getSelectedCommande().state) {
                    this.stateModal = this.getSelectedCommande().state;
                    }
                    this.selectedCommande = this.getSelectedCommande();
                })
                .catch(error => {
                    console.error('Error fetching order:', error);
                });
        } else {
            this.$router.push('/gestion-commandes')
        }
    },
    data() {
        return {
            selectedCommande: {
                "id": "",
                "number": "",
                "serviceCenterId": "",
                "createdAt": "",
                "state": "",
                "total": "",
                "countItems": "",
                "notes": "",
                "customer": {
                    "firstName": "",
                    "lastName": "",
                    "phoneNumber": "",
                    "email": "",
                    "street": "",
                    "postcode": "",
                    "city": "",
                    "countryCode": ""
                }
            },
            notes_commande: "",
            textModal: "",
            stateModal: "",
            fieldsTable: [
                { class: "font-weight-bold custom-column", key: 'code', sortable: false, label: "Référence" },
                { class: "font-weight-bold custom-column", key: 'name', sortable: false, label: "Dénomination" },
                { class: "font-weight-bold custom-column", key: 'quantity', sortable: false, label: "Quantité" },
                { class: "font-weight-bold custom-column", key: 'price', sortable: false, label: "Prix unitaire" },
                { class: "font-weight-bold custom-column", key: 'total', sortable: false, label: "Prix" },
            ],
        }
    },
    computed: {
        ...mapGetters(['getSelectedCommande', 'getLoading', 'getSelectedKvps']),
        formatItemsCommande() {
            let array = []
            if ( this.getSelectedCommande() && this.getSelectedCommande().items) {
                array = this.getSelectedCommande().items.map(item => {
                    return {
                        code: item[0].code,
                        name: item[0].name,
                        quantity: item[0].quantity,
                        price: item[0].total / item[0].quantity,
                        total: item[0].total
                    }
                })
            }
            return array
        }
    },
    methods: {
        ...mapActions(['getOneOrder', 'updateOrder']),
        getStepByStateValue() {
            const mapStepState = {
                "new": 1,
                "confirmed": 2,
                "fulfilled": 3,
                "completed": 4,
                "cancelled": 5,
            }
            return mapStepState[this.stateModal];
        },
        resetModal(){
            this.stateModal = this.getSelectedCommande().state
            this.textModal = ""
        },
        openModal(state) {
            switch (state) {
                case "new":
                    this.textModal = 'Le passage au statut "à traiter" va générer un mail de disponibilité de la commande au client. Êtes vous sûr de vouloir continuer ?';
                    break;
                case "fulfilled":
                    this.textModal = 'Le passage au statut "à retirer" va générer un mail de disponibilité de la commande au client. Êtes vous sûr de vouloir continuer ?';
                    break;
                case "cancelled":
                    this.textModal = 'Le passage au statut "annulé" va générer un mail d\'annulation de la commande au client, Êtes vous sûr de vouloir continuer ?';
                    break;
                case "completed":
                    this.textModal = 'Êtes vous sûr de vouloir continuer ?';
                    break;
                case "confirmed":
                    this.textModal = 'Le passage au statut "en préparation" va générer un mail de confirmation de prise en charge de la commande au client. Êtes vous sûr de vouloir continuer ?';
                    break;
            }
            this.stateModal = state
            this.$refs['modal-alert-state'].show()
        },
        cancelModal() {
            this.$refs['modal-alert-state'].hide()
            this.textModal = ""
            this.stateModal = this.getSelectedCommande().state
        },
        async saveCommande() {
            try {
                let state = this.stateModal != '' ? this.stateModal : this.getSelectedCommande().state
                let datas = {
                    id: this.getSelectedCommande().id, state: state, notes: this.notes_commande, kvps: this.getSelectedKvps().kvps
                }
                await this.updateOrder(datas)
                this.stateModal = state
                this.textModal = ""
                this.$refs['modal-alert-state'].hide()
            } catch (error) {

            }
        },
        /**
         * Retourne le bon text en fonction du filtre selectionné
         */
         stateTraduction(type) {
            let text = ''
            switch (type) {
                case '':
                    text = 'Aucun filtre'
                    break;
                case 'new':
                    text = 'À traiter'
                    break;
                case 'confirmed':
                    text = 'En préparation'
                    break;
                case 'fulfilled':
                    text = 'À retirer'
                    break;
                case 'completed':
                    text = 'Terminée'
                    break;
                case 'cancelled':
                    text = 'Annulée'
                    break;
            }
            return text
        },
    }
};
</script>
<style lang="scss" scoped>
$blueTitle : #102C5B;
$text: #000000;
$blueStep: #001E50;

h1 {
    font-weight: 700;
    font-size: 56px;
    line-height: 72px;
}

#info-client {
    border: solid 1px #DFE4E8;
    width: 271px;
    color: #000000;

    h2 {
        font-size: 18px;
        font-weight: 700;
        line-height: 21px;
    }

    p {
        font-weight: 400;
    }
}

.total-table {
    width: 250px;
    margin: 0 !important;
    padding: 0 !important;

    span {
        color: #000000;
        font-weight: 700;
        font-size: 22px;
        line-height: 27px;
    }
}

.btn-status {
    border-radius: 2.25rem;
}



.detail-panier {
    font-weight: 700;
    font-size: 18px;
    color: #000000;
    line-height: 21px;
    text-transform: none;
}

.date-commande {
    font-weight: 700;
    color: #000000;
}


.previous {
    a {
        color: #001E50;
        text-decoration: underline;
    }
}
</style>
  