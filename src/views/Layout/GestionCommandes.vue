<template>
    <div id="gestion_commandes">
        <b-breadcrumb class="mt-4 ml-4 custom-breadcrumb" disabled>
            <b-breadcrumb-item>Commande</b-breadcrumb-item>
            <b-breadcrumb-item to="/gestion-commandes" active>Gestion des commandes</b-breadcrumb-item>
        </b-breadcrumb>
        <h1 class="my-5 ml-5">Gestion des commandes</h1>
        <div v-if="getLoading().statsOrders" class="mt-5 pt-5 d-flex flex-row align-items-center justify-content-center">
            <p class="mr-3 font-weight-bold">Chargement des statistiques des commandes</p>
            <div class="spinner-border" role="status">
                <span class="sr-only">...</span>
            </div>
        </div>
        <div v-else-if="getStatsCommandes().new" class="stats-commandes">
            <div class="card-stats">
                <p class="card-stats-big-text ">{{ getStatsCommandes().new[0].count }}</p>

                <p>Commandes à traiter</p>
                <p class="card-stats-big-text ">{{ getStatsCommandes().new[0].total | formatEuro }}</p>
            </div>
            <div class="card-stats">
                <p class="card-stats-big-text ">{{ getStatsCommandes().confirmed[0].count }}</p>
                <p>Commandes en préparation</p>
                <p class="card-stats-big-text ">{{ getStatsCommandes().confirmed[0].total | formatEuro }}</p>
            </div>
            <div class="card-stats">
                <p class="card-stats-big-text ">{{ getStatsCommandes().fulfilled[0].count }}</p>
                <p>Commandes à retirer</p>
                <p class="card-stats-big-text ">{{ getStatsCommandes().fulfilled[0].total | formatEuro }}</p>
            </div>
            <div class="card-stats">
                <p class="card-stats-big-text ">{{ getStatsCommandes().completed[0].count }}</p>
                <p>Commandes terminées</p>
                <p class="card-stats-big-text ">{{ getStatsCommandes().completed[0].total | formatEuro }}</p>
            </div>
        </div>
        <p class="ml-5">Les données ci-dessus sont compilées sur la période du 1er janvier au 31 décembre de l'année en cours.</p>
        <div v-if="getLoading().orders" class="mt-5 pt-5 d-flex flex-row align-items-center justify-content-center">
            <p class="mr-3 font-weight-bold">Chargement des commandes</p>
            <div class="spinner-border" role="status">
                <span class="sr-only">...</span>
            </div>
        </div>
        <div v-else>
            <div class="d-flex justify-content-end mb-3 mr-5">
                <!-- <base-button @click="openDropdown()" id="dropdownState" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" outline type="primary" class="btn-status dropdown-toggle"><img class="mr-2" width="24" height="24" :src="svgStatut" />Statut : à traiter</base-button> -->
                <b-dropdown toggle-class='btn-status' variant="outline-primary" no-caret>
                    <template #button-content>
                        <img class="mr-2" width="24" height="24" :src="svgStatut" />Statut : {{ stateTraduction(filter) }}
                    </template>
                    <b-dropdown-item @click="filter = 'new'">À traiter</b-dropdown-item>
                    <b-dropdown-item @click="filter = 'confirmed'">En préparation</b-dropdown-item>
                    <b-dropdown-item @click="filter = 'fulfilled'">À retirer</b-dropdown-item>
                    <b-dropdown-item @click="filter = 'completed'">Terminée</b-dropdown-item>
                    <b-dropdown-item @click="filter = 'cancelled'">Annulée</b-dropdown-item>
                    <b-dropdown-item @click="filter = ''">Aucun filtre</b-dropdown-item>
                </b-dropdown>

            </div>
            <div class="mx-5">
                <b-table :items="formatTableCommandes" :fields="fieldsTable" :bordered="true" class="custom-table-commande" no-local-sorting no-sort-reset :sort-by.sync="sortBy" :sort-desc.sync="sortDesc">
                    <template #cell(total)="data">
                        {{ data.item.total | formatEuro }}
                    </template>
                    <template #cell(createdAt)="data">
                        {{ data.item.createdAt }}
                    </template>
                    <template #cell(state)="data">
                        {{ stateTraduction(data.item.state) }}
                    </template>
                    <template #cell(Actions)="data">
                        <img @click="openCommande(data)" class="mr-2 open-commandes" width="24" height="24" :src="svgActions" />
                    </template>
                </b-table>

                <div class="d-flex justify-content-end mb-3 mr-5">
                    <b-pagination hide-goto-end-buttons v-model="page" :total-rows="filter ? getStatsCommandes()[filter][0].count : getTotalCountOfAllFilters()" :per-page="limit" aria-controls="my-table" limit="3">
                        <template #prev-text><span class="text-danger"> <img :src="svgChevronLeftPagination" />
                            </span></template>
                        <template #next-text><span class="text-warning"> <img :src="svgChevronRightPagination" />
                            </span></template>
                    </b-pagination>
                </div>
            </div>
        </div>
        <hr class="solid">
        <div class="ml-5">
            <p class="text-under-table">Les commandes à traiter sont des commandes nécessitant une action de votre part.</p>
            <p class="text-under-table">Les commandes en préparation sont des commandes pour lesquelles vous avez déjà passé commande auprès de VGF ou disponible dans votre stock.</p>
            <p class="text-under-table">Les commandes à retirer sont des commandes prêtes à être récupérées sur place par le client.</p>
            <p class="text-under-table mb-5">Les commandes terminées sont des commandes déjà récupérées par le client.</p>
        </div>
    </div>

