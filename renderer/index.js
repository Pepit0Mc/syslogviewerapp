/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Liste des serveurs
 * @type {Array}
 */
var tabserveur = [];
/**
 * Liste des masques
 * @type {Array}
 */
var masques = [];

var serveurs = [];

serveurs[0] = {};
serveurs[0]["nom"] = "serveur test";
serveurs[0]["ip"] = "localhost:8000";
serveurs[0]["monitor"] = "/data.json";

serveurs[1] = {};
serveurs[1]["nom"] = "serveur dev 48";
serveurs[1]["ip"] = "192.168.1.48:3000";
serveurs[1]["monitor"] = "/sysinfo/data.json";

serveurs[2] = {};
serveurs[2]["nom"] = "serveur dev 92";
serveurs[2]["ip"] = "192.168.1.92:3000";
serveurs[2]["monitor"] = "/sysinfo/data.json";

serveurs[3] = {};
serveurs[3]["nom"] = "serveur dev 93";
serveurs[3]["ip"] = "192.168.1.93:3000";
serveurs[3]["monitor"] = "/sysinfo/data.json";

serveurs[4] = {};
serveurs[4]["nom"] = "serveur dev 207";
serveurs[4]["ip"] = "192.168.1.207:3000";
serveurs[4]["monitor"] = "/sysinfo/data.json";


/*
serveurs[0] = {};
serveurs[0]["nom"] = "serveur AUAweb";
serveurs[0]["ip"] = "149.202.165.4";
serveurs[0]["monitor"] = "/nodesysinfo/data.json";

serveurs[1] = {};
serveurs[1]["nom"] = "serveur sauvegarde";
serveurs[1]["ip"] = "149.202.206.92";
serveurs[1]["monitor"] = "/nodesysinfo/data.json";

serveurs[2] = {};
serveurs[2]["nom"] = "serveur UGO MX";
serveurs[2]["ip"] = "46.105.75.111";
serveurs[2]["monitor"] = "/nodesysinfo/data.json";

serveurs[3] = {};
serveurs[3]["nom"] = "serveur UGO";
serveurs[3]["ip"] = "51.255.141.19";
serveurs[3]["monitor"] = "/nodesysinfo/data.json";

serveurs[4] = {};
serveurs[4]["nom"] = "serveur PGMaster";
serveurs[4]["ip"] = "149.202.186.250";
serveurs[4]["monitor"] = "/nodesysinfo/data.json";

serveurs[5] = {};
serveurs[5]["nom"] = "serveur CKan";
serveurs[5]["ip"] = "149.202.179.38";
serveurs[5]["monitor"] = "/nodesysinfo/data.json";

serveurs[6] = {};
serveurs[6]["nom"] = "serveur Lizmap";
serveurs[6]["ip"] = "149.202.179.54";
serveurs[6]["monitor"] = "/nodesysinfo/data.json";

serveurs[7] = {};
serveurs[7]["nom"] = "serveur sauvegarde2 (NAS)";
serveurs[7]["ip"] = "51.255.92.100";
serveurs[7]["monitor"] = "/nodesysinfo/data.json";
/*
/*
serveurs[5]["nom"] ="serveur PGSlave";
serveurs[5]["ip"] = "149.202.179.176";
serveurs[5]["monitor"] = "/data.json";

serveurs[6]["nom"] ="serveur GeoNode";
serveurs[6]["ip"] = "149.202.179.46";
serveurs[6]["monitor"] = "phpsysinfo/xml.php?plugin=complete&json";

serveurs[XX]["nom"] ="serveur Pentaho";
serveurs[XX]["ip"] = "149.202.184.114";
serveurs[XX]["monitor"] = "phpsysinfo/xml.php?plugin=complete&json";*/

function initApp() {

    for (var i = 0; i < serveurs.length; i++) {
        var nom = serveurs [i]["nom"];
        tabserveur[i] = new serveur(i, nom);
        tabserveur[i].loaddata();
        tabserveur[i].afficheInfosServeur();
    }
    document.getElementById("masqueMaj").style.display = "none";
}

/**
 * Affiche ou cache les informations complementaires
 * @param {serveur} obj Le serveur dont on veut recuperer les informations complementaires
 */
function afficheInfos(obj) {
    var cible = document.getElementById("infoComplement_" + obj.dataset.serveur);
    if (cible.className === "d-none") {
        cible.className = "d-block";

    } else {
        cible.className = "d-none";
    }

}

