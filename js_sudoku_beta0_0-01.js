const PUISSANCE = 3;
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

couleurs = new Map([...graphe.keys()].map(s => [s, 0]));
console.log("\n-----\nInnitialisation des couleurs:");
console.log(couleurs);


var n = 1;
var ligne = false;
var mem_x = Array(Array(), Array(), Array(), Array(), Array(), Array(), Array(), Array(), Array())
var mem_y = 0;
var old_mem_x = 0;
//var old_mem_y = 0;
while ([...couleurs.values()].some(v => v == 0) && n < LONGUEUR-1) {
  var sv = [...couleurs.values()].indexOf(0);
  //console.log(sv);
  //couleurs.set([...couleurs][sv][0], n);
  //for (s of sommets) {
  //console.log([...couleurs][sv][0]);
  for (var y = 0; y < LONGUEUR; y++) {
    ligne = false;
    for (var x = 0; x < LONGUEUR; x++) {
      if (ligne == false && couleurs.get(`${y},${x}`) == 0 && [...couleurs].filter(v => v[1] == n).every(k => !graphe.get(k[0]).has(`${y},${x}`))) {
        couleurs.set(`${y},${x}`, n);
        mem_y = y;
        mem_x[n][y] = x;
        ligne = true;
        //console.log(`${y},${x} --> ${n}---> y , x`);
        //console.log(`${mem_y},${mem_x[n][y]} --> couleur:${n}----> y, x mis en mémoire`);
      }
      //}
      if ((x == LONGUEUR - 1) && (ligne == false)) {
        console.log("***");
        //console.log(`${y},${x} --> couleur:${n} --> false`);
        //console.log(`${mem_y},${mem_x[n][y - 1]}---->remise à 0`);

        couleurs.set(`${mem_y},${mem_x[n][y - 1]}`, 0);

        if (mem_x[n][y - 1] == old_mem_x) {
          console.log("COUCOU");
          couleurs.set(`${mem_y-1},${mem_x[n][y - 2]}`, 0);

          y = mem_y - 1;
          x = mem_x[n][y]+1;
          mem_y = y;
          mem_x[n][y] = x;
        } else {

          y = mem_y;
          x = mem_x[n][y - 1];

          //old_mem_y = mem_y;
          old_mem_x = mem_x[n][y - 1];
        }
        //console.log(`${mem_y},${mem_x[n][y]}---> mem`);
        //console.log(y);
        //console.log(x);
        //console.log(mem_x[n][y]);
        console.log("***");
      }
      console.log("----------------------------------------");
    }

  }
  n++;
};



console.log("\n-----\nAttribution des couleurs:");
console.log([...couleurs]);
console.log(mem_x);