</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { EventBus } from '../../util/eventBus';

export default {
    name: "GestionCommande",
    mounted() {
        EventBus.$on('reload_orders', () => {
            this.orders({
                limit: this.limit,
                offset: (this.limit * (this.page - 1)),
                filter: this.filter,
                sort: this.sortBy,
                order: this.sortDesc ? 'desc' : 'asc',
            })
            this.statsOrders()
        });
        this.orders({
            limit: this.limit,
            offset: (this.limit * (this.page - 1)),
            filter: this.filter,
            sort: this.sortBy,
            order: this.sortDesc ? 'desc' : 'asc',
        })
        this.statsOrders()
        //Solution Vue 2 pour un watch multiple pour une fonction
        this.$watch(vm => [vm.page, vm.filter, vm.sortBy, vm.sortDesc], val => {
            setTimeout(() => {
                this.orders({
                    limit: this.limit,
                    offset: (this.limit * (this.page - 1)),
                    filter: this.filter,
                    sort: this.sortBy,
                    order: this.sortDesc ? 'desc' : 'asc',
                })
            }, 1);
        }, {
            immediate: false, // run immediately
            deep: false // detects changes inside objects. not needed here, but maybe in other cases
        })
    },
    data() {
        return {
            page: 1,
            limit: 10,
            filter: '',
            sortBy: 'number',
            sortDesc: false,
            svgChevronLeftPagination: require('../../assets/svg/chevron-left-pagination.svg'),
            svgChevronRightPagination: require('../../assets/svg/chevron-right-pagination.svg'),
            svgActions: require('../../assets/svg/actions.svg'),
            svgActions: require('../../assets/svg/actions.svg'),
            svgStatut: require('../../assets/svg/statut.svg'),
            fieldsTable: [
                { class: "font-weight-bold custom-column", key: 'number', sortable: true, label: "Ref Commande" },
                { class: "font-weight-bold custom-column", key: 'createdAt', sortable: true, label: "Date de création" },
                { class: "font-weight-bold custom-column", key: 'state', sortable: false, label: "Statut" },
                { class: "font-weight-bold custom-column", key: 'firstname', sortable: false, label: "Prénom" },
                { class: "font-weight-bold custom-column", key: 'lastname', sortable: false, label: "Nom" },
                { class: "font-weight-bold custom-column", key: 'total', sortable: true, label: "Total" },
                { class: "font-weight-bold custom-column", key: 'countItems', sortable: false, label: "Nombre d'articles" },
                { class: "font-weight-bold custom-column", key: 'Actions', sortable: false, label: "Actions" },
            ],
        }
    },
    methods: {
        ...mapActions(['orders', 'statsOrders']),
        /**
         * Filtre à partir des commandes par rapport à l'état
         * @param {*} state withdraw|...|...|...
         */
        filterCommandes(state) {
            return this.commandes().items.filter(item => item.state == state)
        },
        /**
         * Redirige vers la page de la commande
         * @param {*} data 
         */
        openCommande(data) {
            this.$router.push(`/commande/${data.item.id}`)
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
        getTotalCountOfAllFilters() {
            let totalCount = 0;
            const statsCommandes = this.getStatsCommandes();
            for (const key in statsCommandes) {
                if (statsCommandes.hasOwnProperty(key)) {
                    totalCount += parseInt(statsCommandes[key][0].count);
                }
            }
            return totalCount;
        },
        countItems(items) {
            return items.reduce((totalCount, item) => {
                return totalCount + item.reduce((subTotal, subItem) => subTotal + subItem.quantity, 0);
            }, 0);
        }
    },
    computed: {
        ...mapGetters(['commandes', 'getLoading', 'getStatsCommandes', 'getSelectedKvps']),

        /**
         * Formate les données pour le tableau
         */
        formatTableCommandes() {
            let array = []
            if (this.commandes().items) {
                array = this.commandes().items.map(item => {
                    let rawData = { ...item }
                    return {
                        id: item.id,
                        number: item.number,
                        createdAt: item.createdAt,
                        state: item.state,
                        firstname: item.customer.firstName || '__',
                        lastname: item.customer.lastName || '__',
                        total: item.total,
                        countItems: this.countItems(rawData.items)
                    }
                })
            }
            return array
        }
    },
};
</script>
<style lang="scss" scoped>
$blueTitle : #102C5B;
$text: #000000;
$blueStep: #001E50;

.stats-commandes {
    display: flex;
    width: 100%;
    justify-content: space-around;

    .card-stats {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    p {
        font-weight: 700;
        color: $text;
        font-size: 18px;
    }

    .card-stats-big-text {
        font-size: 56px;
        font-weight: 700;
        line-height: 68px;
    }
}

h1 {
    font-weight: 700;
    font-size: 56px;
    line-height: 72px;
}

.open-commandes:hover {
    cursor: pointer;
}

.custom-column {
    color: #000000 !important;
}

hr.solid {
    width: 100%;
    border: 0;
    border-top: 1px solid #DFE5E9;
}

.text-under-table {
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    margin: 0;
    color: #3C484D;
}

.custom-table-commande {
    tbody {
        td {
            color: #000000;
        }
    }
}
</style>
  