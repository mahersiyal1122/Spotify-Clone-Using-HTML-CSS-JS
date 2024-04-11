// console.log("Let's start JavaScript");

let songs;
let currentSong=new Audio();
let currentFolder;

//JavaScript function that converts seconds to the format "mm:ss"
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds)){
        return "00:00";
    }
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    let minutesString = String(minutes).padStart(2, '0');
    let secondsString = String(remainingSeconds).padStart(2, '0');

    return minutesString + ':' + secondsString;
}

async function getSongs(folder){
    currentFolder=folder;
    let a=await fetch(`assets/${folder}/`);
    let response= await a.text();
    // console.log(response);
    let div=document.createElement("div");
    div.innerHTML=response;
    let aTag=div.getElementsByTagName("a");
    songs=[];
    for (let i = 0; i < aTag.length; i++) {
        const element = aTag[i];
        if (element.href.endsWith(".mp3")){
            // songs.push(element.href);
            songs.push(element.href.split(`${folder}`)[1]);
        }
    }
     //Show All the songs in the Playlist
     let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
     songUL.innerHTML=""; 
     for (const song of songs) {
         // let songgg=song.replaceAll("%20"," ");
         songUL.innerHTML=songUL.innerHTML + `<li>
         <div class="musicImg"><img src="images/music.svg" alt=""><span>${song.replaceAll("%20"," ")}</span></div>
         <div class="playnow">
             <img id="playfromside" src="images/playsong.svg" alt="">
         </div>
     </li>`;
     }
     
 
     //Attact an Event Listener to each song
     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e)=>{
         e.addEventListener("click", ()=>{
             // console.log(e.querySelector(".musicImg").querySelector("span").innerHTML);
             playMusic(e.querySelector(".musicImg").querySelector("span").innerHTML);
         })
    })
    

    return songs;
    
}


const playMusic=(track, pause=false)=>{
    // let audio=new Audio("/songs/" + track);
    currentSong.src=`assets/${currentFolder}/` + track
    if (!pause){
        currentSong.play(); 
        play.src="images/pausesong.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbum(){
    let a=await fetch(`assets/songs/`);
    let response= await a.text();
    // console.log(response);
    let div=document.createElement("div");
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a");
    let cards=document.querySelector(".cards");
    let array=Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("assets/songs/")){
            // console.log(e)
            let folder=e.href.split("/").slice(-1)[0];
            //Getting the metadata of the Folder
            let a=await fetch(`assets/songs/${folder}/info.json`);
            // console.log(a);
            let response= await a.json();
            // console.log(response);
            cards.innerHTML=cards.innerHTML + `<div data-folder="${folder}" class="card">
            <div><svg class="play-button" width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#1ED760" /><polygon points="40,30 40,70 70,50" fill="black" /></svg>
            </div>
            <img src="assets/songs/${folder}/cover.png"
                alt="">
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>`;
        }
    }

    //Adding eventListener to card for getting playlists
    Array.from(document.getElementsByClassName("card")).forEach((e)=>{
        e.addEventListener("click", async item=>{
            // console.log(item, item.currentTarget.dataset);
            songs= await getSongs(`songs/${item.currentTarget.dataset.folder}/`);
            playMusic(songs[0]);
        })
    })

}


async function main() {
    //Get the songs
    await getSongs("songs/Punjabi/");

    playMusic(songs[0], true);  //Autamtically selected first song from songs
    // console.log(songs);

    //Display all the albumns on the page
    displayAlbum();

    //Attact an Event Listener to previous, play and next button
    const play=document.getElementById("play"); 
    play.addEventListener("click", ()=>{
        if (currentSong.paused){
            currentSong.play();
            play.src="images/pausesong.svg";
        }
        else{
            currentSong.pause();
            play.src="images/playsong.svg";
        }
    })

    const previous=document.getElementById("previous");
    previous.addEventListener("click",()=>{
        // console.log(currentSong.src.split("/").slice(-1)[0]);
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log("Previous Clicked ",index);
        if ((index-1) >= 0){
            playMusic(songs[index-1]);
        }
    })

    const next=document.getElementById("next");
    next.addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index+1) < songs.length){
            playMusic(songs[index+1]);
        }
    })

    

    // Listen for Timeupdate Event
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".seekbar_circle").style.left=(currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Adding an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent=(e.offsetX / e.target.getBoundingClientRect().width)* 100;
        document.querySelector(".seekbar_circle").style.left=percent + "%";
        currentSong.currentTime=((currentSong.duration) * percent) / 100;
    })


    //Adding an event listener to hamburger hehehe
    document.getElementById("hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left= "0%";
    })
    document.getElementById("xMark").addEventListener("click", ()=>{
        document.querySelector(".left").style.left= "-120%";
    })


    //Adding an event Listener to Volume
    document.querySelector(".volume-range").getElementsByTagName("input")[0].addEventListener("click", (e)=>{
        // console.log(e.target, e.target.value);
        currentSong.volume=parseInt(e.target.value)/100;
        
        let getVol=currentSong.volume;
        if (getVol == 0){
            document.getElementById("volume-icon").src="images/volume-mute.svg";
        }
        else if (getVol > 0 &&  getVol <= 0.15){
            document.getElementById("volume-icon").src="images/volume-low.svg";
        }
        else if (getVol > 0.15 &&  getVol < 0.6){
            document.getElementById("volume-icon").src="images/volume.svg";
        }
        else{
            document.getElementById("volume-icon").src="images/volume-high.svg";
        }
    })

    document.querySelector("#volume-icon").addEventListener("click", e=>{
        // console.log(e.target.src)
        if (e.target.src.includes("images/volume.svg") || e.target.src.includes("images/volume-low.svg") || e.target.src.includes("images/volume-high.svg")){
            document.getElementById("volume-icon").src="images/volume-mute.svg";
            currentSong.volume=0;
            document.querySelector(".volume-range").getElementsByTagName("input")[0].value='0';
        }
        else{
            document.getElementById("volume-icon").src="images/volume.svg";
            currentSong.volume=0.5;
            document.querySelector(".volume-range").getElementsByTagName("input")[0].value='50'; 
        }
    })

    
}


main();