function testconfig(diag) {
    var val_retour = "../images/wifi_signal_gris.svg";
    var retour = [];
    for (var e in diag["Partitions"]) {
        if (Number(diag["Partitions"][e]["Use%"].slice(0, -1)) > 85) {
            retour.push("warning");
        } else if (Number(diag["Partitions"][e]["Use%"].slice(0, -1)) > 70) {
            retour.push("error");
        } else {
            retour.push("cool");
        }
    }
    for (e in diag["Services"]) {
        if (diag["Services"][e]["running"] === false) {
            retour.push("warning");
        } else {
            retour.push("cool");
        }
    }
    for (e in retour) {
        if (retour[e] === "warning")
            val_retour = "../images/wifi_signal_orange.svg";
    }
    for (e in retour) {
        if (retour[e] === "error")
            val_retour = "../images/wifi_signal_rouge.svg";
    }
    if (val_retour === "../images/wifi_signal_gris.svg") {
        val_retour = "../images/wifi_signal_vert.svg";
    }
    return val_retour;
}

/**
 * Formate la date pour la rendre plus lisible
 * @param {string} date
 * @returns {string}
 */
function formatTime(date) {
    date = new Date();
    var chdate = date.toTimeString();
    var date = chdate.substr(0, 8);
    return date;
}

/**
 * Classe representant un serveur
 */
class serveur {
    /**
     * Constructeur
     * @param {number} index L'index du serveur
     * @param {string} cle Le nom du serveur
     */
    constructor(index, cle) {
        this.index = index;
        this.cle = cle;
        this.val = {};
    }

