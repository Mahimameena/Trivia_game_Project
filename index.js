// store username
function storeUsername() {
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");
    const categoryDropdown = document.getElementById("categoryDropdown");

    if (player1.value && player2.value && categoryDropdown.value) {
        document.getElementById('player1_name').textContent = player1.value;
        document.getElementById('player2_name').textContent = player2.value;

        alert(`Usernames saved: ${player1.value}, ${player2.value}`);
    }
}

document.getElementById('play_button').addEventListener('click', () => {
    if (player1.value && player2.value && categoryDropdown.value) {
        storeUsername();
        document.querySelector('.main1').style.display = "none";
        document.querySelector('.main2').style.display = "block";
    } else {
        alert("Please Enter Usernames and Select a Category.");
    }
});


// Game variables
const startBtn = document.getElementById("start");
const fetching = document.getElementById("fetching");
const exitBtn = document.getElementById('exit');
const nextBtn = document.getElementById('next');
const currentTurnDisplay = document.getElementById("current_turn");

nextBtn.style.display = 'none';
exitBtn.style.display = 'none';

let totalScorePlayer1 = 0;
let totalScorePlayer2 = 0;
let allQuestions = [];
let selectedHistory = [];
let currentIndex = 0;
let isPlayer1Turn = true;

// Fetch questions
const fetchQuestions = async () => {
    fetching.innerHTML = '';
    fetching.classList.add('fetching');
    try {
        const category = document.getElementById("categoryDropdown").value;

        const easyResponse = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&difficulty=easy&limit=2`);
        const mediumResponse = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&difficulty=medium&limit=2`);
        const hardResponse = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&difficulty=hard&limit=2`);

        const easyQuestions = await easyResponse.json();
        const mediumQuestions = await mediumResponse.json();
        const hardQuestions = await hardResponse.json();

        allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        showQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
        fetching.innerHTML = `<p>Error fetching questions. Please try again later.</p>`;
    }
};

// Display the current question
const showQuestion = () => {
    if (currentIndex >= allQuestions.length) {
        declareWinner();
        nextBtn.style.display = 'none';
        return;
    }

    const question = allQuestions[currentIndex];
    const options = [question.correctAnswer, ...question.incorrectAnswers].sort(() => Math.random() - 0.5);

    const player1 = document.getElementById('player1_name').textContent;
    const player2 = document.getElementById('player2_name').textContent;

    currentTurnDisplay.textContent = `Current Turn: ${isPlayer1Turn ? player1 : player2}`;
    fetching.innerHTML = `
        <h3>Category: ${question.category}</h3>
        <h4>Difficulty Level: ${question.difficulty}</h4>
        <p><b>Question: ${question.question}</b></p>
        ${options.map(option => `
            <div>
                <input type="radio" name="question" value="${option}">
                <label>${option}</label>
            </div>
        `).join('')}
    `;
};

// Calculate score
const calculateScore = (selectedOption, currentQuestion) => {
    let points = 0;
    if (selectedOption.value === currentQuestion.correctAnswer) {
        switch (currentQuestion.difficulty) {
            case "easy":
                points = 10;
                break;
            case "medium":
                points = 20;
                break;
            case "hard":
                points = 30;
                break;
        }

        if (isPlayer1Turn) {
            totalScorePlayer1 += points;
        } else {
            totalScorePlayer2 += points;
        }
    } else {
        console.log(`Wrong answer! The correct answer was: ${currentQuestion.correctAnswer}`);
    }
};

// Declare winner
const declareWinner = () => {
    const player1Name = document.getElementById('player1_name').textContent;
    const player2Name = document.getElementById('player2_name').textContent;

    let resultMessage = `<h3>Game Over!</h3>`;
    resultMessage += `<h3>${player1Name}: ${totalScorePlayer1}</h3>`;
    resultMessage += `<h3>${player2Name}: ${totalScorePlayer2}</h3>`;

    if (totalScorePlayer1 > totalScorePlayer2) {
        resultMessage += `<h3>Winner: ${player1Name}</h3>`;
    } else if (totalScorePlayer2 > totalScorePlayer1) {
        resultMessage += `<h3>Winner: ${player2Name}</h3>`;
    } else {
        resultMessage += `<h3>It's a Tie!</h3>`;
    }
    resultMessage += `<button id="playAgain">Play Again</button>`;
    document.getElementById('fetching').innerHTML = resultMessage;

    // Store the selected category in memory
    const selectedCategory = document.getElementById('categoryDropdown').value;
    if (selectedCategory && !selectedHistory.includes(selectedCategory)) {
        selectedHistory.push(selectedCategory);
    }

    console.log(selectedHistory, "Selected Categories");

    // All available categories
    const allCategories = [
        "arts & Literature",
        "general_knowledge",
        "society_and_culture",
        "food_and_drink",
        "film_and_tv",
        "geography",
        "science",
        "history",
        "music",
        "sports"
    ];

    // Handle the "Play Again" button click
    const playAgainButton = document.getElementById("playAgain");
    if (playAgainButton) {
        playAgainButton.addEventListener('click', function () {
            const main1 = document.querySelector('.main1');
            const main2 = document.querySelector('.main2');

            if (main1 && main2) {
                main1.style.display = "block";
                main2.style.display = "none";
            }

            const select = document.getElementById('categoryDropdown');
            select.innerHTML = ''; 

            // Reset scores and players when playing again
            totalScorePlayer1 = 0;
            totalScorePlayer2 = 0;
            currentIndex = 0;
            isPlayer1Turn = true;
            document.getElementById('player1_name').textContent = '';
            document.getElementById('player2_name').textContent = '';

            startBtn.style.display = 'block';
            startBtn.style.margin = "auto";
            exitBtn.style.display = 'none';

            document.getElementById('fetching').innerHTML = '';

            const playButton = document.getElementById('play_button');
            playButton.style.display = 'inline-block';

            // Add only the remaining categories (excluding selected history) to the dropdown
            const remainingCategories = allCategories.filter(category => !selectedHistory.includes(category));
            remainingCategories.forEach(function (category) {
                const option = document.createElement('option');
                option.innerHTML = category;
                option.value = category;
                select.appendChild(option);
            });
        });
    }
};

// Start button event
startBtn.addEventListener("click", () => {
    startBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
    exitBtn.style.display = 'inline-block';
    fetchQuestions();
});

// Next button event
nextBtn.addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="question"]:checked');
    if (!selectedOption) {
        alert("Please select an answer before proceeding!");
        return;
    }

    calculateScore(selectedOption, allQuestions[currentIndex]);
    currentIndex++;
    isPlayer1Turn = !isPlayer1Turn;
    showQuestion();
});

// Exit button event
exitBtn.addEventListener('click', () => {
    const main1 = document.querySelector('.main1');
    const main2 = document.querySelector('.main2');
    if (main1 && main2) {
        main1.style.display = "block";
        main2.style.display = "none";
    }
    totalScorePlayer1 = 0;
            totalScorePlayer2 = 0;
            currentIndex = 0;
            isPlayer1Turn = true;
            document.getElementById('player1_name').textContent = '';
            document.getElementById('player2_name').textContent = '';

            startBtn.style.display = 'block';
            startBtn.style.margin = "auto";
            exitBtn.style.display = 'none';

            document.getElementById('fetching').innerHTML = '';

            const playButton = document.getElementById('play_button');
            playButton.style.display = 'inline-block';
});
