import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref as dbref, onChildAdded } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getStorage, getDownloadURL ,ref as stref} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyCHVoOZ9xx2fL66ZWIdyVk7P6uqK_eRRoU",
    storageBucket: "traffic-violation-notifier.appspot.com",
    databaseURL: "https://traffic-violation-notifier-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const navbar = document.querySelector("#navbar");
const sticky = navbar.offsetTop;
window.onscroll = function () {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);
const dbRef = dbref(database, "data/");
const PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
const parent = document.querySelector("#warns");
const options = {
    weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
};
//commented out as firebase project is deleted
// onChildAdded(dbRef, (snapshot) => {
//     let val = snapshot;
//     gen(val);
//     console.log("added");
//     parent.style.display='block'
//     document.querySelector("#warns + .c1").style.display='none'
// });
parent.style.display = 'block'
document.querySelector("#warns + .c1").style.display='none'

function gen(a) {
    let el = document.createElement("div");
    let main = document.createElement("p");
    let d = document.createElement("p");
    const imgref = stref(storage,a.val()[1]);
    let l = document.querySelector(".c1").cloneNode(1);
    let img = addimg(imgref,l);
    img.style.display='none';
    let imgc=document.createElement("div");
    el.setAttribute("class", "m "+a.val()[2]);
    d.setAttribute("class", "d");
    imgc.setAttribute('class',"imgc");
    main.setAttribute("class","n");
    main.innerText = a.val()[0];
    d.innerText = decode(a.key);
    imgc.append(img,l);
    el.append(imgc,main,d);
    parent.prepend(el);
}
function decode(id) {
    id = id.substring(0, 8);
    var timestamp = 0;
    for (var i = 0; i < id.length; i++) {
        var c = id.charAt(i);
        timestamp = timestamp * 64 + PUSH_CHARS.indexOf(c);
    }
    return new Date(timestamp).toLocaleTimeString("en-gb", options);
}
function addimg(ref,l) {
    const img = document.createElement("img");
    getDownloadURL(ref).then((url) => {
            img.setAttribute("src", url);
            img.style.display="block";
            l.style.display="none";
        }).catch((error) => {
            switch (error.code) {
                case 'storage/object-not-found':
                    console.log("not found");
                    break;
            }
        });
    return img;
}