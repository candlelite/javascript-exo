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
    //groupe horizontal pour un sommet
    for (var cx = 0; cx < LONGUEUR; cx++) {
      if (x !== cx) graphe.get(`${y},${x}`).add(`${y},${cx}`);
    }
    //groupe vertical pour un sommet
    for (var cy = 0; cy < LONGUEUR; cy++) {
      if (y !== cy) graphe.get(`${y},${x}`).add(`${cy},${x}`);
    }
    //groupe carré pour un sommet
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

initCouleurs = () =>{
  couleurs = new Map([...graphe.keys()].map(s => {
    setSommet(s, -1, false);
    return [s, -1]
  }));
};


const couleur = [];
for (i = 0; i < LONGUEUR; i++) {
  couleur[i] = i;
}
console.log("couleur");
console.log(couleur);

// Initialisation du tableau visuel
// (pourrait être fait en même temps que le remplissage (initialisation) du graphe)
var table = document.createElement('table');
table.setAttribute("id", "table1");
table.setAttribute("class", "grille");
for (var y = 0; y < LONGUEUR; y++) {
  var tr = document.createElement('tr');
  table.appendChild(tr);
  for (var x = 0; x < LONGUEUR; x++) {
    var td = document.createElement('td');
    td.setAttribute("id", `${y},${x}`);
    td.setAttribute("onMouseOver", "highlightBG(this, 'yellow')");
    td.setAttribute("onMouseOut", "restoreBG(this)");
    tr.appendChild(td);
  }
}
body.appendChild(table);

//tableau du choix des couleurs
var tableC = document.createElement('table');
tableC.setAttribute("id", "table2");
tableC.setAttribute("class", "choix");
var tr = document.createElement('tr');
tableC.appendChild(tr);
var td = document.createElement('td');
td.setAttribute("id", `${-1}`);
td.setAttribute("onMouseOver", "highlightBG(this, 'yellow')");
td.setAttribute("onMouseOut", "restoreBG(this)");
tr.appendChild(td);
for (i = 0; i < LONGUEUR; i++) {
  var td = document.createElement('td');
  td.setAttribute("id", `${i}`);
  td.setAttribute("onMouseOver", "highlightBG(this, 'yellow')");
  td.setAttribute("onMouseOut", "restoreBG(this)");
  td.innerText = i;
  tr.appendChild(td);
}
body.appendChild(tableC);

// [...table.querySelectorAll('td')].forEach((el, index) => {
//   el.style.opacity = 0.4;
// });


table.addEventListener("click", (e) => {
  console.log("TABLE clicked");
  console.log(e.target.innerText);
  console.log(e.target.id);
  console.log(e);
  tmpSommet = e.target.id;
  //console.log(tmpSommet);
  //e.target.style.opacity == 0.4 ? e.target.style.opacity = 1 : e.target.style.opacity = 0.4;
  e.target.style.opacity = 0.3;
});

tableC.addEventListener("click", (e) => {
  console.log("TABLE clicked");
  console.log(e.target.innerText);
  console.log(e.target.id);
  console.log(e);
  tmpCouleur = e.target.id;
  console.log(tmpCouleur);
  setSommet(tmpSommet, tmpCouleur, true);
});



var resoudre = document.createElement('button');
resoudre.setAttribute("id", "resoudre1");
resoudre.setAttribute("class", "buttonRound");
resoudre.setAttribute("name", "resoudre");
body.appendChild(resoudre);
resoudre.innerText = "Résoudre";
resoudre.addEventListener("click", (e) => {
  resoudre();
});

var reset = document.createElement('button');
reset.setAttribute("id", "reset1");
reset.setAttribute("class", "buttonRound");
reset.setAttribute("name", "reset");
body.appendChild(reset);
reset.innerText = "Reset";
reset.addEventListener("click", (e) => {
  initCouleurs();
});




function highlightBG(element, color) {
  element.style.backgroundColor = color;
};
function restoreBG(element) {
 element.innerText == "" ? element.style.backgroundColor = "#edebeb"
 : element.style.backgroundColor = "white";
};


setSommet = (sId, couleur, fix = false) => {
  couleurs.set(sId, couleur);
  td = document.getElementById(sId)
  couleur == -1 ? td.innerText = "" :td.innerText = couleur;
  fix === true ? td.style.color = "red" : td.style.color = "black";
};

// Algorithme de résolution
// pile qui va empiler et dépiler les cases remplies puis effacées
const pile = [];
/*
On prend le sommet(case) vide, qui a le moins de cases reliées qui 
sont déjà remplies,
*/
resoudre = () => {
  var c = 0;
  var rempli = false;
  while ([...couleurs].filter(e => e[1] == -1).length > 0) {
    const trous = [...couleurs].filter(e => e[1] == -1).sort((a, b) =>
      [...graphe.get(a[0])].filter(v => couleurs.get(v) == -1).length
      -
      [...graphe.get(b[0])].filter(v => couleurs.get(v) == -1).length
    );
    trou = trous[0][0];
    //console.log(trou);
    c = 0;
    rempli = false;
    while (rempli == false) {
      if (c < LONGUEUR) {
        if ([...couleurs].filter(e => e[1] == couleur[c]).every(e => !graphe.get(e[0]).has(trou))) {
          //console.log("OK");
          setSommet(trou, c);
          pile.push([trou, c]);
          rempli = true;
        };
      } else {
        p = pile.pop();
        trou = p[0];
        c = p[1];
        setSommet(trou, -1);
      };
      c++
    };
  };
}