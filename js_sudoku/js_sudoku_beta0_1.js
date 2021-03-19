const PUISSANCE = 3; // pas plus de 5, sinon ça plante
const LONGUEUR = PUISSANCE * PUISSANCE;

// Initialisation des sommets
sommets = new Set();
for (var y = 0; y < LONGUEUR; y++) {
  for (var x = 0; x < LONGUEUR; x++) {
    sommets.add(`${y},${x}`);
  }
}
console.log("\n-----\nLes sommets");
console.log(sommets);

// Initialisation du graphe
graphe = new Map([...sommets.keys()].map(v => [v, new Set()]));
console.log("\n-----\nLe graphe vide:");
console.log(graphe);

// Remplissage du graphe
for (var y = 0; y < LONGUEUR; y++) {
  for (var x = 0; x < LONGUEUR; x++) {
    for (var cx = 0; cx < LONGUEUR; cx++) {
      if (x !== cx) graphe.get(`${y},${x}`).add(`${y},${cx}`);
    }
    for (var cy = 0; cy < LONGUEUR; cy++) {
      if (y !== cy) graphe.get(`${y},${x}`).add(`${cy},${x}`);
    }
    var czx = ((x / PUISSANCE) | 0) * PUISSANCE;
    var czy = ((y / PUISSANCE) | 0) * PUISSANCE;
    for (var czyy = czy; czyy < czy + PUISSANCE; czyy++) {
      for (var czxx = czx; czxx < czx + PUISSANCE; czxx++) {
        if (y !== czyy) graphe.get(`${y},${x}`).add(`${czyy},${czxx}`);
      }
    }
  }
}
console.log("\n-----\nLe graphe rempli:");
console.log(graphe);


couleurs = new Map([...graphe.keys()].map(s => [s, -1]));
console.log("\n-----\nInnitialisation des couleurs:");
console.log(couleurs);

// positionnement de couleurs de départ fixes
couleurs.set("6,6", 8);
couleurs.set("6,7", 3);
couleurs.set("6,8", 7);
couleurs.set("7,6", 5);
couleurs.set("7,7", 2);
couleurs.set("7,8", 0);
couleurs.set("8,6", 1);
couleurs.set("8,7", 6);
couleurs.set("8,8", 4);

const couleur = [];
for (i = 0; i < LONGUEUR; i++) {
  couleur[i] = i;
}
console.log("couleur");
console.log(couleur);

// pile qui va empiler et dépiler les cases remplies puis effacées
const pile = [];

/*
On prend le sommet(case) vide, qui a le moins de cases reliées qui 
sont déjà remplies,

*/
var c = 0;
var rempli = false;
while ([...couleurs].filter(e => e[1] == -1).length > 0) {
  trous = [...couleurs].filter(e => e[1] == -1).sort((a, b) =>
    [...graphe.get(a[0])].filter(v => couleurs.get(v) == -1).length
    -
    [...graphe.get(b[0])].filter(v => couleurs.get(v) == -1).length
  );
  trou = trous[0][0];
  c = 0;
  rempli = false;
  while (rempli == false) {
    if (c < LONGUEUR) {
      if ([...couleurs].filter(e => e[1] == couleur[c]).every(e => !graphe.get(e[0]).has(trou))) {
        //console.log("OK");
        couleurs.set(trou, c);
        pile.push([trou, c]);
        rempli = true;
      };
    } else {
      p = pile.pop();
      trou = p[0];
      c = p[1];
      couleurs.set(trou, -1);
    };
    c++
  };
};

console.log("\n-----\ncouleurs résolues:");
console.log(couleurs);