// generating the json for RED faq
var config = require('./config');
var fs = require('fs');

var dico = {};

function node(list, key){
    dico[key] = list;
}

var links = [];

function ending_node(title, sub, link, img, payload){
    data = fs.readFileSync('./link2newlink.json');
    data = JSON.parse(data);
    // links = links.concat(link)

    payload = '1'+payload.slice(1);
    dico[payload] = {};
    dico[payload].title = title;
    dico[payload].subtitle = sub;
    dico[payload].link = [];
    for (var i in link){
        if(link[i] in data){
            dico[payload].link.push(data[link[i]]);
        }
        else{
            dico[payload].link.push(link[i]);
        }
    }
    dico[payload].img_link = [];
    for (var i in dico[payload].title){
        if (dico[payload].title[i] == "Consulter la communauté Red"){
            dico[payload].img_link[i] = '/assets/communaute.jpg';
        }
        else if (dico[payload].title[i] == "Consulter nos fiches aide & conseils"){
            dico[payload].img_link[i] =  '/assets/faq.png';
        }
        else if (dico[payload].title[i] == "Accéder à la boutique en ligne"){
            dico[payload].img_link[i] = '/assets/logo.jpg';
        }
        else if (dico[payload].title[i] == "Serveur vocal (24h/24, 7j/7)"){
            dico[payload].img_link[i] = '/assets/phone.jpg';
        }
        else if (dico[payload].title[i] == "Depuis l'Espace client"){
            dico[payload].img_link[i] = '/assets/client.png';
        }
        else{
            dico[payload].img_link[i] = '';
        }
    }
}

// first step
node(['Forfait Mobile', 'Fibre, Box', 'Pas encore Client'], '0');


// // second step
node(['Forfait et options', 'Mobile, carte SIM et réseau', 'Contrat, compte et identifants', 'Consommation et facture'], '0_0');
node(['RED + BOX', 'RED Fibre'], '0_1');
node(['Les forfaits mobile RED', "L'offre RED Fibre", 'Le réseau SFR', 'Désimlocker son mobile', "Changer d'opérateur"], '0_2');

// // third step
node(['Souscrire à un nouveau forfait RED', 'Changer de forfait', 'Résilier votre forfait', 'Ajouter, résilier une option', 'Recharger un forfait bloqué', 'Demander la protabilité de son numéro (RIO)', "Tout savoir sur l'International"], '0_0_0');
node(['Mobile', 'Carte SIM', 'Réseau'], '0_0_1');
node(['Accéder à votre espace client', 'Changer votre mot de passe', 'Récupérer votre mot de passe perdu', 'Modifier vos données personnelles et bancaires', 'Changer de numéro de téléphone', 'Céder votre forfait à un proche', "Demander ou gérer vos procurations de ligne", 'Signer, consulter votre mandat de prélèvement (SEPA)'], '0_0_2');
node(['Suivre votre consommation', 'Payer votre facture', 'Consulter votre facture', 'Comprendre votre facture'], '0_0_3');

node(['Forfait, options et services', 'Equipements Box + TV', 'Contrats, compte et identifiants', 'Consommation et facture'], '0_1_0');
node(['Forfait, options et services', 'Equipements Box + TV', 'Contrats, compte et identifiants', 'Consommation et facture'], '0_1_1');

ending_node(['Consulter nos fiches aide & conseils', 'Accéder à la boutique en ligne'],
                  ['Découvrir les forfaits mobile RED by SFR', 'Souscrire à un forfait mobile sans engagement RED by SFR'],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Qu-est-ce-que-les-offres-Mobile-RED-by-SFR/ta-p/418', "http://red-by-sfr.fr/forfaits-mobiles/"],
                  ['/assets/faq.png','/assets/faq.png'],
                  '0_2_0');
ending_node(['Consulter nos fiches aide & conseils', 'Accéder à la boutique en ligne'],
                  ["Retrouver toute l'Assistance RED", 'Souscrire à un forfait mobile sans engagement RED by SFR'],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', "http://red-by-sfr.fr/forfaits-mobiles/"],
                  ['/assets/faq.png', '/assets/faq.png'],
                  '0_2_1');
ending_node(['Accéder à la boutique en ligne', 'Accéder à la boutique en ligne', 'Accéder à la boutique en ligne'],
                  ["Le réseau internet et mobile de SFR", 'Le réseau Fibre : voir notre couverture', 'Le réseau Mobile : voir notre couverture'],
                  ['http://red-by-sfr.fr/couverture-reseau/%20%20', "http://red-by-sfr.fr/couverture-reseau/%20%20", "http://red-by-sfr.fr/couverture-reseau/%20%20"],
                  ['/assets/faq.png','/assets/faq.png','/assets/faq.png'],
                  '0_2_2');
