document.addEventListener('DOMContentLoaded', function() {
    const mainContainer = document.querySelector('.container');
    const searchButton = document.querySelector('#search-button');
    const usernameInputField = document.querySelector('#user-input');
    const statsContainer = document.querySelector('.stats-container');
    const easyProgressCircle = document.querySelector('.easy-progress');
    const mediumProgressCircle = document.querySelector('.medium-progress');
    const hardProgressCircle = document.querySelector('.hard-progress');
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');
    const easyName = document.querySelector('#easy-name');
    const mediumName = document.querySelector('#medium-name');
    const hardName = document.querySelector('#hard-name');
    const cardStatsContainer = document.querySelector('.stats-card');
    const cards = document.querySelectorAll('.cards');

    //return true or false based on a regex (regular expression)
function isValidUsername(username) {
    if(username.trim() == "") {
        alert("Username cannot be empty.");
        return false;
    }
    const regex = /^[a-zA-Z][a-zA-Z0-9_-]{1,14}[a-zA-Z0-9]$/;
    const isMatching = regex.test(username);
    if(!isMatching && username!="") {
        alert("Invalid username");
    }
    return isMatching;
}

function updateProgress(solved, total, label, circle, nameTag) {
    const progressPercent = (solved/total) * 100;
    circle.style.setProperty("--progress-degree", `${progressPercent}%`);
    label.textContent = `${solved}/${total}`;
    nameTag.style.setProperty("position", "relative");
    label.style.setProperty("position", "relative");
    nameTag.style.setProperty("top", "70%");
    label.style.setProperty("top", "70%");
}

function updateCards(cardData, cardText, cardPosition) {
    cardPosition.innerHTML = `<p style="margin-top: 11px; font-weight: bold">${cardText}</p> <p> ${cardData} </p>`;
    cardPosition.style.cssText = `
        display: inline-block;
        margin: 1rem;
        gap: 5rem;
        border-radius: 13px;
        text-align: center;
        padding: 0.2rem;
        border: 3px solid black;
        margin-top: 4px;
    `;
}

function displayUserData(parsedData, mainContainer, statsContainer) {
    const totalSolvedQues = parsedData.totalSolved;
    const easySolvedQues = parsedData.easySolved;
    const mediumSolvedQues = parsedData.mediumSolved;
    const hardSolvedQues = parsedData.hardSolved;

    const totalQues = parsedData.totalQuestions;
    const totalEasyQues = parsedData.totalEasy;
    const totalMediumQues = parsedData.totalMedium;
    const totalHardQues = parsedData.totalHard;

    mainContainer.style.setProperty("height", "65%");
    statsContainer.style.setProperty("display", "block");
    updateProgress(easySolvedQues, totalEasyQues, easyLabel, easyProgressCircle, easyName);
    updateProgress(mediumSolvedQues, totalMediumQues, mediumLabel, mediumProgressCircle, mediumName);
    updateProgress(hardSolvedQues, totalHardQues, hardLabel, hardProgressCircle, hardName);

    const rank = parsedData.ranking;
    const acceptance = parsedData.acceptanceRate;

    updateCards(rank, "Ranking", cards[0]);
    updateCards(acceptance, "Acceptance Rate", cards[1]);
}

async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error("Unable to load the user details");
        }
        const parsedData = await response.json();
        console.log("Data is: ", parsedData);

        displayUserData(parsedData, mainContainer, statsContainer);
    }
    catch(error) {
        statsContainer.innerHTML = "<p>Data not found</p>";
    }
    finally {
        searchButton.textContent = "Search";
        searchButton.disabled = false;
    }
}

    searchButton.addEventListener('click', () => {
        const username = usernameInputField.value;
        // console.log(username);
        if(isValidUsername(username)) {
            fetchUserDetails(username);
        }
    })
})