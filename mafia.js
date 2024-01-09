const players = [
    {id: 1, name: 'John', role: "", votes: 0, eliminated: false},
    {id: 2, name: 'Jane', role: "", votes: 0, eliminated: false},
    {id: 3, name: 'Jill', role: "", votes: 0, eliminated: false},
    {id: 4, name: 'Evan', role: "", votes: 0, eliminated: false},
    {id: 5, name: 'Ian', role: "", votes: 0, eliminated: false},
    {id: 6, name: 'Sam', role: "", votes: 0, eliminated: false},
    {id: 7, name: 'Carolina', role: "", votes: 0, eliminated: false},
    {id: 8, name: 'Grace', role: "", votes: 0, eliminated: false},
    {id: 9, name: 'Hannah', role: "", votes: 0, eliminated: false},
    {id: 10, name: 'Kevin', role: "", votes: 0, eliminated: false},
    {id: 11, name: 'Tamara', role: "", votes: 0, eliminated: false},
    {id: 12, name: 'Sheila', role: "", votes: 0, eliminated: false},
    {id: 13, name: 'Timmothy', role: "", votes: 0, eliminated: false},
    {id: 14, name: 'Peter', role: "", votes: 0, eliminated: false},
    {id: 15, name: 'Eva', role: "", votes: 0, eliminated: false},
    {id: 16, name: 'Otto', role: "", votes: 0, eliminated: false} 
];

const sheriffNoList = Array(16).fill(false);
const playerList = document.getElementById('player-list');
const selectedPlayer = document.getElementById('selected-player');
const prompt = document.getElementById('prompt');
const next = document.getElementById('next');
const footer = document.getElementById('footer');
var round = 0;
var numPlayers = 16;
var numMafia = 5;
var numSheriff = 1;
var numDoctor = 2;
var numCitizens = 11;
var mafiaTargetDivCreated = false;
var sheriffTargetDivCreated = false;
var mafiaTarget = -1;
var sheriffTarget = -1;
var doctorTarget = -1;
var myPlayer;

async function clickHandler(funk) {
    const clickPromise = new Promise(resolve => {
        function handleClick(player) {
            funk(player);
            players.forEach(player => {
                if (!player.eliminated) {
                    const clickable = document.getElementById(player.name);
                    clickable.removeEventListener('click', clickListener);
                }
            });
            resolve();
        }

        function clickListener(event) {
            const playerName = event.currentTarget.id;
            const clickedPlayer = players.find(player => player.name === playerName);

            if (clickedPlayer) {
                handleClick(clickedPlayer);
            }
        }

        players.forEach(player => {
            if (!player.eliminated) {
                const clickable = document.getElementById(player.name);
                clickable.addEventListener('click', clickListener);
            }
        });
    });

    await clickPromise;
}

function targetPlayer(player) {
    if (myPlayer.role === 'Mafia') {
        mafiaTarget = player.id - 1;
    }
    else if (myPlayer.role === 'Sheriff') {
        sheriffTarget = player.id - 1;
    }
    else {
        doctorTarget = player.id - 1;
    }
}

function voteOut(player) {
    player.vote++;
}

function showSelectedPlayer(player) {
    myPlayer = player;
    prompt.textContent = "This is your player";
    footer.style.display = 'none';
    playerList.style.display = 'none';
    const img = document.createElement('img');
    img.src = `${player.name}.jpg`;
    img.alt = player.name;
    img.height = 200;
    selectedPlayer.appendChild(img);

    const name = document.createElement('h2');
    name.textContent = player.name;
    selectedPlayer.appendChild(name);

    const role = document.createElement('h2');
    role.textContent = player.role;
    selectedPlayer.appendChild(role);

    if (player.role === 'Mafia') {
        const others = document.createElement('h3');
        others.textContent = "Other Mafia: ";
        selectedPlayer.appendChild(others);
        players.forEach(another => {
            if (another.role === 'Mafia' && another !== player) {
                const _another = document.createElement('p');
                _another.style.margin = 0;
                _another.textContent = another.name;
                selectedPlayer.appendChild(_another); // Append _another to selectedPlayer
            }
        });
    }
    else if (player.role === 'Doctor') {
        const others = document.createElement('h3');
        others.textContent = "Other Doctor: ";
        selectedPlayer.appendChild(others);
        players.forEach(another => {
            if (another.role === 'Doctor' && another !== player) {
                const _another = document.createElement('p');
                _another.style.margin = 0;
                _another.textContent = another.name;
                selectedPlayer.appendChild(_another); // Append _another to selectedPlayer
            }
        });
    }
    next.style.display = 'block';
    next.textContent = "Click here to begin";
    next.addEventListener('mouseenter', function() {
        next.style.backgroundColor = 'green'; 
    });

    next.addEventListener('mouseleave', function() {
        next.style.backgroundColor = 'darkolivegreen'; 
    });
    next.addEventListener('click', () => Round());
}


