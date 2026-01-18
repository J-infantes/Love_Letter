// affichage.js : On retrouve ici toutes les fonctions d'affichage du jeu qui ne concernent pas directement les IA
export function renderPlayerHand(hand, onCardClick) {
    const container = document.getElementById("player-hand");
    container.innerHTML = '';

    hand.forEach(card => {
        if (!card) return; // ignore undefined sinon quelques bug bloquent le jeu
        const img = document.createElement("img");
        img.src = `attached_assets/cartes/${card.type}.jpg`;
        img.alt = `Carte ${card.type}`;
        img.className = "w-24 h-36 rounded-lg border-2 border-white-400 shadow-md cursor-pointer transform transition hover:scale-105";

        img.addEventListener("click", () => onCardClick(card));

        container.appendChild(img);
    });
}


export function updateDeckCount(count) {
    document.getElementById("deck-count").innerText = `${count} cartes restantes`;
}

export function updateCard(cards) {
    console.log("Mise à jour main du joueur:", cards);
}

export function playCard(lastCard) {

    let parentElement = document.getElementById("discard-pile");


    parentElement.innerHTML = "";    //On Supprime l'ancienne image (pour n'afficher que la dernière carte)

    // Crée la nouvelle image
    var imagecard = document.createElement("img");
    imagecard.src = "attached_assets/cartes/" + lastCard.type + ".jpg";
    parentElement.appendChild(imagecard);
    imagecard.classList.add("w-24", "h-36", "rounded-lg", "border-2", "border-white-400", "shadow-md");
}

export function log(message) {
    const logContainer = document.getElementById("game-log");

    const p = document.createElement("p");
    p.textContent = message;
    p.classList.add("opacity-80", "mb-1");

    logContainer.appendChild(p);


    logContainer.scrollTop = logContainer.scrollHeight;// sroll auto vers le bas
}
export function nomJoueur(index) {
    return index === 0 ? "Vous" : `IA ${index}`;
}

export function nomCarte(type) {
    const cartes = [
        "Espionne", "Garde", "Prêtre", "Baron",
        "Servante", "Prince", "Chancelier",
        "Roi", "Comtesse", "Princesse"
    ];
    return cartes[type] ?? "Carte inconnue";
}


// ----------------- PRETRE -----------------
export function afficherCartePretre(card) {
    return new Promise(resolve => {
        if (!card) {
            console.warn("Prêtre affiché avec carte inexistante");
            resolve();
            return;
        }

        const overlay = document.getElementById("overlay-pretre");
        if (!overlay) {
            console.error("Overlay Prêtre manquant dans le HTML");
            resolve();
            return;
        }

        const nomEl = document.getElementById("pretre-nom-carte");
        const imgEl = document.getElementById("pretre-img-carte");
        if (!nomEl || !imgEl) {
            console.error("Éléments Prêtre manquants");
            resolve();
            return;
        }

        nomEl.textContent = safeCardName(card);
        imgEl.src = safeCardImg(card);

        overlay.classList.remove("hidden");
        document.getElementById("close-pretre").onclick = () => {
            overlay.classList.add("hidden");
            resolve();
        };
    });
}

// ----------------- BARON -----------------
export function afficherDuelBaron({ joueurA, carteA, joueurB, carteB }) {
    return new Promise(resolve => {
        if (!joueurA || !joueurB) {
            console.warn("Duel Baron sans joueurs valides");
            resolve();
            return;
        }

        const overlay = document.getElementById("overlay-baron"); //on retrouve dans le html l'id de l'overlay des cartes du baron pour afficher le duel
        const imgA = document.getElementById("carteA");
        const imgB = document.getElementById("carteB");
        const blocA = document.getElementById("blocA");
        const blocB = document.getElementById("blocB");
        const btn = document.getElementById("btn-continue");

        if (!overlay || !imgA || !imgB || !blocA || !blocB || !btn) {
            console.error("Overlay Baron incomplet dans le HTML"); //erreur il manque id , pour le debug
            resolve();
            return;
        }


        blocA.classList.remove("ring-4", "ring-red-500");
        blocB.classList.remove("ring-4", "ring-red-500");

        imgA.src = safeCardImg(carteA);
        imgB.src = safeCardImg(carteB);

        // déterminer perdant et ajouter le contour rouge autour de celui qui a perdu
        if (carteA && carteB) {
            if (carteA.type > carteB.type) blocB.classList.add("ring-4", "ring-red-500");
            else if (carteB.type > carteA.type) blocA.classList.add("ring-4", "ring-red-500");
        }

        overlay.classList.remove("hidden");
        btn.onclick = () => {
            overlay.classList.add("hidden");
            resolve();
        };
    });
}
// ----------------- ESPIONNE -----------------
export function afficherEspionneHumain() {
    const zone = document.getElementById("player-equiped");
    if (!zone) return;


    retirerEspionneHumain();// Supprime ancien élément s’il existe

    const img = document.createElement("img");
    img.src = "attached_assets/cartes/0.jpg";
    img.className = "espionne w-24 h-36 rounded-lg border-2 border-green-500";
    zone.appendChild(img);
}