    /**
     * Affiche les informations du serveur sur la page
     * @return {number}
     */
    afficheInfosServeur() {
        var contenerServer = document.createElement("div");
        contenerServer.className = "col-xs border border-dark rounded bg-secondary";
        contenerServer.id = "contenerServer_" + this.index;
        var aff = document.createElement("div");
        aff.id = "aff_" + this.index;
        aff.className = "inf_serveur";
        aff.style.fontSize = "small";

        var head = document.createElement("div");
        head.className = "row no-gutters";

        var majInfo = document.createElement("div");
        majInfo.className = "col-1";
        var btMajInfo = document.createElement("img");
        btMajInfo.src = "../images/refresh.svg";
        btMajInfo.className = "img-fluid";
        var server = this;
        btMajInfo.addEventListener("click", function () {
            tabserveur[server.index].updateinfo();
        });
        majInfo.appendChild(btMajInfo);
        head.appendChild(majInfo);

        var titre = document.createElement("div");
        titre.className = "col text-center align-self-center font-weight-bold";
        titre.innerHTML = "Infos Generales";
        head.appendChild(titre);

        var etatGen = document.createElement("div");
        etatGen.id = "etatGeneralServeur_" + this.index;
        etatGen.className = "col-2";
        var imgEtatServ = document.createElement("img");
        imgEtatServ.className = "img-fluid";
        imgEtatServ.id = "imgEtatServ_" + this.index;
        imgEtatServ.src = this.val["test"];
        etatGen.appendChild(imgEtatServ);
        var etatGenDate = document.createElement("div");
        etatGenDate.id = "date_maj_" + this.index;
        etatGenDate.innerHTML = formatTime();
        etatGen.appendChild(etatGenDate);
        head.appendChild(etatGen);

        aff.appendChild(head);

        var genInfo = document.createElement("ul");
        genInfo.className = "list-group ";

        var serv = document.createElement("li");
        serv.className = "list-group-item list-group-item-dark";
        serv.innerHTML = "Serveur : " + this.cle + " ( " + this.val["infogenerale"]["hostname"] + " )";
        genInfo.appendChild(serv);

        var ipServ = document.createElement("li");
        ipServ.className = "list-group-item list-group-item-dark";
        ipServ.innerHTML = "Adresse IP : " + this.val["infogenerale"]["IP"];
        genInfo.appendChild(ipServ);

        var osServ = document.createElement("div");
        osServ.className = "list-group-item list-group-item-dark";
        osServ.innerHTML = "Système d'exploitation : " + this.val["infogenerale"]["platform"];
        genInfo.appendChild(osServ);

        var osServDistrib = document.createElement("div");
        osServDistrib.className = "list-group-item list-group-item-dark";
        var logoDistrib = document.createElement("img");
        logoDistrib.className = "img-fluid";
        logoDistrib.src = "../images/Debian.png";
        logoDistrib.style.width = "7%";
        osServDistrib.innerHTML = "Distribution : ";
        osServDistrib.appendChild(logoDistrib);
        osServDistrib.innerHTML += this.val["infogenerale"]["distro"] + " " + this.val["infogenerale"]["release"];
        genInfo.appendChild(osServDistrib);

        aff.appendChild(genInfo);

        var cplt = document.createElement("div");
        cplt.className = "cplt";
        var info = document.createElement("a");
        info.href = "#" + aff.id;
        info.className = "text-dark";
        info.innerHTML = "Infos complémentaires";
        var attr = document.createAttribute("data-serveur");
        attr.value = this.index;
        info.setAttributeNode(attr);
        info.addEventListener("click", function () {
            afficheInfos(this);
        });
        cplt.appendChild(info);
        aff.appendChild(cplt);
        var infoCplt = document.createElement("div");
        infoCplt.id = "infoComplement_" + this.index;
        infoCplt.className = "d-none";
        var labelDisk = document.createElement("div");
        labelDisk.className = "font-weight-bold";
        labelDisk.innerHTML = " Disques :";
        infoCplt.appendChild(labelDisk);
        var listDisk = document.createElement("ul");
        listDisk.className = "list-group";
        listDisk.id = "listeDisk_" + this.index;
        for (var i in this.val["disques"]) {
            var lignDisk = document.createElement("li");
            lignDisk.className = "list-group-item list-group-item-dark";
            lignDisk.innerHTML = "Système de fichiers : " + this.val["disques"][i]["Type"];
            lignDisk.innerHTML += " - Point de montage :" + this.val["disques"][i]["Mounted"];
            var occupDiskBase = document.createElement("div");
            var occupDisk = document.createElement("div");
            occupDiskBase.className = "progress";
            occupDisk.className = "progress-bar progress-bar-striped bg-danger";
            occupDisk.role = "progressbar";
            occupDisk.style = "width: " + this.val["disques"][i]["Use%"].slice(0, -1) + "%";
            occupDisk.setAttribute("aria-valuenow", this.val["disques"][i]["Use%"].slice(0, -1).toString());
            occupDisk.setAttribute("aria-valuemin", "0");
            occupDisk.setAttribute("aria-valuemax", "100");
            occupDisk.innerHTML = this.val["disques"][i]["Use%"].slice(0, -1) + "%";
            var occupDisk2 = document.createElement("div");
            occupDisk2.className = "progress-bar progress-bar-striped bg-success";
            occupDisk2.role = "progressbar";
            occupDisk2.style = "width: " + (100 - Number(this.val["disques"][i]["Use%"].slice(0, -1))).toString() + "%";
            occupDisk2.setAttribute("aria-valuenow", (100 - Number(this.val["disques"][i]["Use%"].slice(0, -1))).toString());
            occupDisk2.setAttribute("aria-valuemin", "0");
            occupDisk2.setAttribute("aria-valuemax", "100");

            /*var diskAttr1 = document.createAttribute("style");
            diskAttr1.value = "background-color:green;width:100px;height:15px";
            occupDiskBase.setAttributeNode(diskAttr1);
            var diskAttr2 = document.createAttribute("style");
            diskAttr2.value = "background-color:red;width:"+this.val["disques"][i]["Use%"].slice(0, -1)+"px;height:15px;padding-left:5px;color:white";
            occupDisk.setAttributeNode(diskAttr2);
            occupDisk.innerHTML = this.val["disques"][i]["Use%"].slice(0, -1) +"%";*/
            occupDiskBase.appendChild(occupDisk);
            occupDiskBase.appendChild(occupDisk2);
            lignDisk.appendChild(occupDiskBase);

            listDisk.appendChild(lignDisk);
        }
        infoCplt.appendChild(listDisk);
        var labelProgram = document.createElement("div");
        labelProgram.className = "font-weight-bold";
        labelProgram.innerHTML = " Programmes :";
        infoCplt.appendChild(labelProgram);
        var listProgram = document.createElement("ul");
        listProgram.className = "list-group";
        listProgram.id = "listeProgram_" + this.index;
        for (var i in this.val["serveurs"]) {
            var lignProgram = document.createElement("li");
            lignProgram.className = "list-group-item list-group-item-dark";
            lignProgram.innerHTML = this.val["serveurs"][i]["name"] + "&nbsp;:&nbsp;";
            var srcimg = (this.val["serveurs"][i]["state"] !== "blocked") ? "../images/vert.png" : "../images/rouge.png";
            var imgProgram = document.createElement("img");
            imgProgram.src = srcimg;
            imgProgram.className = "img-fluid" ;
            imgProgram.style.width = "5%";
            lignProgram.appendChild(imgProgram);
            listProgram.appendChild(lignProgram);
        }
        infoCplt.appendChild(listProgram);
        aff.appendChild(infoCplt);
        contenerServer.appendChild(aff);
        contenerServer.appendChild(masqueMaj);


        document.getElementById("contener").appendChild(contenerServer);

        return 1;

    };

