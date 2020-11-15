// // Your web app's Firebase configuration
// var firebaseConfig = {
//   apiKey: "AIzaSyD3dde0DNVn0l5p5HNOvQHSD82LRdG4TaA",
//   authDomain: "pwa-mj.firebaseapp.com",
//   databaseURL: "https://pwa-mj.firebaseio.com",
//   projectId: "pwa-mj",
//   storageBucket: "pwa-mj.appspot.com",
//   messagingSenderId: "78621739323",
//   appId: "1:78621739323:web:8a725c342efb20f1534f1e",
//   measurementId: "G-GCQGCHLXQL"
// };
// // // Initialize Firebase
// // firebase.initializeApp(firebaseConfig);
// // firebase.analytics();

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/sw.js")
//     .then((reg) => console.log("service worker registered"))
//     .catch((err) => console.log("service worker not registered", err));
// }

// enable offline data
// const db = firebase.firestore();
firebase
  .firestore()
  .enablePersistence()
  .catch(function (err) {
    if (err.code == "failed-precondition") {
      // probably multiple tabs open at once
      console.log("persistance failed");
    } else if (err.code == "unimplemented") {
      // lack of browser support for the feature
      console.log("persistance not available");
    }
  });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").then(
      function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });

  window.addEventListener("online", handleConnection);
  window.addEventListener("offline", handleConnection);
}

// notification
const notification = document.querySelector(".notification");

const showNotification = (message) => {
  notification.textContent = message;
  notification.classList.add("active");
  setTimeout(() => {
    notification.classList.remove("active");
    notification.textContent = "";
  }, 5000);
};

function handleConnection() {
  console.log("handleConnection");
  if (navigator.onLine) {
    isReachable(getServerUrl()).then(function (online) {
      if (online) {
        // handle online status
        console.log("online");
      } else {
        console.log("no connectivity");
      }
    });
  } else {
    // handle offline status
    console.log("offline");
  }
}

function isReachable(url) {
  /**
   * Note: fetch() still "succeeds" for 404s on subdirectories,
   * which is ok when only testing for domain reachability.
   *
   * Example:
   *   https://google.com/noexist does not throw
   *   https://noexist.com/noexist does throw
   */
  return fetch(url, { method: "HEAD", mode: "no-cors" })
    .then(function (resp) {
      return resp && (resp.ok || resp.type === "opaque");
    })
    .catch(function (err) {
      console.warn("[conn test failure]:", err);
    });
}

function getServerUrl() {
  return window.location.origin;
}

// document.getElementById("serverUrl").value ||

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var b = new Date(UNIX_timestamp);

  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = b.getFullYear();
  var month = months[b.getMonth()];
  var date = b.getDate();
  var hour = addZero(b.getHours());
  var min = addZero(b.getMinutes());
  var sec = addZero(b.getSeconds());
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  // var time =
  // date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

// addEventListener(document, "touchstart", function(e) {
//   console.log(e.defaultPrevented);  // will be false
//   e.preventDefault();   // does nothing since the listener is passive
//   console.log(e.defaultPrevented);  // still false
// }, Modernizr.passiveeventlisteners ? {passive: true} : false);

function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function timeConverTochinese(params) {
  var str = params;
  var res = str.split(" ");
  console.log(res);
  let month = "";
  switch (res[1]) {
    case "Jan":
      month = "一月";
      break;
    case "Jan":
      month = "一月";
      break;

    case "Feb":
      month = "二月";
      break;

    case "Mar":
      month = "三月";
      break;
    case "Apr":
      month = "四月";
      break;
    case "May":
      month = "五月";
      break;
    case "Jun":
      month = "六月";
      break;
    case "Jul":
      month = "七月";
      break;
    case "Aug":
      month = "八月";
      break;
    case "Sep":
      month = "九月";
      break;
    case "Oct":
      month = "十月";
      break;
    case "Nov":
      month = "十一月";
      break;
    case "Dec":
      month = "十二月";
      break;

    default:
      break;
  }
  let time = month;
  time += res[0] + " " + res[2] + " ";
  time += res[3].slice(0,5);

  return time;
}

