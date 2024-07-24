<template>
    <b-navbar toggleable :class="classes" class="custom-menu">
        <div :class="containerClasses">
            <div class="d-flex align-items-center">
                <img width="46" height="46" :src="svgCar" />
                <span class="logo-text ml-3">Back Office RA</span>
            </div>
            <div class="d-flex align-items-center">
                <div v-if="getLoading().login" class="d-flex flex-row align-items-center justify-items-center">
                    <p class="mr-3 font-weight-bold">Chargement des KVPS</p>
                    <div class="spinner-border" role="status">
                        <span class="sr-only">...</span>
                    </div>
                </div>
                <div v-else class="d-flex align-items-center">
                    <b-dropdown variant="light" toggle-class="kvps-select" class="mr-4 lang-dropdown" no-caret>
                        <template #button-content>
                            KVPS: {{ getSelectedKvps().kvps }}
                            <img :src="svgChevron" />
                        </template>
                        <b-dropdown-item v-for="kvps in getKvps()" :key="kvps.kvps" @click="selectKVPS(kvps)">{{ kvps.kvps }}</b-dropdown-item>
                    </b-dropdown>
    
                    <b-dropdown v-if="getSelectedKvps().isSharedKvpsCupraNSeat" variant="light" toggle-class="kvps-select" class="mr-4 lang-dropdown dropdown-brand" no-caret>
                        <template #button-content>
                            Marque: {{ getSelectedKvps().brand.toUpperCase() }}
                            <img :src="svgChevron" />
                        </template>
                        <b-dropdown-item class="dropdown-brand-item" v-for="brand in ['seat', 'cupra']" :key="brand" @click="selectBrand(brand)">{{ brand.toUpperCase() }}</b-dropdown-item>
                    </b-dropdown>
    
                    <img :width="size[getSelectedKvps().brand].width" :height="size[getSelectedKvps().brand].height" :src="`/img/brand/${getSelectedKvps().brand}.svg`" />
                </div v-else>
            </div>
        </div>
        <hr class="solid">
        <b-navbar-nav>
            <b-nav-item class="vwhead" exact to="/">Accueil</b-nav-item>
            <b-nav-item class="vwhead" to="/gestion-commandes" :active="$route.path == '/gestion-commandes' || $route.name == 'Commande'">Gestion des commandes</b-nav-item>
            <b-nav-item class="vwhead" to="/gestion-prix">Gestion des prix</b-nav-item>
            <b-nav-item class="vwhead" to="/gestion-cgv">Gestion des CGV</b-nav-item>
        </b-navbar-nav>
        <!-- <div class="menu">
            
            <a href="#" class="ml-3">Accueil</a>
            <a href="#" class="ml-3">Gestion des commandes</a>
            <a href="#" class="ml-3">Gestion des prix</a>
            <a href="#" class="ml-3">Gestion des CGV</a>
        </div> -->
    </b-navbar>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import loadingPanel from '../../../src/components/LoadingPanel'
import { EventBus } from '../../util/eventBus';

export default {
    name: 'Navbar',
    components: {
        loadingPanel
    },
    data() {
        return {
            size: {
                seat: {width: "64", height: "80"}, // seat
                cupra: {width: "120", height: "80"}, // seat
                vwu: {width: "80", height: "80"}, // vu
                vw: {width: "32", height: "80"}, // vw
                skoda: {width: "74", height: "80"}, // skodaa
            },
            svgCar: require('../../assets/svg/car.svg'),
            svgChevron: require('../../assets/svg/chevron-down-nav.svg'),
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false,
            description:
                'Whether navbar menu is shown (valid for viewports < specified by `expand` prop)'
        },
        transparent: {
            type: Boolean,
            default: false,
            description: 'Whether navbar is transparent'
        },
        expand: {
            type: String,
            default: 'lg',
            description: 'Breakpoint where nav should expand'
        },
        menuClasses: {
            type: [String, Object, Array],
            default: '',
            description:
                'Navbar menu (items) classes. Can be used to align menu items to the right/left'
        },
        containerClasses: {
            type: [String, Object, Array],
            default: 'container',
            description:
                'Container classes. Can be used to control container classes (contains both navbar brand and menu items)'
        },
        type: {
            type: String,
            default: '',
            validator(value) {
                return [
                    '',
                    'dark',
                    'success',
                    'danger',
                    'warning',
                    'white',
                    'primary',
                    'light',
                    'info',
                    'vue'
                ].includes(value);
            },
            description: 'Navbar color type'
        }
    },
    model: {
        prop: 'show',
        event: 'change'
    },
    computed: {
        ...mapGetters(['getKvps', 'getSelectedKvps', 'getLoading']),
        classes() {
            let color = `bg-${this.type}`;
            let classes = [
                { 'navbar-transparent': this.transparent },
                { [`navbar-expand-${this.expand}`]: this.expand }
            ];
            if (this.position) {
                classes.push(`navbar-${this.position}`);
            }
            if (!this.transparent) {
                classes.push(color);
            }
            return classes;
        },
        hasMenu() {
            return this.$slots.default;
        },
    },
    methods: {
        ...mapActions(['setSelectedKvps']),
        selectBrand(brand){
            this.setSelectedKvps({ ...this.getSelectedKvps(), brand: brand })
            EventBus.$emit('reload_orders');
        },
        selectKVPS(kvps){
            this.setSelectedKvps(kvps)
            EventBus.$emit('reload_orders');
        },
        toggleMenu() {
            this.$emit('change', !this.show);
        },
        closeMenu() {
            this.$emit('change', false);
        }
    }
};
</script>
<style lang="scss" scoped>
.dropdown-brand {
    width: 150px;
    display: flex;
    justify-content: space-between;
    .btn {
        width: 150px;  
        font-size: 3rem;
    }
    ul {
        width: 150px;  
        li.dropdown-brand-item {
            width: 150px;
            font-size: 1.8rem;
        }
    }
}

.custom-menu {
    display: flex;
    flex-direction: column;

    a {
        color: #000000;
        font-weight: 400;
    }
}

// .active {
//     color: #000000;
//     font-weight: 700;
//     border-bottom: 2px solid #000000;
// }

hr.solid {
    margin-top: 1rem;
    margin-bottom: 2rem;
    width: 100%;
    border: 0;
    border-top: 1px solid #DFE5E9;
}

.logo-text {
    font-weight: 700;
    font-size: 24px;
    line-height: 38px;
    color: #001E50;
}

.brand-text {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: #001E50;
}
.kvps-select:hover {
    text-decoration: none;
}
</style>
  