async function Round() {
    ++round;
    if (numMafia >= numCitizens) {
        prompt.textContent = "Game over. Mafia have won!";
        return;
    }
    else if (numMafia === 0) {
        prompt.textContent = "Game over. Citizens have won!";
        return;
    }
    next.style.display = 'none';
    playerList.style.display = 'none';
    selectedPlayer.style.display = 'none';
    prompt.textContent = "Round " + round;
    await sleep(1500);
    if (!myPlayer.eliminated && myPlayer.role === 'Mafia') {
        prompt.textContent = "You are a Mafia. Choose a player to eliminate.";
        playerList.style.display = 'grid';
        await clickHandler(targetPlayer);
        playerList.style.display = 'none';
    }
    else {
        if (numMafia > 0) {
            prompt.textContent = "Mafia is choosing...";
            mafiaTarget = Math.floor(Math.random() * 16);
            while (players[mafiaTarget].eliminated || players[mafiaTarget].role === 'Mafia') {
                mafiaTarget = cycle(mafiaTarget);
            }
            await sleep(3000);
        }
    }
    if (!myPlayer.eliminated && myPlayer.role === 'Sheriff') {
        prompt.textContent = "You are a Sheriff. Choose a player to accuse as Mafia.";
        playerList.style.display = 'grid';
        await clickHandler(targetPlayer);
        playerList.style.display = 'none';
    }
    else {
        if (numSheriff > 0) {
            prompt.textContent = "Sheriff is choosing...";
            sheriffTarget = Math.floor(Math.random() * 16);
            while (players[sheriffTarget].eliminated || sheriffNoList[sheriffTarget] || players[sheriffTarget].role === 'Sheriff') {
                sheriffTarget = cycle(sheriffTarget);
            }
            await sleep(3000);
        }
    }
    if (!myPlayer.eliminated && myPlayer.role === 'Doctor') {
        prompt.textContent = "You are a Doctor. Choose a player to save.";
        playerList.style.display = 'grid';
        await clickHandler(targetPlayer);
        playerList.style.display = 'none';
    }
    else {
        if (numDoctor > 0) {
            prompt.textContent = "Doctor is choosing...";
            doctorTarget = Math.floor(Math.random() * 16);
            while (players[doctorTarget].eliminated) {
                doctorTarget = cycle(doctorTarget);
            }
            await sleep(3000);
        }
    }
    Results();
}

async function Results() {
    if (numMafia >= numCitizens) {
        prompt.textContent = "Game over. Mafia have won!";
        return;
    }
    else if (numMafia === 0) {
        prompt.textContent = "Game over. Citizens have won!";
        return;
    }
    const mafiaTargetDiv = document.getElementById('mafia-target');
    const sheriffTargetDiv = document.getElementById('sheriff-target');
    prompt.textContent = "And the results are in";
    await sleep(2000);
    renderMafiaTarget(players[mafiaTarget]);
    if (numMafia > 0 && numDoctor >= 0 && mafiaTarget === doctorTarget) {
        prompt.textContent = "The Mafia have targeted " + players[mafiaTarget].name + ", but the doctors have saved them!";
    }
    else {
        if (numMafia > 0) {
            prompt.textContent = "The Mafia have eliminated " + players[mafiaTarget].name + "!";
            updatePlayers(players[mafiaTarget]);
        }
    }
    if (numSheriff > 0 && sheriffTarget >= 0 && players[mafiaTarget].role !== 'Sheriff') {
        if (players[sheriffTarget].role === 'Mafia') {
            await sleep(3000);
            renderSheriffTarget(players[sheriffTarget]);
            prompt.textContent = "The Sherrif has sent " + players[sheriffTarget].name + " to jail!";
            updatePlayers(players[sheriffTarget]);
        }
        else {
            if (myPlayer.role !== 'Sheriff') {
                sheriffNoList[sheriffTarget] = true;
            }
        }
    }
    await sleep(6000);
    mafiaTargetDiv.style.display = 'none';
    sheriffTargetDiv.style.display = 'none';
    votePlayerOut();
}

async function votePlayerOut() {
    const removables = [];
    playerList.style.display = 'grid';
    const voteEligible = myPlayer.eliminated ? numPlayers : numPlayers - 1;
    var maxVote = 0;
    for (var i = 0; i < voteEligible; i++) {
        var rand = Math.floor(Math.random() * 16);
        while (players[rand].eliminated) {
            rand = cycle(rand);
        }
        players[rand].votes++;
    }
    if (!myPlayer.eliminated) {
        prompt.textContent = "Select a player to vote out";
        await clickHandler(voteOut);
    }
    for (var i = 0; i < 16; i++) {
        if (players[i].votes > maxVote) {
            maxVote = players[i].votes;
        }
    }
    for (var i = 0; i < 16; i++) {
        if (players[i].votes === maxVote) {
            removables.push(players[i]);
        }
    }
    const idToRemove = Math.floor(Math.random() * removables.length);
    const playerToRemove = removables[idToRemove];
    prompt.textContent = "Tallying votes...";
    await sleep(3000);
    const playerListDiv = document.getElementById(playerToRemove.name);
    prompt.textContent = playerToRemove.name + " has been voted out. If the page turns red. You voted out a Mafia. If the page turns blue, you voted out a citizen.";
    await sleep(4000);
    prompt.textContent = "Three";
    await sleep(1000);
    prompt.textContent = "Two";
    await sleep(1000);
    prompt.textContent = "One";
    await sleep(1000);
    changeBackground(playerToRemove);
    await sleep(5000);
    updatePlayers(playerToRemove);
    for (var i = 0; i < 16; i++) {
        players[i].votes = 0;
    }
    next.style.display = 'block';
    next.textContent = "Next round";
}