// render recipe data
const renderRecipe = (data, id) => {
  console.log(data);
  let time = timeConverTochinese(data.CreateTime);
  const html = `
    <div class="card-panel recipe row" data-id="${id}">
      <img src="/img/common/${data.icon}.svg" alt="搵唔到">
      <div class="recipe-details" data-id="${id}">
        <div class="recipe-title" data-id="${id}">${time}</div>
        <div class="recipe-ingredients" data-id="${id}">標題: ${data.name} 備註:${data.ingredients} </br>最大${data.MaxFarn}番</div> 
      </div>
      <div class="recipe-delete" data-id="${id}">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
    </div>
  `;
  recipes.innerHTML += html;
};

function getAll() {
  if (storageAvailable("localStorage")) {
    // Yippee! We can use localStorage awesomeness
    console.log("We can use localStorage");
    if (!localStorage.getItem("mjsession")) {
      //dont have

      showNotification("welcome");
      var a = [];
      a = JSON.parse(localStorage.getItem("mjsession")) || [];
      localStorage.setItem("mjsession", JSON.stringify(a));
    } else {
      //have

      var retrievedData = localStorage.getItem("mjsession");
      console.log(retrievedData);
      var retrievedDataArray = JSON.parse(retrievedData);
      console.log(retrievedDataArray);

      for (let index = retrievedDataArray.length - 1; index >= 0; index--) {
        console.log(index);
        console.log(retrievedDataArray[index]);
        firebase
          .firestore()
          .collection("recipes")
          .doc(retrievedDataArray[index])
          .get()
          .then(function (doc) {
            if (doc.exists) {
              renderRecipe(doc.data(), doc.id);
            } else {
              showNotification("something wrong with your data");
            }
          });
      }
    }
  } else {
    // Too bad, no localStorage for us
    showNotification("cant use local storage");
    console.log("cant use local storage");
  }
}

function SaveDataToLocalStorage(data) {
  var a = [];
  // Parse the serialized data back into an aray of objects
  a = JSON.parse(localStorage.getItem("mjsession")) || [];
  // Push the new data (whether it be an object or anything else) onto the array
  a.push(data);
  // Alert the array value
  // console.log(a); // Should be something like [Object array]
  // Re-serialize the array back into a string and store it in localStorage
  localStorage.setItem("mjsession", JSON.stringify(a));
}

// function allStorage() {
//   console.log("allStorage");
//   var archive = {}, // Notice change here
//     keys = Object.keys(localStorage),
//     i = keys.length;

//   while (i--) {
//     archive[keys[i]] = localStorage.getItem(keys[i]);
//   }
//   console.log(archive);
// }

const shareButton = document.querySelector(".share-button");
const shareDialog = document.querySelector(".share-dialog");
const closeButton = document.querySelector(".close-button");

shareButton.addEventListener("click", (event) => {
  if (navigator.share) {
    navigator
      .share({
        title: "WebShare API Demo",
        url: "https://codepen.io/ayoisaiah/pen/YbNazJ",
      })
      .then(() => {
        console.log("Thanks for sharing!");
      })
      .catch(console.error);
  } else {
    shareDialog.classList.add("is-open");
  }
});

closeButton.addEventListener("click", (event) => {
  shareDialog.classList.remove("is-open");
});

document.querySelector(".pen-url").innerHTML = window.location;

document.getElementById("menu-join").addEventListener("click", () => {
  document.querySelector(".modal-join").classList.add("open");
});

document.querySelector(".modal-join").addEventListener("click", (e) => {
  // console.log(e);
  if (e.target.classList.contains("modal-join")) {
    // document.getElementById("modal-join").classList.remove("open");
    document.querySelector(".modal-join").classList.remove("open");
  }
  if (e.target.id == "modal-join-submit") {
    console.log("1");
    let url = document.getElementById("modal-join-url").value;
    console.log(url);
    if (url.indexOf("/pages/mj.html?id=") > -1) {
      console.log("2");
      window.location.href = url;
    }
  }
});

//evt.request.url.indexOf(".html"
