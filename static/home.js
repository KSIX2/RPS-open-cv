let canvas = document.querySelector("canvas");
let cw = canvas.width = window.innerWidth;
let ch = canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
let bg = new Image()
bg.src = "../static/rpsbg.jpg";
bg.onload = ()=>{
    ctx.drawImage(bg, 0, 0, cw, ch);
}

let playbox = document.querySelector("#playbox")
let cover = document.querySelector("#cover")
window.onload = ()=>{
    playbox.style.animation = "appear 1s"
    cover.style.animation = "backgroundanimation 1s"
}