import './style.css'
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set,child,get } from "firebase/database";
import Monkey from './monkey.png';


const firebaseConfig = {
  apiKey: "AIzaSyBaI3dfyE9jUlImxd6Z8QIni997_IaZot4",
  authDomain: "apes-8b8cc.firebaseapp.com",
  projectId: "apes-8b8cc",
  storageBucket: "apes-8b8cc.appspot.com",
  messagingSenderId: "586312153253",
  databaseURL:"https://apes-8b8cc-default-rtdb.firebaseio.com/",
  appId: "1:586312153253:web:e48c8851c7f74b682eb54c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const monkey=new Image();
monkey.src=Monkey;
monkey.classList.add("monkey");
document.getElementById("addBook").appendChild(monkey);
let myLibrary=[];

function Book(title,champion,kda1,kda2,kda3,comments,youtube){
    this.title=title;
    this.champion=champion;
    this.kda1=kda1;
    this.kda2=kda2;
    this.kda3=kda3;
    this.comments=comments;
    this.youtube=youtube;
    this.info=function(){
        return title+" by "+author+", "+pages+" pages, "+(read ?"read":"not read yet");
    }
}
Book.prototype.toggle=function(){
    if(this.read==true){
        this.read=false;
    }
    else if(this.read==false){
        this.read=true;
    }
}


const JSONToBook = (book) => {
    return new Book(book.title, book.champion,book.kda1,book.kda2,book.kda3,book.comments,book.youtube);
  }

  

const saveLocal = () => {
    const db = getDatabase(app);
    set(ref(db, 'library'), JSON.stringify(myLibrary));
    // localStorage.setItem('library', JSON.stringify(myLibrary));
}

const restoreLocal = (app) => {
    const db = ref(getDatabase());
get(child(db, 'library')).then((snapshot) => {
  if (snapshot.exists()) {
    const books=JSON.parse(snapshot.val());
    console.log(books);
    myLibrary = books.map((book) => JSONToBook(book))
    console.log(myLibrary);
    updateContainer();
  } else {
    myLibrary = []
  }
}).catch((error) => {
  console.error(error);
});

    // const books = JSON.parse(localStorage.getItem('library'))
    // if (books) {
    //   myLibrary = books.map((book) => JSONToBook(book))
    // } else {
    //   myLibrary = []
    // }\
    
  }

function addBookToLibrary(Book){
    myLibrary.push(Book);
    saveLocal();
}


window.onload=function(){
    restoreLocal();
updateContainer();
}

//updateTable();


function switchtoRead(){
    document.querySelector(".notReadButton").hidden=true;
    document.querySelector(".readButton").hidden=false;
}
function switchtoNotRead(){
    document.querySelector(".notReadButton").hidden=false;
    document.querySelector(".readButton").hidden=true;
}

function updateContainer(){
    var container=document.querySelector(".container");
    container.innerHTML="";
    for(let i=0;i<myLibrary.length;i++){
        let card=document.createElement("div");
        card.setAttribute("data",i);
        card.classList.add("card");
        var title=document.createElement("p");
        var champion=document.createElement("p");
        var kda=document.createElement("p");
        var comments=document.createElement("p");
        title.textContent="Player: "+myLibrary[i].title;
        champion.textContent="playing:" +myLibrary[i].champion;
        kda.textContent=myLibrary[i].kda1+"/"+myLibrary[i].kda2+"/"+myLibrary[i].kda3
        comments.textContent=myLibrary[i].comments;
        card.appendChild(title);
        card.appendChild(champion);
        card.appendChild(kda);
        card.appendChild(comments);

        let youtubeDiv=document.createElement("div");

        youtubeDiv.innerHTML=myLibrary[i].youtube;

        card.appendChild(youtubeDiv);
        // var ReadButton=document.createElement("button");
        // ReadButton.classList.add("readButton");
        // ReadButton.id="readButton"+(i+1);

        // ReadButton.addEventListener("click",function(){
        //     myLibrary[i].toggle();
        //     saveLocal();
        //     updateContainer();
        // })

        // if(myLibrary[i].read==true){
        //     ReadButton.textContent="Read";
        //     ReadButton.classList.add("button-green");
        //     card.classList.add("card-green");
        // }else{
        //     ReadButton.textContent="Not Read";
        //     ReadButton.classList.add("button-red");
        //     card.classList.add("card-red");
        // }
        var removeButton=document.createElement("button");
        removeButton.classList.add("removeButton");
        removeButton.setAttribute("data",i);
        removeButton.innerHTML="<i class='fas fa-times-circle fa-3x'></i>";

        removeButton.addEventListener("click",function(e){
            let input=prompt("Are you sure? Type y");
            if(input==="y"){
                let index=this.getAttribute("data");
                myLibrary.splice(index,1);
                saveLocal();
                updateContainer();
            }
            else{
                return;
            }
            
        })
        
        var br=document.createElement("br");

        // card.appendChild(ReadButton);
        card.appendChild(br);
        card.appendChild(removeButton);

        container.appendChild(card);

        

    }
}

let form=document.querySelector("#bookForm");


var modal = document.getElementById("myModal");

var btn = document.getElementById("addBook");

var span = document.getElementsByClassName("close")[0];

function addBook(){
    
    var title=document.getElementById("title").value;
    var champion=document.getElementById("champion").value;
    var kda1=document.getElementById("kda1").value;
    var kda2=document.getElementById("kda2").value;
    var kda3=document.getElementById("kda3").value;
    var comments=document.getElementById("comments").value;
    var youtube=document.getElementById("youtube").value;
    // if(title==""){
    //     alert("Please enter title!");
    //     return;
    // }
    // if(author==""){
    //     alert("Please enter author");
    //     return;
    // }
    // if(pages==""){
    //     alert("Please choose number of pages");
    //     return;
    // }
    modal.style.display = "none";
    var book= new Book(title,champion,kda1,kda2,kda3,comments,youtube);
    addBookToLibrary(book);
    //updateTable();
    updateContainer();
    form.reset();
}
form.onsubmit=addBook;

form.addEventListener("submit", event=>{
    event.preventDefault();
    //form.submit();
    
})


var modal = document.getElementById("myModal");

var btn = document.getElementById("addBook");

var span = document.getElementsByClassName("close")[0];


function playAudio(url){
  new Audio(url).play();
}
btn.onclick = function() {
  modal.style.display = "block";
  playAudio("monkeysounds.mp4");
}

span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}