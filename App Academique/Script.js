const questions = [
  {
    question: "Quelle est la capitale de la Russie ?",
    options: ["Paris", "Moscou", "Berlin", "Madrid"],
    answer: "Moscou",
  },
  {
    question: "Qui a peint la Joconde ?",
    options: [
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Michel-Ange",
    ],
    answer: "Leonardo da Vinci",
  },
  {
    question: "Quelle est la planète la plus proche du soleil ?",
    options: ["Terre", "Mars", "Vénus", "Mercure"],
    answer: "Mercure",
    link: { text: "Voir l'image", url: "././imgLinks/Planète_mercure.png" },
  },
  {
    question:
      "Quelle fût la raison de l'arrestation et l'assassinat de Patrice. E. LUMUMBA ?",
    options: [
      "Son combat pour un Congo indépendant",
      "Sa lutte pour la richesse du Congo-RDC",
      "Son combat pour sa femme",
      "Son combat contre la Belgique",
    ],
    answer: "Son combat pour un Congo indépendant",
    link: { text: "Voir l'image", url: "././imgLinks/LUMUMBA.png" },
  },
  {
    question:
      "Quel héro originaire d'Argentine avait aidé Laurent Désiré KABILA dans sa lutte contre le régime de Joseph MOBUTU ?",
    options: [
      "Eva Peron",
      "Fidel Castro",
      "Ernesto Che Guevara",
      "Mauricio Macri",
    ],
    answer: "Ernesto Che Guevara",
    link: { text: "Voir l'image", url: "././imgLinks/Che Guevara.png" },
  },
  {
    question:
      "Dans les années 1930, quel peuple fût pris pour cible et accusé du malheur de l'Allemagne NAZI ?",
    options: ["Soviétique", "Juif", "Arabe", "Mongol"],
    answer: "Juif",
  },
];

let currentQuestionIndex = 0;
let score = 0;
let username = "";
let lastname = "";

function Son() {
  const audio = new Audio();
  audio.src = "Z.mp3";
  audio.play();
}

// Fonction pour mélanger les questions aléatoirement
function shuffleQuestions(questions) {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

// Fonction pour afficher une nouvelle question
function afficherQuestion() {
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const questionPositionElement = document.getElementById("question-position");

  // Mettre à jour la position de la question
  questionPositionElement.textContent = currentQuestionIndex + 1;

  const currentQuestion = questions[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.innerHTML = `<input type="radio" id="option${index}" name="answer" value="${option}">
                                          <label for="option${index}">${option}</label>`;
    optionsElement.appendChild(optionElement);
  });

  // Ajout d'un événement à chaque bouton radio pour désactiver les autres boutons une fois qu'un bouton est sélectionné
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((radioButton) => {
    radioButton.addEventListener("click", function () {
      radioButtons.forEach((btn) => {
        btn.disabled = true;
      });
      this.disabled = false; // Réactiver le bouton sélectionné
    });
  });

  // Appel de la fonction InjecterLien si la question a un lien
  if (currentQuestion.link) {
    InjecterLien(currentQuestion.link.text, currentQuestion.link.url);
  }
}

// Fonction pour vérifier la réponse du joueur
function verifierReponse() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (!selectedOption) {
    alert(`${username} ${lastname}, sélectionne une réponse avant de valider.`);
    return;
  }

  const answer = selectedOption.value;
  const currentQuestion = questions[currentQuestionIndex];
  if (answer === currentQuestion.answer) {
    Son();
    score++;
  }

  currentQuestionIndex++;

  // Mettre à jour l'affichage du score et du pourcentage de progression
  const currentScoreElement = document.getElementById("current-score");
  currentScoreElement.textContent = score;

  const progressPercentageElement = document.getElementById(
    "progress-percentage"
  );
  const totalQuestionsElement = document.getElementById("total-questions");
  totalQuestionsElement.textContent = questions.length;

  const progressPercentage = ((score / questions.length) * 100).toFixed(2);
  progressPercentageElement.textContent = progressPercentage + "%";

  if (currentQuestionIndex < questions.length) {
    afficherQuestion();
  } else {
    afficherResultat();
  }
}