ending_node(['Consulter nos fiches aide & conseils'],
                  ["Retrouver toute l'Assistance RED"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ'],
                  ['/assets/faq.png'],
                  '0_2_3');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils'],
                  ["Comment changer d'opérateur mobile en conservant votre numéro?", "Retrouver toute l'Assistance RED"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-changer-d-opérateur-Le-RIO-et-la-portabilité-de-votre/ta-p/424', "http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ"],
                  ['/assets/faq.png','/assets/faq.png'],
                  '0_2_4');

// fourth step
///// first part [Forfait Mobile]
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red', 'Accéder à la boutique en ligne'],
                  ["Tout savoir sur les forfaits Mobile RED by SFR", "Retrouver la Communauté dédiée RED by SFR", "Souscrire à un forfait mobile sans engagement RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Qu-est-ce-que-les-offres-Mobile-RED-by-SFR/ta-p/418', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils', 'http://red-by-sfr.fr/forfaits-mobiles/'],
                  ['', '', ''],
                  '0_0_0_0');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Faire évoluer votre offre mobile", "Comment faire évoluer votre offre mobile ?", "Comment suivre ou annuler votre modification d'offre mobile ?", 'Retrouver la Communauté dédiée RED by SFR'],
                  ['https://www.sfr.fr/routage/evoluer-mon-offre', 'http://communaute.red-by-sfr.fr/t5/FAQ/Clients-REDbySFR-comment-faire-évoluer-votre-offre/ta-p/419', 'http://communaute.red-by-sfr.fr/t5/FAQ/Clients-RED-comment-suivre-ou-annuler-vos-modifications/ta-p/420', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', ''],
                  '0_0_0_1');
node(["J'ai trouvé moins cher ailleurs", "J'ai un souci avec le réseau", "J'ai besoin d'un nouveau téléphone", "J'ai une autre raison"], '0_0_0_2');
ending_node(["Depuis l'Espace client", "Depuis l'Espace client", "Serveur vocal (24h/24, 7j/7)", 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Consulter, modifier vos options", "Consulter, souscrire un Pack séjour Europe, USA, Afrique…", "Pour gérer vos options, composez le 963 depuis votre mobile (gratuit) ou le 06 1000 1963 depuis un fixe (prix d'un appel vers un mobile).", 'Comment gérer, souscrire ou annuler vos options ?', "Comment suivre ou annuler vos modifications d'options ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/routage/choisir-options', 'https://www.sfr.fr/espace-client/offres-options-mobile/disponibles.html?selectMenu=mdf8', '', 'http://communaute.red-by-sfr.fr/t5/FAQ/Clients-RED-comment-gérer-vos-options/ta-p/130', 'http://communaute.red-by-sfr.fr/t5/FAQ/Clients-RED-comment-suivre-ou-annuler-vos-modifications/ta-p/420', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', '', '', ''],
                  '0_0_0_3');
ending_node(["Depuis l'Espace client", "Serveur vocal (24h/24, 7j/7)", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Recharger votre Forfait bloqué RED ou celui d'un proche", "Pour recharger votre crédit, composez le 950 depuis votre mobile (gratuit).", "Comment recharger votre Forfait bloqué ou celui d'un proche", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/espace-client/rechargement/saisie-ligne.html', '', 'http://communaute.red-by-sfr.fr/t5/FAQ-RED-Mobile/Clients-offre-RED-bloquée-Comment-recharger-votre-crédit/ta-p/74', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', ''],
                  '0_0_0_4');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comment changer d'opérateur mobile", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-changer-d-opérateur-Le-RIO-et-la-portabilité-de-votre/ta-p/424', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_0_5');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils'],
                  ["Consulter, souscrire un Pack séjour Europe, USA, Afrique…", "Comment communiquer depuis l'étranger avec les offres RED by SFR: appels, SMS/MMS et Internet mobile ?", "Comment communiquer vers l'étranger avec les offres RED by SFR ?", "Qu'est ce que la version Travel des forfaits RED ?", "Comment fonctionne l'option SMS illimités Europe / Dom ?"],
                  ['https://www.sfr.fr/espace-client/offres-options-mobile/disponibles.html?selectMenu=mdf8', 'http://communaute.red-by-sfr.fr/t5/FAQ-RED-Mobile/Comment-communiquer-depuis-l-étranger-avec-les-offres-RED-by-SFR/ta-p/82', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-communiquer-vers-l-étranger-avec-les-offres-RED-by-SFR/ta-p/83', 'http://communaute.red-by-sfr.fr/t5/FAQ/Qu-est-ce-que-la-Version-Travel-des-forfaits-RED/ta-p/583', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-fonctionne-l-option-SMS-illimités-Europe-Dom/ta-p/586'],
                  ['', '', '', '', ''],
                  '0_0_0_6');

node(["Suivre, annuler votre commande", "Désimlocker votre mobile", "Changer de mobile", "Recycler votre mobile", "Déclarer le vol ou la perte de votre mobile", "Paramétrer votre mobile", "Dépanner votre mobile", "Utiliser votre répondeur SFR"], '0_0_1_0');
node(["Activer votre carte SIM", "Commander un nouvelle carte SIM", "Débloquer votre carte SIM (code PUK)", "Personnaliser votre Code PIN", "Problème de réception d'appels, SMS et MMS", "Problème de connexion internet mobile"], '0_0_1_1');
node(["Installer, gérer son boitier Femto", "Vérifier la qualité du réseau mobile", "Se connecter aux Hotspots SFR WiFi"], '0_0_1_2');

ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Accéder votre Espace client et gérer votre offre mobile", "Retrouver toute l'Assistance RED", "Comment se connecter à votre Espace Client ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ["http://espace-client.sfr.fr/", "http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ", "http://communaute.red-by-sfr.fr/t5/FAQ/Comment-utiliser-votre-Espace-Client-RED-by-SFR/ta-p/170", "http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils"],
                  ['', '', '', ''],
                  '0_0_2_0');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Modifier le mot de passe de votre Espace client", "Comment changer le mot de passe de votre Espace client ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ["https://www.sfr.fr/mon-espace-client/identifiants/", "http://communaute.red-by-sfr.fr/t5/FAQ/Comment-utiliser-votre-Espace-Client-RED-by-SFR/ta-p/170", "http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils"],
                  ['', '', '', ''],
                  '0_0_2_1');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Récupérer un nouveau mot de passe pour vous connecter à votre Espace Client", "La récupération de votre mot de passe est impossible ?", "Retrouver toute l'Assistance RED", "Comment obtenir un nouveau mot de passe et le personnaliser par la suite ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ["https://www.sfr.fr/parcours-securite/password/oubliMotDePasse/identifiant.action", "http://assistance.sfr.fr/runtime/form/contact/mobile/red/unauthent/get.html", "http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ", "http://communaute.red-by-sfr.fr/t5/FAQ/Comment-utiliser-votre-Espace-Client-RED-by-SFR/ta-p/170", "http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils"],
                  ['', '', '', '', ''],
                  '0_0_2_2');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Modifier vos données personnelles et bancaires", "Comment modifier vos coordonnées en ligne ?", "Comment mettre à jour vos coordonnées bancaires ?", "Comment modifier votre adresse email de contact ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ["https://www.sfr.fr/routage/votre-contrat", "http://communaute.red-by-sfr.fr/t5/FAQ/Comment-modifier-vos-coordonnées-en-ligne/ta-p/239", "http://communaute.red-by-sfr.fr/t5/FAQ-RED-Mobile/Clients-RED-comment-mettre-à-jour-vos-coordonnées-bancaires/ta-p/98", "http://communaute.red-by-sfr.fr/t5/FAQ/Comment-modifier-votre-adresse-email-de-contact/ta-p/400", "http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils"],
                  ['', '', '', '', ''],
                  '0_0_2_3');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comment modifier ou conserver votre numéro de téléphone ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ["http://communaute.red-by-sfr.fr/t5/FAQ/Clients-RED-comment-modifier-ou-conserver-votre-numéro-de/ta-p/422", "http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils"],
                  ['', ''],
                  '0_0_2_4');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Céder votre forfait mobile à un proche", "Tout ce qu'il faut savoir avant de céder son forfait", "Retrouver la Communauté dédiée RED by SFR"],
                  ["https://www.sfr.fr/routage/changer-titulaire", "http://communaute.red-by-sfr.fr/t5/FAQ/Comment-modifier-vos-coordonnées-en-ligne/ta-p/239", "http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils"],
                  ['', '', ''],
                  '0_0_2_5');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Accéder à votre espace de procuration", "La procuration d'une ligne mobile : comment ça marche ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ["https://www.sfr.fr/mon-espace-client/procurations/", "http://communaute.red-by-sfr.fr/t5/FAQ/Comment-gérer-les-procurations/ta-p/382", "http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils"],
                  ['', '', ''],
                  '0_0_2_6');
