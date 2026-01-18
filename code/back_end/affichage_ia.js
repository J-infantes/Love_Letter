//regroupe les fonctions d'affichage qui concernent les IA genre qui est mort, qui joue, etc

export function AfficherJoueurActuel(indiceJoueur) {
  const iaIds = ["ia1", "ia2", "ia3", "ia4"];
  const playerHand = document.getElementById("player-hand");

  // Reset
  iaIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.color = "black";
  });

  playerHand.style.border = "";

  // Mise en évidence du joueur actif
  if (indiceJoueur === 0) {
    playerHand.style.border = "2px solid yellow";
    playerHand.style.borderRadius = "6px";
  } else {
    const iaEl = document.getElementById("ia" + indiceJoueur);
    if (iaEl) iaEl.style.color = "yellow";
  }
}





export function AfficherJoueurMort(players) {
  for (let i = 1; i < players.length; i++) {
    const el = document.getElementById("ia" + i);
    if (!el) continue;

    el.style.color = players[i].iseliminated ? "red" : "black";
  }
}


export function choisirCibleIA(players) {
  return new Promise(resolve => {
    let alreadyChosen = false;

    players.forEach((player, index) => {
      if (index === 0 || player.iseliminated) return;

      const el = document.getElementById("ia" + index);
      el.classList.add("cursor-pointer", "ring-4", "ring-yellow-400");

      const handler = () => {
        if (alreadyChosen) return;
        alreadyChosen = true;

        cleanupAll();
        resolve(player);
      };

      el.addEventListener("click", handler);

      function cleanupAll() {
        players.forEach((_, i) => {
          const e = document.getElementById("ia" + i);
          if (!e) return;
          e.classList.remove("cursor-pointer", "ring-4", "ring-yellow-400");
          e.replaceWith(e.cloneNode(true)); // supprime tous les listeners
        });
      }
    });
  });
}




export function choisirCarteGarde() {
  return new Promise(resolve => {
    const overlay = document.getElementById("overlay-garde");
    overlay.classList.remove("hidden");

    overlay.querySelectorAll(".carte-garde").forEach(btn => {
      btn.onclick = () => {
        const value = parseInt(btn.dataset.type);
        overlay.classList.add("hidden");
        resolve(value);
      };
    });
  });
}

export function choisirCiblePrince(players, currentIndex) {
  return new Promise(resolve => {
    let alreadyChosen = false;

    // Récupérer l'overlay ou le créer si besoin
    let overlay = document.getElementById("overlay-prince");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "overlay-prince";
      overlay.classList.add("fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", "hidden");
      document.body.appendChild(overlay);
    }

    overlay.classList.remove("hidden");
    overlay.innerHTML = `<div class="bg-gray-800 text-white p-6 rounded-lg flex flex-col items-center gap-4">
      <p class="text-lg font-semibold">Choisissez un joueur à forcer à défausser :</p>
    </div>`;

    const container = overlay.querySelector("div");

    // bouton soi-même (pour ça qu'on pouvait pas réutiliser la fonction choisirCibleIA)
    const selfBtn = document.createElement("button");
    selfBtn.textContent = "Moi";
    selfBtn.classList.add("bg-yellow-400", "text-black", "p-2", "rounded", "hover:scale-105", "transition");
    container.appendChild(selfBtn);

    selfBtn.onclick = () => {
      if (alreadyChosen) return;
      alreadyChosen = true;
      cleanup();
      resolve(players[currentIndex]);
    };

    // bouton ia
    players.forEach((player, index) => {
      if (index === currentIndex || player.iseliminated) return;

      const btn = document.createElement("button");
      btn.textContent = `IA ${index}`;
      btn.classList.add("bg-green-500", "text-white", "p-2", "rounded", "hover:scale-105", "transition");
      container.appendChild(btn);

      btn.onclick = () => {
        if (alreadyChosen) return;
        alreadyChosen = true;
        cleanup();
        resolve(player);
      };
    });

    function cleanup() {
      overlay.classList.add("hidden");
      overlay.innerHTML = "";
    }
  });
}
