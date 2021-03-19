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

//console.log(graphe.entries());
//console.log(...graphe.entries());
console.log([...graphe.entries()]);
//transformer le Map en tableau pour pouvoir le trier puis le retransformer en Map
graphe = new Map([...graphe.entries()].sort((a, b) => (b[1].size - a[1].size)));
console.log("\n-----\nLe graphe trié:");
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

//trier les couleurs par ordre qu'il en a dans la grille en fixe
couleur.sort((a, b) => (
  ([...couleurs.entries()].filter(c => c[1] == b)).length
  -
  ([...couleurs.entries()].filter(c => c[1] == a)).length
));
console.log("\n-----\nCouleurs triées:");
console.log(couleur);


var ligne = false;
//var mem_x = Array(Array(), Array(), Array(), Array(), Array(), Array(), Array(), Array(), Array());
var mem_x = new Array();
for (i = 0; i < LONGUEUR; i++) {
  mem_x[i] = new Array()
}

//for (var n = 0; n < LONGUEUR; n++) {
for (var n = 8; n > -1; n--) {
  var x = 0;
  var y = 0;
  while (y < LONGUEUR) {
    ligne = false;
    x = 0;
    while (x < LONGUEUR) {
      var c = couleurs.get(`${y},${x}`);
      if (ligne == false && (c == -1 || c == n) && [...couleurs].filter(v => v[1] == n).every(k => !graphe.get(k[0]).has(`${y},${x}`))) {
        couleurs.set(`${y},${x}`, n);
        mem_x[n][y] = c == n ? LONGUEUR - 1 : x;
        ligne = true;
        //x = LONGUEUR;
        //console.log(`${y},${x} --> ${n}---> y , x`);
      }
      //}
      else if ((x == LONGUEUR - 1) && (ligne == false)) {
        //console.log("***");
        //console.log(`${y},${x} --> couleur:${n} --> false`);
        couleurs.set(`${y - 1},${mem_x[n][y - 1]}`, -1);
        if (mem_x[n][y - 1] < LONGUEUR - 1) {
          //console.log("COUCOU");
          x = mem_x[n][y - 1];
          y = y - 1;
        } else {
          // J'ai l'impression que ce cas n'arrive jamais, 
          // la position du x de la couleur sur la ligne y-1
          // n'est jamais 8 quand ça fonctionne pas sur la ligne y
          if (mem_x[n][y - 2] < LONGUEUR - 1) {
            couleurs.set(`${y - 2},${mem_x[n][y - 2]}`, -1);
            x = mem_x[n][y - 2];
            y = y - 2;
          }
        };
        //console.log(mem_x[n][y]);
        //console.log("***");
      };
      x++
      //console.log("----------------------------------------");
    };
    y++
  };
};

console.log("\n-----\nAttribution des couleurs:");
console.log([...couleurs]);
console.log(mem_x);