// Fonction pour afficher le résultat final
function afficherResultat() {
  const gameContent = document.getElementById("game-content");
  gameContent.innerHTML = `<h6>${username} - ${lastname}</h6> <h3>Entraînez-vous très souvent !</h3>`;
  const questionPositionElement = document.getElementById("question-position");
  questionPositionElement.style.visibility = "hidden";
  // Afficher le bouton "Recommencer" une fois le test terminé
  const restartButton = document.getElementById("restart-button");
  restartButton.style.display = "block";
  const position = document.querySelector(".position");
  position.style.visibility = "hidden";
  const Joueur = document.querySelector(".JokerName");
  const ID = document.querySelector(".JokerID");
  Joueur.textContent = "";
  ID.style.display = "none";
}

// Événement lorsque le bouton de validation est cliqué
const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", verifierReponse);
submitButton.addEventListener("click", function () {
  // Son();
});

// Appel de la fonction pour mélanger les questions avant de commencer le jeu
shuffleQuestions(questions);

// Afficher la première question au chargement de la page
afficherQuestion();

// Événement lorsque le bouton "Recommencer" est cliqué
const restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", () => {
  location.reload();
});
restartButton.classList.add("Recommencer");
restartButton.addEventListener("mouseenter", function () {
  restartButton.classList.toggle("Recom-hover");
});

// Afficher la modal après un certain délai
setTimeout(afficherModal, 3000);

// Fonction pour afficher la modal
function afficherModal() {
  // Vérifier si le score est supérieur à zéro
  if (score === 0) {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    let Header = document.querySelector("header");
    Header.style.display = "none";
  }
}

// Écouter l'événement de soumission du formulaire
document
  .getElementById("userForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    // Récupérer les valeurs des champs
    username = document.getElementById("username").value;
    lastname = document.getElementById("lastname").value;
    const Joueur = document.querySelector(".JokerName");
    Joueur.textContent = username + " " + lastname;

    if (username.length < 2) {
      alert("Majuscule, séparés par un trait !");
      return;
    }

    if (lastname.length < 2) {
      alert("Majuscule, minimum 2 caractères !");
      return;
    }

    // Validation du format
    const usernameRegex = /^[A-Z,-]+$/;
    const lastnameRegex = /^[A-Z,-]+$/;

    if (!usernameRegex.test(username)) {
      alert("Lettres majuscules et tirets sont les seules acceptés");
      return;
    }

    if (!lastnameRegex.test(lastname)) {
      alert("Lettres majuscules et tirets sont les seules acceptés");
      return;
    }

    // Traitement des données (ici on peut envoyer les données à un serveur, etc.)
    console.log("Nom d'utilisateur:", username);
    console.log("Post-nom:", lastname);

    // Fermer la fenêtre modale après validation
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
    let Header = document.querySelector("header");
    Header.style.display = "block";
  });

const toggleButton = document.getElementById("toggle-button");
toggleButton.addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
});

document.addEventListener("click", function (event) {
  const sidebar = document.getElementById("sidebar");
  const toggleButton = document.getElementById("toggle-button");

  // Vérifie si le clic a été effectué à l'intérieur de la sidebar ou sur le bouton de toggle
  const isClickInsideSidebar = sidebar.contains(event.target);
  const isClickOnToggleButton = toggleButton.contains(event.target);

  // Si le clic n'est pas à l'intérieur de la sidebar ni sur le bouton de toggle, cache la sidebar
  if (!isClickInsideSidebar && !isClickOnToggleButton) {
    sidebar.classList.remove("show");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    // Hide loader
    document.getElementById("loader-wrapper").style.display = "none";
    // Show content
    document.getElementById("content").classList.add("loaded");
  }, 3967);
});

// Modifier la fonction InjecterLien pour afficher l'image en superposition
function InjecterLien(linkText, url) {
  const questionElement = document.getElementById("question");
  const lien = document.createElement("a");
  lien.href = "#"; // Lien vide pour éviter le rechargement
  lien.textContent = linkText;
  lien.addEventListener("click", function (event) {
    event.preventDefault(); // Empêcher le lien de se comporter normalement
    afficherImageEnSuperposition(url);
  });
  lien.style.display = "block"; // Pour que le lien soit sur une nouvelle ligne
  questionElement.appendChild(lien);
}

// Fonction pour afficher l'image en superposition
function afficherImageEnSuperposition(url) {
  const overlay = document.getElementById("overlay");
  const image = document.getElementById("overlay-image");
  image.src = url;
  overlay.style.display = "block";

  // Ajouter un événement pour fermer l'image en superposition lorsque le bouton de fermeture est cliqué
  const closeButton = document.getElementById("close-button");
  closeButton.addEventListener("click", function () {
    overlay.style.display = "none";
  });
}