ending_node(["Depuis l'Espace client", "Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Consulter votre mandat SEPA", "Signer votre mandat SEPA", "Comprendre le virement et le prélèvement SEPA", "Retrouver la Communauté dédiée RED by SFR"],
                  ["https://www.sfr.fr/routage/modifier-coordonnes-bancaires", "http://espace-client.sfr.fr/infopersonnelles/mandat/previsualisation", "http://communaute.red-by-sfr.fr/t5/FAQ/Qu-est-ce-que-le-mandat-de-prélèvement-et-le-TIP-SEPA/ta-p/135", "http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils"],
                  ['', '', '', ''],
                  '0_0_2_7');

node(["Consulter votre encours de consommation", "Analyser votre consommation sur les 3 derniers mois"], '0_0_3_0');
ending_node(["Depuis l'Espace client", "Serveur vocal (24h/24, 7j/7)", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Accéder au paiement en ligne de votre facture", "Pour régler vos factures, composez le 963 depuis votre mobile (gratuit) ou le 06 1000 1963 depuis un fixe (prix d'un appel vers un mobile).", "Comment payer votre facture mobile RED ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ["https://www.sfr.fr/routage/payer-facture", "", "http://communaute.red-by-sfr.fr/t5/FAQ/Quels-sont-les-différents-modes-de-règlement-d-une-facture-RED/ta-p/142", "http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils"],
                  ['', '', '', ''],
                  '0_0_3_1');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Accéder à vos factures", "Comment consulter votre facture ?", "Comment payer votre facture mobile RED ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ["https://www.sfr.fr/routage/conso-et-facture", "http://communaute.red-by-sfr.fr/t5/FAQ/Comment-consulter-votre-facture-mobile-RED-by-SFR/ta-p/119", "http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils"],
                  ['', '', '', ''],
                  '0_0_3_2');
node(["Comprendre votre première facture", "Comprendre votre facture mensuelle", "Comprendre votre facture groupée", "comprendre votre hors forfait", "Comprendre votre facture de résiliation"], '0_0_3_3');

////// second part [fibre box]
node(["Suivre/annuler votre commande", "Résilier votre offre internet", "Bénéficier de la remise RED Internet + Mobile"], '0_1_0_0');
node(["Renvoyer vos équipements", "Modem", "Décodeur TV", "Téléphone"], '0_1_0_1');
node(["Accéder à votre espace client", "Changer votre mot de passe", "Récupérer votre mot de passe perdu", "Modifier vos données personnelles et bancaires", "Demander/gérer vos procurations de ligne"], '0_1_0_2');
node(["Suivre votre consommation", "Gérer votre facture"], '0_1_0_3');

node(["Suivre/annuler votre commande", "Connaitre les offres RED Fibre", "Bénéficier de la remise RED Internet + Mobile", "Résilier votre offre internet", "Déménagement"], '0_1_1_0');
node(["Modem", "Mini Décodeur TV", "Service TV", "Téléphone", "Renvoyer vos équipements"], '0_1_1_1');
node(["Accéder à votre espace client", "Changer votre mot de passe", "Récupérer votre mot de passe perdu", "Modifier vos données personnelles et bancaires", "Demander/gérer vos procurations de ligne"], '0_1_1_2');
node(["Suivre votre consommation", "Gérer votre facture"], '0_1_1_3');

// Fiveth step
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Faire évoluer votre offre mobile", "Consulter les démarches utiles pour résilier votre forfait", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/routage/evoluer-mon-offre', 'http://communaute.red-by-sfr.fr/t5/FAQ/Résiliation-d-une-offre-RED/ta-p/2529', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', ''],
                  '0_0_0_2_0');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Faire évoluer votre offre mobile", "Consulter les démarches utiles pour résilier votre forfait", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/routage/evoluer-mon-offre', 'http://communaute.red-by-sfr.fr/t5/FAQ/Résiliation-d-une-offre-RED/ta-p/2529', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', ''],
                  '0_0_0_2_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comment changer de mobile ?", "Consulter les démarches utiles pour résilier votre forfait", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ-RED-Mobile/Clients-RED-comment-changer-de-mobile/ta-p/64', 'http://communaute.red-by-sfr.fr/t5/FAQ/Résiliation-d-une-offre-RED/ta-p/2529', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', ''],
                  '0_0_0_2_2');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Consulter les démarches utiles pour résilier votre forfait", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Résiliation-d-une-offre-RED/ta-p/2529', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_0_0_2_3');

ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red', 'Accéder à la boutique en ligne'],
                  ["Comment suivre ou annuler votre commande ?", "Retrouver la Communauté dédiée RED by SFR", "Votre suivi de commande RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ-RED-Mobile/Suivre-ma-commande-mobile-et-SIM/ta-p/59', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils', 'http://red-by-sfr.fr/suivi-de-commande.html'],
                  ['', '', ''],
                  '0_0_1_0_0');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Désimlocker votre mobile depuis votre Espace client", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/routage/desimlocker', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_0_1_0_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comment changer de mobile ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ-RED-Mobile/Clients-RED-comment-changer-de-mobile/ta-p/64', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_0_2');