    /**
     * Va chercher les informations en utilisant l'index du serveur et met le resulat dans l'attribut val du serveur
     */
    loaddata() {
        var retour = {};
        var path = "http://" + serveurs[this.index]["ip"] + serveurs[this.index]["monitor"];
        $.ajax({
            url : path,
            method: "GET",
            async: false,
            success :function(tabdatas) {
                retour["infogenerale"] = tabdatas["General"];
                var i = 0;
                retour["disques"] = {};
                for (var e in tabdatas["Partitions"]) {
                    retour["disques"][i] = tabdatas["Partitions"][e];
                    i++;
                }
                i = 0;
                retour["serveurs"] = {};
                for (var e in tabdatas["Processes"]) {
                    retour["serveurs"][i] = tabdatas["Processes"][e];
                    i++
                }
                retour["test"] = testconfig(tabdatas);
                retour["reponse"] = true;
            },
            error:function(){
                retour["reponse"] = false;
                retour["warning"] = "Le " + serveurs[this.index]["nom"] + " ne réponds pas<br /><br />";
                retour["test"] = "../images/wifi_signal_gris.svg";
            }
        });
        this.val = retour;
      }

    /**
     * Lance une mise a jour des informations sur le serveur
     */
    updateinfo() {
        var objet = this;
        majManuelleServeur(this.index)
            .then(function (resolve) {
                setTimeout(function () {
                    objet.loaddata();
                    objet.majAfficheInfosServeur();
                }, 2000);

            })
            .catch(function (e) {
                console.log(e.message);
            });
        console.log("passsss");


    };