export function retirerEspionneHumain() {
    document.querySelectorAll(".espionne").forEach(e => e.remove());
}

export function afficherEspionneIA(index) {
    const el = document.getElementById("ia" + index);
    if (!el) return;


    retirerEspionneIA(index);// Supprime l'ancien label s’il existe

    const span = document.createElement("div");
    span.textContent = "Espionne";
    span.className = "espionne-label text-green-400 text-xs";
    el.appendChild(span);
}

export function retirerEspionneIA(index) {
    const el = document.getElementById("ia" + index);
    if (!el) return;
    el.querySelectorAll(".espionne-label").forEach(e => e.remove());
}

// ----------------- SERVANTE -----------------
export function afficherServanteHumain() {
    const zone = document.getElementById("player-equiped");
    if (!zone) return;


    retirerServanteHumain();

    const img = document.createElement("img");
    img.src = "attached_assets/cartes/4.jpg";
    img.className = "servante w-24 h-36 rounded-lg border-2 border-blue-500";
    zone.appendChild(img);
}

export function retirerServanteHumain() {
    document.querySelectorAll(".servante").forEach(e => e.remove());
}

export function afficherServanteIA(index) {
    const el = document.getElementById("ia" + index);
    if (!el) return;


    retirerServanteIA(index);

    const span = document.createElement("div");
    span.textContent = "Servante";
    span.className = "servante-label text-blue-400 text-xs";
    el.appendChild(span);
}

export function retirerServanteIA(index) {
    const el = document.getElementById("ia" + index);
    if (!el) return;
    el.querySelectorAll(".servante-label").forEach(e => e.remove());
}


// ----------------- CHANCELIER -----------------
export function choisirChancelier(cartes) {
    return new Promise(resolve => {
        const overlay = document.getElementById("overlay-chancelier");
        overlay.classList.remove("hidden");
        overlay.innerHTML = `
            <p class="mb-2">Choisissez l'ordre des cartes à mettre sous la pioche :</p>
            <div id="chancelier-cards" class="flex gap-4"></div>
        `;

        const container = overlay.querySelector("#chancelier-cards");

        // Ajouter les cartes avec boutons que le joueur peut cliquer
        const choix = [];
        cartes.forEach((c, i) => {
            const cardDiv = document.createElement("div");
            cardDiv.innerHTML = `
                <img src="attached_assets/cartes/${c.type}.jpg" class="w-24 h-36 rounded-lg border-2 border-yellow-400">
                <button class="mt-1 w-full bg-green-500 text-white rounded">Mettre en bas maintenant</button>
            `;
            container.appendChild(cardDiv);

            cardDiv.querySelector("button").onclick = () => {
                console.log("Carte cliquée :", c.type);
                choix.push(c);
                cardDiv.remove(); 
                if (choix.length === 2) {
                    overlay.classList.add("hidden");
                    resolve(choix); 
                }
            };
        });
    });
}



// ----------------- FIN DE MANCHE (plus de cartes ou joueur a éliminé tous le monde) -----------------
export function afficherFin(message) {
    const overlay = document.getElementById("overlay-fin");
    const content = document.getElementById("overlay-fin-content");

    if (!overlay || !content) {
        console.error("Overlay fin manquant");//DEBUG
        return;
    }

    overlay.classList.remove("hidden");
    content.innerHTML = `
        <p class="text-center font-bold text-lg mb-4">${message}</p>
        <button id="restart-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded">
            Rejouer
        </button>
    `;

    const btn = content.querySelector("#restart-btn");
    if (!btn) return;

    btn.onclick = () => {
        overlay.classList.add("hidden");
        content.innerHTML = "";
        if (window.restartGame) window.restartGame();
    };
}

//fonctions utiles en plus à ne pas supprimer
export function safeCardName(card) {
    return card ? nomCarte(card.type) : "aucune carte";
}

export function safeCardImg(card) {
    return card ? `attached_assets/cartes/${card.type}.jpg` : "attached_assets/cartes/0.jpg";
}