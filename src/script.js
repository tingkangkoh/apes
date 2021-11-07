import './style.css'
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set,child,get } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAp9eXbJgDypPL82ubN7T56BkIGgmVY4OY",
    authDomain: "lib2-4ba88.firebaseapp.com",
    databaseURL: "https://lib2-4ba88-default-rtdb.firebaseio.com/",
    projectId: "lib2-4ba88",
    storageBucket: "lib2-4ba88.appspot.com",
    messagingSenderId: "507341878276",
    appId: "1:507341878276:web:192ee03cf569667f2ef151",
    measurementId: "G-N8K6H0XW6C"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let myLibrary=[];

function Book(title,author,pages,read){
    this.title=title;
    this.author=author;
    this.pages=pages;
    this.read=read;
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
    return new Book(book.title, book.author, book.pages, book.read)
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
        var author=document.createElement("p");
        var pages=document.createElement("p");
        title.textContent="Book: "+myLibrary[i].title;
        author.textContent="by "+myLibrary[i].author;
        pages.textContent=myLibrary[i].pages+" pages";
        card.appendChild(title);
        card.appendChild(author);
        card.appendChild(pages);

        var ReadButton=document.createElement("button");
        ReadButton.classList.add("readButton");
        ReadButton.id="readButton"+(i+1);

        ReadButton.addEventListener("click",function(){
            myLibrary[i].toggle();
            saveLocal();
            updateContainer();
        })

        if(myLibrary[i].read==true){
            ReadButton.textContent="Read";
            ReadButton.classList.add("button-green");
            card.classList.add("card-green");
        }else{
            ReadButton.textContent="Not Read";
            ReadButton.classList.add("button-red");
            card.classList.add("card-red");
        }
        var removeButton=document.createElement("button");
        removeButton.classList.add("removeButton");
        removeButton.setAttribute("data",i);
        removeButton.innerHTML="<i class='fas fa-times-circle fa-3x'></i>";

        removeButton.addEventListener("click",function(e){
            let index=this.getAttribute("data");
            myLibrary.splice(index,1);
            saveLocal();
            updateContainer();
        })
        
        var br=document.createElement("br");

        card.appendChild(ReadButton);
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
    var author=document.getElementById("author").value;
    var pages=document.getElementById("pages").value;
    var read=document.getElementById("read").checked;
    if(title==""){
        alert("Please enter title!");
        return;
    }
    if(author==""){
        alert("Please enter author");
        return;
    }
    if(pages==""){
        alert("Please choose number of pages");
        return;
    }
    modal.style.display = "none";
    var book= new Book(title,author,pages,read);
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


btn.onclick = function() {
  modal.style.display = "block";
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