ending_node(["Depuis l'Espace client", 'Consulter la communauté Red'],
                  ["Donner une deuxième vie à vos appareils et faites des économies", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://recyclage-mobile.sfr.fr/', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_0_3');
ending_node(["Depuis l'Espace client", 'Serveur vocal (24h/24, 7j/7)', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Les premiers réflexes à avoir : Suspendre votre ligne, localiser votre mobile…", "Pour suspendre votre ligne, composez le 06 1000 1963 depuis un poste fixe (prix vers un mobile)", "Les bons reflexes en cas de perte ou de vol de mobile", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/mon-espace-client/hub-mobile/mobileperdu-vole.html', "", "http://communaute.red-by-sfr.fr/t5/FAQ/Comment-faire-en-cas-de-perte-ou-de-vol-de-votre-mobile/ta-p/403", 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', ''],
                  '0_0_1_0_4');
node(["Consulter le mode d'emploi de votre mobile", "Synchroniser votre répertoire mobile", "Configurer internet sur votre mobile", "Paramétrer et mettre à jour votre mobile"], '0_0_1_0_5');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Que faire en cas de panne de votre mobile ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-faire-en-cas-de-perte-ou-de-vol-de-votre-mobile/ta-p/403', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_0_6');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_0_7');

ending_node(["Depuis l'Espace client", 'Serveur vocal (24h/24, 7j/7)', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Activer votre carte SIM", "Pour commander, activer une carte SIM, composez le 963 depuis votre mobile (gratuit) ou le 06 1000 1963 depuis un fixe (prix d'un appel vers un mobile).", "Comment activer votre nouvelle carte SIM RED ?", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/mon-espace-client/hub-mobile/gerersim.html', '', 'http://communaute.red-by-sfr.fr/t5/FAQ-RED-Mobile/Comment-activer-votre-nouvelle-carte-SIM-RED/ta-p/60', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', '', ''],
                  '0_0_1_1_0');
ending_node(["Depuis l'Espace client", 'Serveur vocal (24h/24, 7j/7)', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Commander une nouvelle carte SIM", "Pour commander, activer une carte SIM, composez le 963 depuis votre mobile (gratuit) ou le 06 1000 1963 depuis un fixe (prix d'un appel vers un mobile).", "Apprenez tout sur le changement ou la commande d'une nouvelle carte SIM !", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/mon-espace-client/hub-mobile/gerersim.html', '', 'http://communaute.red-by-sfr.fr/t5/FAQ-RED-Mobile/Clients-RED-comment-changer-ou-commander-une-carte-SIM/ta-p/61', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', '', ''],
                  '0_0_1_1_1');
ending_node(["Depuis l'Espace client", 'Serveur vocal (24h/24, 7j/7)', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Rétrouver votre code PUK afin de débloquer votre carte SIM", "Pour commander, activer une carte SIM, composez le 963 depuis votre mobile (gratuit) ou le 06 1000 1963 depuis un fixe (prix d'un appel vers un mobile).", "Comment débloquer votre carte SIM SFR à l'aide du code PUK ?", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/mon-espace-client/hub-mobile/gerersim.html', '', 'http://communaute.red-by-sfr.fr/t5/FAQ-RED-Mobile/Comment-débloquer-votre-carte-SIM-SFR-à-l-aide-du-code-PUK/ta-p/62', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', '', ''],
                  '0_0_1_1_2');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_1_3');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Vous avez des problèmes d'envoi et/ou de réception de SMS/MMS ?", "Vous avez des problèmes de réception ou d'émission d'appel?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Que-faire-si-vous-avez-des-problèmes-d-envoi-et-ou-de-réception/ta-p/128', "http://communaute.red-by-sfr.fr/t5/FAQ/Que-faire-en-cas-de-problèmes-de-réception-ou-d-émission-d/ta-p/127", 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_0_1_1_4');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comment régler votre problème d'accès à l'Internet mobile ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Clients-RED-comment-régler-votre-problème-d-accès-à-l-Internet/ta-p/129', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_1_5');

ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_2_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_2_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_2_2');

ending_node(["Depuis l'Espace client", "Depuis l'Espace client", 'Serveur vocal (24h/24, 7j/7)', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Suivre votre encours de consommation", "Détail de votre encours de consommation hors et au-delà de votre forfait", "Pour commander, activer une carte SIM, composez le 963 depuis votre mobile (gratuit) ou le 06 1000 1963 depuis un fixe (prix d'un appel vers un mobile).", "Comment suivre votre consommation", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/routage/info-conso', 'https://www.sfr.fr/routage/conso-detaillee', '', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-suivre-votre-consommation/ta-p/99', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', '', '', ''],
                  '0_0_3_0_0');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Consulter le bilan conso de vos 3 dernières factures", "Comprendre son bilan conso", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://espace-client.sfr.fr/facture-mobile/bilan-conso', 'http://communaute.red-by-sfr.fr/t5/FAQ-RED-Mobile/Clients-RED-comment-suivre-votre-consommation/ta-p/99', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_0_3_0_1');

ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comprendre votre première facture", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-comprendre-votre-première-facture-Mobile-RED-by-SFR/ta-p/20857', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_0_3_3_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comprendre votre facture mensuelle", "Comprendre votre facture mensuelle détaillée", "Savoir ce qui est inclus dans votre forfait", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-comprendre-votre-facture-mensuelle-Mobile-RED-by-SFR/ta-p/20866', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-comprendre-votre-facture-mensuelle-détaillée-Mobile-RED/ta-p/20867', 'http://communaute.red-by-sfr.fr/t5/FAQ/Quelles-sont-les-différentes-communications-présentes-sur-votre/ta-p/132', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', '', ''],
                  '0_0_3_3_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comprendre votre facture groupée", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-comprendre-votre-facture-groupée-Mobile-RED-by-SFR/ta-p/20868', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_0_3_3_2');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comprendre votre hors-forfait", "Tout savoir sur les achats multimédias", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-comprendre-votre-hors-forfait/ta-p/21315', 'http://communaute.red-by-sfr.fr/t5/FAQ/Internet-vos-achats-et-abonnements-de-services-multimédia-avec/ta-p/81', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', ''],
                  '0_0_3_3_3');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comprendre votre facture de résiliation", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-comprendre-votre-facture-de-résiliation-Mobile-RED-by/ta-p/20871', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_0_3_3_4');


// part RED + BOX
ending_node(["Depuis l'Espace client", 'Consulter la communauté Red', 'Accéder à la boutique en ligne'],
                  ["Suivre ou annuler votre commande RED + BOX", "Retrouver la Communauté dédiée RED by SFR", "Comprendre votre facture mensuelle"],
                  ['https://espace-client.sfr.fr/suivi-commande/rechercheCommandeADSL', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils', 'http://red-by-sfr.fr/suivi-de-commande.html'],
                  ['', '', ''],
                  '0_1_0_0_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comprendre votre facture groupée", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_0_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comprendre votre facture de résiliation", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-bénéficier-de-la-remise-RED-Mobile-Internet/ta-p/421', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_0_2');

ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Demander une étiquette de retour d’équipement", "Renvoyer vos équipements", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/routage/etiquette-retour', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-renvoyer-votre-équipement-ADSL-Fibre/ta-p/568', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_1_0_1_0');
node(["Installer votre modem", "Acceder à l'interface de gestion du modem", "Se connecter en Ethernet", "Se connecter en Wifi"], '0_1_0_1_1');
node(["Installer votre décodeur TV", "Brancher un disque dur externe"], '0_1_0_1_2');
node(["Gérer vos options d'appel", "Utiliser un répondeur fixe", "Problème de reception/emission d'appels"], '0_1_0_1_3');

ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Accéder à votre espace client : première connexion", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-se-connecter-pour-la-première-fois-à-votre-Espace-Client/ta-p/413', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_1_0_2_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Modifier le mot de passe de votre Espace client", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-changer-le-mot-de-passe-de-votre-Espace-Client-RED-by/ta-p/415', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_2_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Récupérer un nouveau mot de passe pour vous connecter à votre Espace Client", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Que-faire-en-cas-de-mot-de-passe-perdu/ta-p/416', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_2_2');
ending_node(["Depuis l'Espace client", "Depuis l'Espace client", "Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils'],
                  ["Modifier en toute autonomie vos coordonnées bancaires", "Modifier en toute autonomie votre adresse postale", "Mettre à jour votre e-mail de contact", "Modifier vos données personnelles et bancaires", "Retrouver toute l'Assistance RED"],
                  ['https://www.sfr.fr/routage/modifier-coordonnes-bancaires', 'https://www.sfr.fr/routage/mettre-a-jour-mes-adresses-de-contact', 'https://www.sfr.fr/routage/e-mail-contact', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-modifier-vos-coordonnées-en-ligne/ta-p/239', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ'],
                  ['', '', '', '', ''],
                  '0_1_0_2_3');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Accéder à votre espace de procuration", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-gérer-les-procurations/ta-p/382', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_2_4');

ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_3_0');
 node(["Consulter votre facture", "Signer votre mandat de prélèvement (SEPA)", "Payer votre facture"], '0_1_0_3_1');

/// part RED Fibre
 ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red', 'Accéder à la boutique en ligne'],
                   ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR", "Votre suivi de commande RED by SFR"],
                   ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils', 'http://red-by-sfr.fr/suivi-de-commande.html'],
                   ['', '', ''],
                   '0_1_1_0_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_0_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Bénéficier de la remise RED Internet + Mobile", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-bénéficier-de-la-remise-RED-Mobile-Internet/ta-p/421', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_0_2');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_0_3');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_0_4');

node(["Installer votre modem", "Acceder à l'interface de gestion du modem", "Se connecter en Ethernet", "Se connecter en Wifi", "Mettre en place le contrôle parental"], '0_1_1_1_0');
node(["Installer votre décodeur TV", "Se connecter en Ethernet", "Utiliser les services TV"], '0_1_1_1_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_1_2');
node(["Gérer vos options d'appel", "Utiliser un répondeur fixe", "Problème de reception/emission d'appels"], '0_1_1_1_3');
ending_node(["Depuis l'Espace Client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Demander une étiquette de retour d’équipement", "Panne, changement de matériel ou résiliation de ligne… Comment renvoyer votre équipement ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/routage/etiquette-retour', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-renvoyer-votre-équipement-ADSL-Fibre/ta-p/568', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_1_1_1_4');

ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Accéder à votre Espace client et gérer votre offre en ligne", "Comment se connecter à votre Espace Client ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://espace-client.sfr.fr/', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-utiliser-votre-Espace-Client-RED-by-SFR/ta-p/170', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_1_1_2_0');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Modifier le mot de passe de votre Espace client", "Comment changer le mot de passe de votre Espace client SFR ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/mon-espace-client/identifiants/', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-utiliser-votre-Espace-Client-RED-by-SFR/ta-p/170', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_1_1_2_1');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Récupérer un nouveau mot de passe pour vous connecter à votre Espace Client", 'Comment obtenir un nouveau mot de passe et le personnaliser par la suite ?', "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/parcours-securite/password/oubliMotDePasse/identifiant.action', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-utiliser-votre-Espace-Client-RED-by-SFR/ta-p/170', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_1_1_2_2');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Modifier vos données personnelles et bancaires", "Comment modifier vos coordonnées en ligne ?", "Comment mettre à jour vos coordonnées bancaires ?", "Comment modifier votre adresse email de contact ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/routage/votre-contrat', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-modifier-vos-coordonnées-en-ligne/ta-p/239', 'http://communaute.red-by-sfr.fr/t5/FAQ-RED-Mobile/Clients-RED-comment-mettre-à-jour-vos-coordonnées-bancaires/ta-p/98', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-modifier-votre-adresse-email-de-contact/ta-p/400', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', '', ''],
                  '0_1_1_2_3');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Accéder à votre espace de procuration", "La procuration d'une ligne fixe : comment ça marche ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/mon-espace-client/procurations/', "http://communaute.red-by-sfr.fr/t5/FAQ/Comment-gérer-les-procurations/ta-p/382", "http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils"],
                  ['', '', ''],
                  '0_1_1_2_4');

ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Suivre votre consommation", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://espace-client.sfr.fr/facture-fixe/consultation', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_1_1_3_0');
node(["Consulter votre facture", "Signer votre mandat de prélèvement (SEPA)", "Payer votre facture"], '0_1_1_3_1');


// sixth step (last one)

ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_0_5_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_0_5_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_0_1_0_5_2');
ending_node(["Depuis l'Espace client", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ['Paramétrer et mettre à jour automatiquement votre mobile', "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/mon-espace-client/hub-mobile/parametrermobile.html', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_0_1_0_5_3');

ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_1_1_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],

                  '0_1_0_1_1_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_1_1_2');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_1_1_3');

ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_1_2_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_1_2_1');

ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_1_3_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],

                  '0_1_0_1_3_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_1_3_2');

ending_node(["Depuis l'Espace client", 'Consulter la communauté Red'],
                  ["Consulter votre facture", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/routage/consulter-facture', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_3_1_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Signer votre mandat de prélèvement (SEPA)", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Qu-est-ce-que-le-mandat-de-prélèvement-et-le-TIP-SEPA/ta-p/135', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_0_3_1_1');
ending_node(["Depuis l'Espace client", "Serveur vocal (24h/24, 7j/7)", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Payer en ligne votre facture", "Payer votre facture par carte bancaire en appelant le serveur vocal", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ["https://www.sfr.fr/routage/payer-facture", "", 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', ''],
                  '0_1_0_3_1_2');

ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Installer votre modem RED Fibre", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Installation-de-votre-modem-RED-fibre-By-SFR/ta-p/110', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_1_1_1_0_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Accéder à l'interface de gestion du modem", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-utiliser-son-modem-RED-Fibre-By-SFR/ta-p/118', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_1_1_1_0_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Se connecter en Ethernet", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-utiliser-son-modem-RED-Fibre-By-SFR/ta-p/118', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_1_1_1_0_2');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ['Se connecter en Wifi', "Comment modifier le nom du réseau wifi (SSID) de votre modem ?", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-se-connecter-en-wi-fi-avec-le-modem-RED-Fibre-By-SFR/ta-p/288', 'http://communaute.red-by-sfr.fr/t5/FAQ/Comment-se-connecter-en-wi-fi-avec-le-modem-RED-Fibre-By-SFR/ta-p/288', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', ''],
                  '0_1_1_1_0_3');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_1_0_4');

ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_1_1_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Se connecter en Ethernet", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-utiliser-votre-Mini-décodeur-TV/ta-p/301', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_1_1_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils','Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comment utiliser le contrôle du direct ?", "Comment enregistrer un programme TV?", "Comment utiliser la TV à la demande (Replay) ?", "Comment louer un programme avec le Vidéo Club à Domicile (VOD) ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Quelles-sont-les-fonctionnalités-proposées-par-votre-Mini/ta-p/356', 'http://communaute.red-by-sfr.fr/t5/FAQ/Quelles-sont-les-fonctionnalités-proposées-par-votre-Mini/ta-p/356', 'http://communaute.red-by-sfr.fr/t5/FAQ/Quelles-sont-les-fonctionnalités-proposées-par-votre-Mini/ta-p/356', 'http://communaute.red-by-sfr.fr/t5/FAQ/Quelles-sont-les-fonctionnalités-proposées-par-votre-Mini/ta-p/356', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', '', ''],
                  '0_1_1_1_1_2');

ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Gérer vos options d'appels", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-gérer-vos-options-d-appels-téléphoniques-avec-le-modem/ta-p/573', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_1_3_0');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Comment utiliser votre répondeur fixe ?", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Comment-utiliser-votre-répondeur-fixe-avec-le-modem-RED-Fibre/ta-p/572', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_1_3_1');
ending_node(['Consulter nos fiches aide & conseils', 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Problème de reception, d'émission d'appels", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Dépanner-votre-téléphonie-RED-Fibre-les-premier-gestes/ta-p/328', 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', ''],
                  '0_1_1_1_3_2');

ending_node(["Depuis l'Espace client", 'Consulter la communauté Red'],
                  ["Accéder à vos dernières factures", "Retrouver la Communauté dédiée RED by SFR"],
                  ['https://www.sfr.fr/routage/consulter-facture', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_3_1_0');
ending_node(["Consulter nos fiches aide & conseils", 'Consulter la communauté Red'],
                  ["Signer votre mandat de prélèvement (SEPA)", "Retrouver la Communauté dédiée RED by SFR"],
                  ['http://communaute.red-by-sfr.fr/t5/FAQ/Qu-est-ce-que-le-mandat-de-prélèvement-et-le-TIP-SEPA/ta-p/135', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', ''],
                  '0_1_1_3_1_1');
ending_node(["Depuis l'Espace client", "Serveur vocal (24h/24, 7j/7)", 'Consulter nos fiches aide & conseils', 'Consulter la communauté Red'],
                  ["Payer en ligne votre facture", "Payer votre facture par carte bancaire en appelant le serveur vocal", "Retrouver toute l'Assistance RED", "Retrouver la Communauté dédiée RED by SFR"],
                  ["https://www.sfr.fr/routage/payer-facture", "", 'http://communaute.red-by-sfr.fr/t5/FAQ/tkb-p/FAQ', 'http://communaute.red-by-sfr.fr/t5/Aide-et-Conseils/ct-p/aide-et-conseils'],
                  ['', '', '', ''],
                  '0_1_1_3_1_2');


// console.log(dico);
fs.exists('./faq_steps.json', function(exists){
    if(exists){
        fs.unlink('./faq_steps.json', function(){
            fs.writeFile('./faq_steps.json', JSON.stringify(dico, null, 4));
            callback();
        });
    }
    else{
        fs.writeFile('./faq_steps.json', JSON.stringify(dico, null, 4));
        callback();
    }
});

function callback(){
    fs.readFile('./faq_steps.json', (err, data) => {
        var output = {};
        if (err) throw err;
        json = JSON.parse(data);
        var i = 0, j = 0, k = 0, l = 0, m = 0;
        json['0'].forEach(function(phase1){
            output[phase1] = {};
            j = 0;
            json['0_' + i].forEach(function(phase2){
                output[phase1][phase2] = {};
                k = 0;
                if(json['0_' + i + '_' + j]){
                    json['0_' + i + '_' + j].forEach(function(phase3){
                        output[phase1][phase2][phase3] = {};
                        l = 0;
                        if(json['0_' + i + '_' + j + '_' + k]){
                            json['0_' + i + '_' + j + '_' + k].forEach(function(phase4){
                                output[phase1][phase2][phase3][phase4] = {};
                                m = 0;
                                if(json['0_' + i + '_' + j + '_' + k + '_' + l]){
                                    json['0_' + i + '_' + j + '_' + k + '_' + l].forEach(function(phase5){
                                        output[phase1][phase2][phase3][phase4][phase5] = {};
                                        if(json['1_' + i + '_' + j + '_' + k + '_' + l + '_' + m]){
                                            output[phase1][phase2][phase3][phase4][phase5] = json['1_' + i + '_' + j + '_' + k + '_' + l + '_' + m];
                                        }
                                        m += 1;
                                    });
                                }
                                else if(json['1_' + i + '_' + j + '_' + k + '_' + l]){
                                    output[phase1][phase2][phase3][phase4] = json['1_' + i + '_' + j + '_' + k + '_' + l];
                                }
                                l += 1;
                            });
                        }
                        else if(json['1_' + i + '_' + j + '_' + k]){
                            output[phase1][phase2][phase3] = json['1_' + i + '_' + j + '_' + k];
                        }
                        k += 1;
                    });
                }
                else if(json['1_' + i + '_' + j]){
                    output[phase1][phase2] = json['1_' + i + '_' + j];
                }
                j += 1;
            });
            i += 1;
        });
        // console.log(output);
        fs.exists('./faq.json', function(exists){
            if(exists){
                fs.unlink('./faq.json', function(){
                    fs.writeFile('./faq.json', JSON.stringify(output, null, 4));
                });
            }
            else{
                fs.writeFile('./faq.json', JSON.stringify(output, null, 4));
            }
        });
    });
}




// to find link that are not updated

// function get_faq_link(callback){
//     // on cherche les liens pour lequel il faut faire un payload
//     fs.readFile('./link2answer.json', function(err, data){
//         var links = [];
//         if(err) throw err;
//         json = JSON.parse(data);
//         Object.keys(json).forEach(function(key){
//             var link = key;
//             if (!links.includes(link) && link !== ''){
//                 links.push(link);
//             }
//         });
//         callback(links);
//     });
// }
//
// get_faq_link(function(link_updated){
//     var unique_links = links.filter(function(elem, index, self) {
//         return index == self.indexOf(elem);
//     })
//     var hello = {}
//     unique_links.forEach(function(elem){
//         if (link_updated.indexOf(elem) == -1 && elem.slice(0,38) == "http://communaute.red-by-sfr.fr/t5/FAQ"){
//             hello[elem] = '';
//         }
//     })
//
//
//     fs.writeFile('./link.json',  JSON.stringify(hello, null, 4), function (err){
//         if (err) throw err
//     });
// });
