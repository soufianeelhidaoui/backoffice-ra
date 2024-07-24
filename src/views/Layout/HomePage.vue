<template>
    <div id="home">

        <h1 class="mt-4 mb-5 ml-5">Bienvenue sur votre back office !</h1>

        <div class="center-content">
            <div class="center-content">
                <p>En tant que Réparateur Agréé, ce back-office vous est dédié.</p>

                <h2 class="mt-5 mb-3">Gestion des commandes</h2>
                <p>Si vous avez adopté l'outil de paiement SmartPay, le menu Gestion des commandes, vous permet de gérer les commandes payées en ligne par le client directement sur le site accessoire.</p>
                <h2 class="mt-5 mb-3">Gestion des prix</h2>
                <p>Le menu Gestion des prix vous permet de renseigner les prix que vous souhaitez pratiquer sur chaque référence, indépendamment de votre souscription à l'outil de paiement SmartPay.</p>
            </div>
            <div class="mt-5 d-flex">
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
            <div class="center-content">
                <h2 class="mt-5 mb-3">Gestion des CGV</h2>
                <p>En tant que revendeur du groupe Volkswagen France, vous appliquez vos propres CGV sur l'ensemble des transactions effectuées sur les sites accessoires. Vous êtes donc invités à vous rendre dans ce menu pour charger le document de vos CGV ou compléter le modèle type proposé. Sans action de votre part, vous ne pourrez pas proposer à vos clients le paiement en ligne.</p>

                <div class="my-5 violetbox ">
                    <p>Sans action de votre part, les prix pratiqués seront ceux recommandés par Volkswagen Group France.</p>
                </div>
            </div>
        </div>

    </div>

</template>
<script>

export default {
    methods: {
    },
    data() {
        return {
            svgArrowRight: require('../../assets/svg/arrow-right.svg'),
            svgDownload: require('../../assets/svg/download-svg.svg'),
            svgUpload: require('../../assets/svg/upload-svg.svg'),
            svgFileAdd: require('../../assets/svg/file-add-svg.svg'),
            svgFileChecked: require('../../assets/svg/file-checked-svg.svg')
        }
    }
};
</script>
<style lang="scss" scoped>
$violet: #7A36B4;
$blueTitle : #102C5B;
$text: #000000;
$blueStep: #001E50;

h1 {
    font-weight: 700;
    font-size: 36px;
    line-height: 72px;
    color: #001E50;
}

.center-content {
    margin: auto;
    width: 60%;
    text-align: center;

    p {
        color: $text;
        font-weight: 400;
        line-height: 19.5px;
    }

    h2 {
        color: $blueStep;
        font-size: 16px;
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

    p {
        font-family: 'VW Head';
    }
}

.violetbox {

    border: 1px solid $violet;
    padding: 20px;

    p {
        color: $violet;
        font-weight: bold;
        margin: 0;
    }
}
</style>
  