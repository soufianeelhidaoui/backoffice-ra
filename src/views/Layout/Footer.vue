<template>
    <footer>
        <hr class="solid"/>
        <div class="footer-container">
            <ul>
                <li>
                    <a :href="getCGU_URL()" target="_blank">
                        Conditions générales d’utilisation
                    </a>
                </li>
            </ul>
        </div>
    </footer>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Footer',
    computed: {
    ...mapGetters(['getSelectedKvps']),
    },
    methods: {
        getCGU_URL() {
            return `/cgu/${latestCGUFileName}`;
        }
    }
};
</script>
<style lang="scss" scoped>
.footer-container {
    padding: 0 1rem 1rem;
    display: flex;
    justify-content: center;
    ul {
        display: flex;
        justify-content: space-between;

        li {
            margin:0 20px;
            padding: 0;
            text-indent: 0;
            list-style-type: none;

            a {
                color: #001E50;
                text-decoration: none;
            }
        }
        
    }
}


hr.solid {
    margin-top: 1rem;
    margin-bottom: 2rem;
    width: 100%;
    border: 0;
    border-top: 1px solid #DFE5E9;
}
</style>
  