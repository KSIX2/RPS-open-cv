let button = document.querySelector("#button")
let humanmovetimer = document.querySelector("#humanmovetimer")
let compmovetimer = document.querySelector("#compmovetimer")
let hpoints = document.querySelector("#hpoints")
let cpoints = document.querySelector("#cpoints")
let hscore = document.querySelector("#hscore")
let cscore = document.querySelector("#cscore")
let winner = document.querySelector("#winner")
let playagain = document.querySelector("#playagain")
let rps = ["rock", "paper", "scissor"]
let time = 4
let timeHandler
let humanscore = 0;
let compscore = 0;

function gamelogic(hm, cm) {
    if(humanscore<5 && compscore<5){
        if (hm === "rock" && cm === "paper"){
            compscore++
        } else if(hm === "rock" && cm === "scissor"){
            humanscore++
        } else if(hm === "paper" && cm === "scissor"){
            compscore++
        } else if(hm === "paper" && cm === "rock"){
            humanscore++
        } else if(hm === "scissor" && cm === "rock"){
            compscore++
        } else if(hm === "scissor" && cm === "paper"){
            humanscore++
        } 
        
        if(humanscore === 5 || compscore === 5){
            if(humanscore>compscore){
                winner.textContent = "Human wins!!!"
            } else {
                winner.textContent = "Computer wins!!"
            }
            hscore.innerHTML = `Human score = ${humanscore}`
            cscore.innerHTML = `Computer score = ${compscore}`
            cover.style.display = "flex"
        }

        if(humanscore>=0 || compscore>=0) {
            cpoints.style.fontSize = hpoints.style.fontSize = "16vh";
        }  

        hpoints.textContent = humanscore;
        cpoints.textContent = compscore;
    }
}

button.addEventListener("click", ()=>{
    clearInterval(timeHandler)
    let startTime = new Date().getSeconds()
    timeHandler = setInterval(() => {

        if(new Date().getSeconds() - startTime < 0){
            currentSecs = new Date().getSeconds() + 60 - startTime
        } else {
            currentSecs = new Date().getSeconds() - startTime
        }

        compmovetimer.textContent = humanmovetimer.textContent = time - currentSecs
        if(time - currentSecs === 0){
            clearInterval(timeHandler)
            fetch("/gamegestureAPI")
                .then(async result => {
                    try {
                        let data = await result.json()
                        console.log("data is", data)
                        humanmovetimer.textContent = data;
                        compmovetimer.textContent = rps[Math.floor(Math.random()*3)];
                        gamelogic(data, compmovetimer.textContent);
                    } catch(err) {
                        console.log("err here")
                        console.log(err)
                    }
                })
                .catch(err => console.log(err))
        }
    }, 1000)
})
