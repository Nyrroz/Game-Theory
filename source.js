
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



function dentPourDent(sim, me) {
    let opponent; 
    if (me == 0) opponent = 1; 
    else opponent = 0;


    //first round 
    if (sim == []) return 1;

    //rest of the game
    if (sim[sim.length-1][opponent] == 0) return 0;
    else return 1; 
}

function iAmRandomAF(sim, me) {
    let gen = Math.random()*100; 
    if (gen < 50) return 0;
    else return 1; 
}

function logicGuy(sim, me) {
    let opponent; 
    if (me == 0) opponent = 1; 
    else opponent = 0;

    //Strategy: 
    // check the past and if you have betrayed me more than 50% overall will play 0
    // addition: for after: gives a chance and plays 1 anyway every 10 moves short memory
    // conclusion new strategy: only checks the last nbacktrack number of moves to see
    //first round 

    let tolerance = 0.5;
    let nBackTrack = 10; 
    if (sim == []) return 1;//goodwill hehe
    

    //counting
    if (sim.length < nBackTrack) {
        //evaluating opponent's plays
        let sum = 0; 
        sim.forEach(play => {
            sum += play[opponent];
        })

        //Judging if he has betrayed me more than 50% of the time
        if (sum/sim.length < tolerance) return 0; 
        else return 1; 
    }
    else {
        //evaluating opponent's last nBackTrack plays
        let sum = 0; 
        let counter = 0; 
        for (let i = sim.length - nBackTrack; i < sim.length-1; i++) {
            sum += sim[i][opponent];
            counter++;
        } 
        //Judging if he has betrayed me more than tolerance% of the time
        if (sum/counter < tolerance) return 0; 
        else return 1; 
    }

    // //rest of the game
    // if (sim[sim.length-1][opponent] == 0) return 0;
    // else return 1; 
}


function crushTheWeak(sim, me) {
    let opponent; 
    if (me == 0) opponent = 1; 
    else opponent = 0;

    //past vision
    let nBackTrack = 5; 
    let margin = 2; 

    

    //first round 
    if (sim.length < 2) return 0; //return 0 to test and get a feel of the opponent

    //counting
    if (sim.length < nBackTrack) {
        //evaluating opponent's plays
        let sumOpponent = 0; 
        let sumMe = 0; 
        sim.forEach(play => {
            sumOpponent += play[opponent];
            sumMe += play[me];
        })
        //Judging if he has betrayed me more than I betrayed him in the last matches

        if (sumOpponent + margin < sumMe || sumMe >= nBackTrack + margin) return 0; 
        else return 1; 
    }
    else {
        //evaluating opponent's last nBackTrack plays
        let sumOpponent = 0; 
        let sumMe = 0; 

        for (let i = sim.length - nBackTrack; i < sim.length-1; i++) {
            sumOpponent += sim[i][opponent];
            sumMe += sim[i][me];
        } 

        
        //Judging if he has betrayed me more than tolerance% of the time
        if (sumOpponent + margin < sumMe || sumMe >= nBackTrack + margin) return 0; 
        else return 1; 
    }

}



class SIMULATION {
    constructor(rounds = -1, minRounds = 3,maxRounds = 200) {
        if (rounds <= 0) this.rounds = Math.random() * maxRounds + minRounds;
        else this.rounds = rounds;
        this.simulation = [[]];
        this.scorePlayer1 = 0; //player score for each round
        this.scorePlayer2 = 0; 
        this.winsPlayer1 = 0;
        this.winsPlayer2 = 0;
        this.draws = 0;
    }
    play(player1, player2) { //each player submits a play either 0 or 1
        this.simulation.push([player1, player2]);
        if (player1 == player2) {
            this.draws++;
            this.scorePlayer1 += 1;
            this.scorePlayer2 += 1;
        }
        else if (player1 > player2) {
            this.winsPlayer2++;
            this.scorePlayer2 += 2;
        }
        else { 
            this.winsPlayer1++;
            this.scorePlayer1 += 2;
        }
    }

    getSimulation() {
        return [this.simulation]; //, this.scorePlayer1, this.scorePlayer2
        //Return scores
        // if (this.scorePlayer1 == this.scorePlayer2) return 0;  
        // else if (this.scorePlayer1 > this.scorePlayer2) return 1;
        // else return 2; 
    }

}






let s = new SIMULATION();
let rounds = 10000; 

for (let i = 0; i < rounds; i++) {
    // s.play(iAmRandomAF(s.simulation, 0), dentPourDent(s.simulation), 1);
    // s.play(iAmRandomAF(s.simulation, 0), logicGuy(s.simulation), 1);
    // s.play(iAmRandomAF(s.simulation, 0), crushTheWeak(s.simulation), 1);
    // s.play(dentPourDent(s.simulation, 0), logicGuy(s.simulation), 1);
    s.play(dentPourDent(s.simulation, 0), crushTheWeak(s.simulation), 1);

    

    
}

console.log(s.simulation);
console.log("SCORE");
console.log("PLAYER 1: " + s.scorePlayer1);
console.log("PLAYER 2: " + s.scorePlayer2);
console.log("WINRATES");
console.log("PLAYER 1: " + s.winsPlayer1/rounds * 100 + "%");
console.log("PLAYER 2: " + s.winsPlayer2/rounds * 100 + "%");
console.log("DRAWS: " + s.draws/rounds * 100 + "%");