function renderPlayers() {
    next.style.display = 'none';
    players.forEach(player => {
        if (!player.eliminated) {
            const div = document.createElement('div');
            div.id = player.name;
            div.class = 'player';
            div.style.backgroundColor = 'darkgray';
            div.style.padding = 12;
            div.style.borderRadius = '12px';
            div.style.transition = 'background-color 0.3s ease'; 

            div.addEventListener('mouseenter', function() {
                div.style.backgroundColor = 'lightgray'; 
            });

            div.addEventListener('mouseleave', function() {
                div.style.backgroundColor = 'darkgray'; 
            });
            const imgContainer = document.createElement('div');
            imgContainer.style.width = 90
            imgContainer.style.margin = 'auto';
            

            const img = document.createElement('img');
            img.src = `./${player.name}.jpg`;
            img.alt = player.name;
            img.height = 120;
            img.style.borderRadius = '10px';

            const h2 = document.createElement('h2');
            h2.style.textAlign = 'center';
            h2.textContent = player.name;

            imgContainer.appendChild(img);
            imgContainer.appendChild(h2);
            div.appendChild(imgContainer);

            playerList.appendChild(div);
        }
    });
    assignRoles();
}

function updatePlayers(player) {
    player.eliminated = true;
    const playerDiv = document.getElementById(player.name);
    playerList.removeChild(playerDiv);
    if (player === myPlayer) {
        myPlayer.eliminated = true;
    }
    if (player.role === 'Mafia') {
        numMafia--;
    }
    else {
        if (player.role === 'Sheriff') {
            numSheriff--;
        }
        else if (player.role === 'Doctor') {
            numDoctor--;
        }
        numCitizens--;
    }
    numPlayers--;
}

function assignRoles() {
    for (var i = 0; i < 5; i++) {
        var rand = Math.floor(Math.random() * 16);
        while (players[rand].role !== "") {
            rand = cycle(rand);
        }
        players[rand].role = "Mafia";
    }
    var rand = Math.floor(Math.random() * 16);
    while (players[rand].role !== "") {
        rand = cycle(rand);
    }
    players[rand].role = "Sheriff";
    for (var i = 0; i < 2; i++) {
        var rand = Math.floor(Math.random() * 16);
        while (players[rand].role !== "") {
            rand = cycle(rand);
        }
        players[rand].role = "Doctor";
    }
    for (var i = 0; i < 16; i++) {
        if (players[i].role === "") {
            players[i].role = "Civilian";
        }
    }
}

function renderMafiaTarget(targetPlayer) {
    const mafiaTargetScreen = document.getElementById("mafia-target");
    mafiaTargetScreen.style.display = 'block';
    if (!mafiaTargetDivCreated) {
        const eliminatedPlayer = document.createElement('img');
        eliminatedPlayer.src = `${targetPlayer.name}.jpg`
        eliminatedPlayer.alt = targetPlayer.name;
        eliminatedPlayer.id = 'eliminatedByMafia';
        mafiaTargetScreen.appendChild(eliminatedPlayer);
        mafiaTargetDivCreated = true;
    }
    else {
        const eliminatedPlayer = document.getElementById('eliminatedByMafia');
        eliminatedPlayer.src = `${targetPlayer.name}.jpg`
        eliminatedPlayer.alt = targetPlayer.name;
    }
}

function renderSheriffTarget(targetPlayer) {
    const sheriffTargetScreen = document.getElementById("sheriff-target");
    sheriffTargetScreen.style.display = 'block';
    if (!sheriffTargetDivCreated) {
        const eliminatedPlayer = document.createElement('img');
        eliminatedPlayer.src = `${targetPlayer.name}.jpg`
        eliminatedPlayer.alt = targetPlayer.name;
        eliminatedPlayer.id = 'eliminatedBySheriff';
        sheriffTargetScreen.appendChild(eliminatedPlayer);
        sheriffTargetDivCreated = true;
    }
    else {
        const eliminatedPlayer = document.getElementById('eliminatedBySheriff');
        eliminatedPlayer.src = `${targetPlayer.name}.jpg`
        eliminatedPlayer.alt = targetPlayer.name;
    }
}

function changeBackground(player) {
    const playerBackground = document.getElementById(player.name);
    setTimeout(() => {
        playerBackground.style.backgroundColor = player.role === 'Mafia' ? 'red' : 'blue';
        playerBackground.style.color = 'white';
    }, 2000);
}

function cycle(target) {
    if (target === 15) return 0;
    else return target + 1;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    renderPlayers();
    await clickHandler(showSelectedPlayer);
}

main();