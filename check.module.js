import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
  getDatabase,
  ref as RTdatabase,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import {
  getStorage,
  ref as refStorage,
  uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZ908A8pLK8IgexpXXS_cdk6odeozfdJ0",
  authDomain: "sqi-project1.firebaseapp.com",
  databaseURL: "https://sqi-project1-default-rtdb.firebaseio.com",
  projectId: "sqi-project1",
  storageBucket: "sqi-project1.appspot.com",
  messagingSenderId: "645864231431",
  appId: "1:645864231431:web:9b82b7cef2149dac21d0a2",
  measurementId: "G-9CRH2H144Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const storage = getStorage();
const TitleRTDatabase = RTdatabase(database, "Sqi-project1-music");

//when we clikc on upload the new music title should be added to the realtime database with an ID of the next number eg, 1,2,3,4,5,6
//gives an id represntation of number incresingly from 0 ,1,2,3...
let titleIndex = 0;
let TitleArray = [];
onValue(TitleRTDatabase, function (snapshot) {
  TitleArray = snapshot.val();
  showSongs();
  if (TitleArray) {
    titleIndex = TitleArray.length;
  } else {
    titleIndex = 0;
  }
});

//when the upload Music button is clicked

window.upload_music = () => {
  //get the values in and store it in a variable
  let musicTitle = document.getElementById("MusicName").value;
  let musicFile = document.getElementById("MusicFile").files[0];
  let musicPicture = document.getElementById("MusicPicFile").files[0];
  //send the titile and files to the firebase storage

  //create a reference to where to save the files to the storage
  let MusicLocation = refStorage(storage, "sqi-project1/" + musicTitle);
  let PicsLocation = refStorage(storage, "sqi-picture/" + musicTitle);

  //Upload the music File to the Loation and assign the action to a variable
  let upload = uploadBytesResumable(MusicLocation, musicFile);
  //upload the picture file to the variable asisgned for its location
  let uploadPic = uploadBytesResumable(PicsLocation, musicPicture);
  RTdatabase(database, "Sqi-project1-music/" + titleIndex);
  let musicPackage = {
    musicTitle: musicTitle,
    Shoe: 2,
    Musiclink: "MusicLink",
    musicPic: "musicPic",
  };

  let musicLink;
  let musicfile;
  async function addPicture(name) {
    let musicPic = await getDownloadURL(
      refStorage(storage, "sqi-picture/" + name)
    );
    return musicPic;
  }
  async function addMusic(name) {
    let musicLink = await getDownloadURL(
      refStorage(storage, "sqi-project1/" + name)
    );
    return musicLink;
  }

  //upload the picture
  uploadBytes(PicsLocation, musicPicture).then((snapshot) => {
    console.log("Uploaded the image");
    addPicture(musicTitle).then(function (item) {
      console.log(item + "answer121");
      musicLink = item;
      musicPackage.musicPic = item;
    });
  });

  uploadBytes(MusicLocation, musicFile).then((snapshot) => {
    console.log("Uploaded the Music");
    addMusic(musicTitle).then(function (item) {
      console.log(item);
      musicPackage.Musiclink = item;
      // RTdatabase(database, "Sqi-project1-music/" + titleIndex);
      set(
        RTdatabase(database, "Sqi-project1-music/" + titleIndex),
        musicPackage
      );
    });
  });

  // show what will happen while uploading to let the user know the upload is complete
  upload.on("state_changed", function (snapshot) {
    //get what is currently being tranffered/uploaded
    let tramsferred = snapshot.bytesTransferred;

    // get the total file
    let UploadedMusic = snapshot.totalBytes;

    // give it a number value increment of the upload to represent it in a porgress bar
    let progress = parseInt((tramsferred / UploadedMusic) * 100);

    console.log(
      "totalFile",
      UploadedMusic,
      "file uploading",
      tramsferred
    );

    document.querySelector("#progressBar").style.width = progress + "%";
    document.querySelector(".progress-text").innerHTML = progress + "%";

    if (progress == 100) {
      document.querySelector("#progressBar").classList.add("bg-success");
      document.querySelector(".progress-text").innerHTML =
        "Download Complete";
    }
  });
};
showSongs();

//disply the songs on the next page
function showSongs() {
  console.log(TitleArray);

  TitleArray.map((item) => {
    document.getElementById(
      "container"
    ).innerHTML += `     <div class="card col-3 m-1">
      <img src=${item.musicPic} alt="" class="img-fluid" style="height:200px;">    
      <p>${item.musicTitle}</p>
      <audio controls src=${item.Musiclink} class="w-100 py-2"></audio></div>
    </div>`;
  });

  //  TitleArray.map(async(item)=>{
  // refStorage(storage, "sqi-project1/" + item);
  // refStorage(storage , "sqi-picture/" + item )

  //   //donwnload url for the audio

  // //download url for the picture
  // // getDownloadURL(musicPictureRefFIle).then((musicPicture) => {

  // // let musicPcitureLink = musicPicture
  // // return musicPcitureLink;
  // // // document.getElementById("container").innerHTML += `<div class="col-4"><img src="${musicPicture}" class="img-fluid"> <h3></h3>  </div>` ;

  // // })
  // //   console.log(musicPcitureLink)

  // })
}
