let currentQuestionIndex = 0;
let score = 0;
let username = "";
let lastname = "";

function Son() {
  const audio = new Audio();
  audio.src = "../../../Z.mp3";
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
  const questionPositionElement = document.getElementById("question-position"); // Ajout

  // Mettre à jour la position de la question
  questionPositionElement.textContent = currentQuestionIndex + 1; // Ajout

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
  if (currentQuestion.link) {
    InjecterLien(currentQuestion.link.text, currentQuestion.link.url);
  }
}

// Fonction pour vérifier la réponse du joueur
function verifierReponse() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (!selectedOption) {
    alert(`${username} ${lastname}, Sélectionne une réponse avant de valider.`);
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
  gameContent.innerHTML = `<h6>${username} - ${lastname}</h6> <h3>Continuez à vous entraîner très souvent !!!</h3>`;
  const questionPositionElement = document.getElementById("question-position"); // Ajout
  questionPositionElement.innerHTML = "";
  const PosContent = document.querySelector(".position");
  PosContent.style.display = "none";

  const restartButton = document.getElementById("restart-button");
  restartButton.style.display = "block";
  const ACCUEIL = document.getElementById("Accueil");
  ACCUEIL.style.display = "none";
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
setTimeout(afficherModal, 50);

// Fonction pour afficher la modal
function afficherModal() {
  // Vérifier si le score est supérieur à zéro
  if (score === 0) {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    let Header = document.querySelector("header");
    let Accueil = document.getElementById("Accueil");
    let refreshButton = document.getElementById("refreshButton");
    refreshButton.style.display = "none";
    Header.style.display = "none";
    Accueil.style.display = "none";
  }
}

// ***********Rafraichissement de la page***********************
let refreshButton = document.getElementById("refreshButton");

refreshButton.addEventListener("click", function () {
  location.reload();
});

//soumission du formulaire
document
  .getElementById("userForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Récupérer les valeurs des champs
    username = document.getElementById("username").value;
    lastname = document.getElementById("lastname").value;
    const Joueur = document.querySelector(".JokerName");
    Joueur.textContent = username + " " + lastname;

    // Validation du formulaire (ici on peut ajouter plus de logique de validation)
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

    console.log("Nom :", username);
    console.log("Post-nom :", lastname);

    // Fermer la fenêtre modale après validation
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
    let Header = document.querySelector("header");
    let Accueil = document.getElementById("Accueil");
    let refreshButton = document.getElementById("refreshButton");
    refreshButton.style.display = "block";
    Header.style.display = "block";
    Accueil.style.display = "block";
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