    /**
     * Met a jour l'affichage des informations sur le serveur sur la page
     */
    majAfficheInfosServeur() {
        var imgEtatServ = document.getElementById("imgEtatServ_" + this.index);
        imgEtatServ.src = this.val["test"];
        var datemaj = document.getElementById("date_maj_" + this.index);
        datemaj.innerHTML = formatTime();
        var infoCplt = document.getElementById("infoComplement_" + this.index);
        infoCplt.innerHTML = "";
        var labelDisk = document.createElement("div");
        labelDisk.className = "font-weight-bold";
        labelDisk.innerHTML = " Disques :";
        infoCplt.appendChild(labelDisk);

        var listDisk = document.createElement("ul");
        listDisk.className = "list-group";
        listDisk.id = "listeDisk_" + this.index;
        for (var i in this.val["disques"]) {
            var lignDisk = document.createElement("li");
            lignDisk.className = "list-group-item list-group-item-dark";
            lignDisk.innerHTML = "Système de fichiers : " + this.val["disques"][i]["Type"];
            lignDisk.innerHTML += " - Point de montage :" + this.val["disques"][i]["Mounted"];
            var occupDiskBase = document.createElement("div");
            var occupDisk = document.createElement("div");
            occupDiskBase.className = "progress";
            occupDisk.className = "progress-bar progress-bar-striped bg-danger";
            occupDisk.role = "progressbar";
            occupDisk.style = "width: " + this.val["disques"][i]["Use%"].slice(0, -1) + "%";
            occupDisk.setAttribute("aria-valuenow", this.val["disques"][i]["Use%"].slice(0, -1).toString());
            occupDisk.setAttribute("aria-valuemin", "0");
            occupDisk.setAttribute("aria-valuemax", "100");
            occupDisk.innerHTML = this.val["disques"][i]["Use%"].slice(0, -1) + "%";
            var occupDisk2 = document.createElement("div");
            occupDisk2.className = "progress-bar progress-bar-striped bg-success";
            occupDisk2.role = "progressbar";
            occupDisk2.style = "width: " + (100 - Number(this.val["disques"][i]["Use%"].slice(0, -1))).toString() + "%";
            occupDisk2.setAttribute("aria-valuenow", (100 - Number(this.val["disques"][i]["Use%"].slice(0, -1))).toString());
            occupDisk2.setAttribute("aria-valuemin", "0");
            occupDisk2.setAttribute("aria-valuemax", "100");

            /*var diskAttr1 = document.createAttribute("style");
            diskAttr1.value = "background-color:green;width:100px;height:15px";
            occupDiskBase.setAttributeNode(diskAttr1);
            var diskAttr2 = document.createAttribute("style");
            diskAttr2.value = "background-color:red;width:"+this.val["disques"][i]["Use%"].slice(0, -1)+"px;height:15px;padding-left:5px;color:white";
            occupDisk.setAttributeNode(diskAttr2);
            occupDisk.innerHTML = this.val["disques"][i]["Use%"].slice(0, -1) +"%";*/
            occupDiskBase.appendChild(occupDisk);
            occupDiskBase.appendChild(occupDisk2);
            lignDisk.appendChild(occupDiskBase);

            listDisk.appendChild(lignDisk);
        }
        infoCplt.appendChild(listDisk);

        var labelProgram = document.createElement("div");
        labelProgram.className = "font-weight-bold";
        labelProgram.innerHTML = " Programmes :";
        infoCplt.appendChild(labelProgram);
        var listProgram = document.createElement("ul");
        listProgram.className = "list-group";
        listProgram.id = "listeProgram_" + this.index;
        for (var i in this.val["serveurs"]) {
            var lignProgram = document.createElement("li");
            lignProgram.className = "list-group-item list-group-item-dark";
            lignProgram.innerHTML = this.val["serveurs"][i]["name"] + "&nbsp;:&nbsp;";
            var srcimg = (this.val["serveurs"][i]["state"] !== "blocked") ? "../images/vert.png" : "../images/rouge.png";
            var imgProgram = document.createElement("img");
            imgProgram.src = srcimg;
            imgProgram.className = "img-fluid" ;
            imgProgram.style.width = "5%";
            lignProgram.appendChild(imgProgram);
            listProgram.appendChild(lignProgram);
        }
        infoCplt.appendChild(listProgram);
        masques[this.index].deleteMasque();
    }


}

/**
 * Classe representant un masque
 */
class masque {
    /**
     * Construteur
     * @param {number} id L'id du masque
     */
    constructor(id) {
        this.index = id;
    }

    /**
     * Cree un masque sur l'affichage des informations du serveur
     */
    creerMasque() {
        var contenerMask = document.createElement("div");
        contenerMask.id = "masqueMaj_" + this.index;
        contenerMask.className = "masquemaj";
        var sousContenerMask = document.createElement("div");
        sousContenerMask.style.margin = "auto";
        var imgCtl = document.createElement("img");
        imgCtl.src = "../images/load_anim3.gif";
        imgCtl.alt = "Patientez";
        sousContenerMask.appendChild(imgCtl);
        contenerMask.appendChild(sousContenerMask);
        var idCible = "aff_" + this.index;
        var cible = document.getElementById(idCible);
        var masq = document.getElementById("masqueMaj_" + this.index);
        var rect = cible.getBoundingClientRect();
        var x = rect.left;
        var y = rect.top;
        var w = rect.right - rect.left;
        var h = rect.bottom - rect.top;
        contenerMask.style = " left: " + x + "px; top: " + y + "px; width: " + w + "px; height: " + h + "px";
        contenerMask.style.display = "flex";
        document.body.append(contenerMask);


    };

    /**
     * Supprime le masque
     */
    deleteMasque() {
        console.log("titi");
        var masq = document.getElementById("masqueMaj_" + this.index);
        masq.remove();
        delete (this);
    }

}

function lanceMajAuto(id) {
    // Creation et affichage du masque
    var masq = new masque(id);
    // on lance la mise à jour des infos
    tabserveur[id].updateinfo();
    //  on retire le masque

}

/**
 * Cree un masque sur le serveur dont on veut mettre a jour les informations
 * @param {number} index L'id du masque
 * @returns {Promise<any>}
 */
function majManuelleServeur(index) {
    return new Promise(function (resolve, reject) {
        masques[index] = new masque(index);
        masques[index].creerMasque();
        resolve(true);
    });
}
