// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyD3dde0DNVn0l5p5HNOvQHSD82LRdG4TaA",
  authDomain: "pwa-mj.firebaseapp.com",
  databaseURL: "https://pwa-mj.firebaseio.com",
  projectId: "pwa-mj",
  storageBucket: "pwa-mj.appspot.com",
  messagingSenderId: "78621739323",
  appId: "1:78621739323:web:8a725c342efb20f1534f1e",
  measurementId: "G-GCQGCHLXQL",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

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

this.onpush = function (event) {
  console.log(event.data);
  // From here we can write the data to IndexedDB, send it to any open
  // windows, display a notification, etc.
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      // .register('./sw.js', { scope: './' })// for testing loocal
      .register('/./sw.js', { scope: '/./' })

      .then(function (reg) {
        // registration worked
        console.log("Registration succeeded. Scope is " + reg.scope);
        // var serviceWorker;
        // if (reg.installing) {
        //   serviceWorker = reg.installing;
        //   // console.log('Service worker installing');
        // } else if (reg.waiting) {
        //   serviceWorker = reg.waiting;
        //   // console.log('Service worker installed & waiting');
        // } else if (reg.active) {
        //   serviceWorker = reg.active;
        //   // console.log('Service worker active');
        // }
        // if (serviceWorker) {
        //   console.log("sw current state", serviceWorker.state);
        //   if (serviceWorker.state == "activated") {
        //     //If push subscription wasnt done yet have to do here
        //     console.log("sw already activated - Do watever needed here");
        //   }
        //   serviceWorker.addEventListener("statechange", function (e) {
        //     console.log("sw statechange : ", e.target.state);
        //     if (e.target.state == "activated") {
        //       // use pushManger for subscribing here.
        //       console.log(
        //         "Just now activated. now we can subscribe for push notification"
        //       );
        //       subscribeForPushNotification(reg);
        //     }
        //   });
        // }
      })
      .catch(function (error) {
        // registration failed
        console.log("Registration failed with " + error);
      });
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
    document.body.classList.remove("offline");
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
    document.body.classList.add("offline");
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
  let month = "";
  let time = "";
  let day = "";
  let year = "";
  switch (res[2]) {
    case "2020":
      year = "二零二零";
      break;
    case "2021":
      year = "二零二一";

      break;
    case "2022":
      year = "二零二二";

      break;
    case "2023":
      year = "二零二三";

      break;
    case "2024":
      year = "二零二四";

      break;
    case "2025":
      year = "二零二五";

      break;

    default:
      year = res[2];
      break;
  }

  time += year + "<span  style='color: var(--red);'>年</span>";

  switch (res[1]) {
    case "Jan":
      month = "一";
      break;

    case "Feb":
      month = "二";
      break;

    case "Mar":
      month = "三";
      break;
    case "Apr":
      month = "四";
      break;
    case "May":
      month = "五";
      break;
    case "Jun":
      month = "六";
      break;
    case "Jul":
      month = "七";
      break;
    case "Aug":
      month = "八";
      break;
    case "Sep":
      month = "九";
      break;
    case "Oct":
      month = "十";
      break;
    case "Nov":
      month = "十一";
      break;
    case "Dec":
      month = "十二";
      break;

    default:
      break;
  }
  time += month + "<span  style='color: var(--red);'>月</span>";

  switch (res[0]) {
    case "1":
      day = "一";
      break;
    case "2":
      day = "二";
      break;
    case "3":
      day = "三";

      break;
    case "4":
      day = "四";

      break;
    case "5":
      day = "五";

      break;
    case "6":
      day = "六";
      break;
    case "7":
      day = "七";
      break;
    case "8":
      day = "八";
      break;
    case "9":
      day = "九";
      break;
    case "10":
      day = "十";
      break;
    case "11":
      day = "十一";
      break;
    case "12":
      day = "十二";
      break;
    case "13":
      day = "十三";
      break;
    case "14":
      day = "十四";
      break;
    case "15":
      day = "十五";
      break;
    case "16":
      day = "十六";
      break;
    case "17":
      day = "十七";
      break;
    case "18":
      day = "十八";
      break;
    case "19":
      day = "十九";
      break;
    case "20":
      day = "二十";

      break;
    case "21":
      day = "二十一";
      break;
    case "22":
      day = "二十二";
      break;
    case "23":
      day = "二十三";
      break;
    case "24":
      day = "二十四";
      break;
    case "25":
      day = "二十五";
      break;
    case "26":
      day = "二十六";

      break;
    case "27":
      day = "二十七";

      break;
    case "28":
      day = "二十八";

      break;
    case "29":
      day = "二十九";

      break;
    case "30":
      day = "三十";

      break;
    case "31":
      day = "三十一";

      break;

    default:
      break;
  }
  time += day + "<span  style='color: var(--red);'>日</span>" + " ";
  time += res[3].slice(0, 5);

  return time;
}

// render recipe data
const renderRecipe = (data, id) => {
  // console.log(data);
  let time = timeConverTochinese(data.CreateTime);
  const html = `
    <div class="card-panel recipe row" data-id="${id}">
      <img src="img/common/${data.icon}.svg" alt="搵唔到" data-id="${id}">
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
    // console.log("We can use localStorage");

    let random = Math.floor(Math.random() * 3);
    let hi = [
      "你好",
      "Yo",
      "Welcome back",
      "nice to see u",
      "^^",
      "Hello",
      "Hey!",
      "大定一齊黎打麻雀啦!"
    ];
    showNotification(hi[random]);

    if (!localStorage.getItem("mjsession")) {
      //dont have

      // showNotification("welcome");
      var a = [];
      a = JSON.parse(localStorage.getItem("mjsession")) || [];
      localStorage.setItem("mjsession", JSON.stringify(a));
    } else {
      //have

      var retrievedData = localStorage.getItem("mjsession");
      // console.log(retrievedData);
      var retrievedDataArray = JSON.parse(retrievedData);
      // console.log(retrievedDataArray);

      for (let index = retrievedDataArray.length - 1; index >= 0; index--) {
        firebase
          .firestore()
          .collection("recipes")
          .doc(retrievedDataArray[index])
          .get()
          .then(function (doc) {
            if (doc.exists) {
              renderRecipe(doc.data(), doc.id);
            } else {
              showNotification("資料出現錯誤");
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

const shareButton = document.querySelector(".share-button");
const shareDialog = document.querySelector(".share-dialog");
const closeButton = document.querySelector(".close-button");

const shareId = () => {
  var url_string = window.location;
  var url = new URL(url_string);
  var tvid = url.searchParams.get("id");

  if (tvid == null) {
    tvid = "";
  }

  let href = "https://pwa-mj.web.app/";

  url = href + "pages/mj.html?id=" + tvid;

  return url;
};

shareButton.addEventListener("click", (event) => {
  const title = "麻雀實時記錄器 - MJ";
  const url = shareId();

  if (navigator.share) {
    navigator
      .share({
        title: `${title}`,
        url: `${url}`,
      })
      .then(() => {
        // console.log("Thanks for sharing!");
        showNotification("Thanks for sharing!");
      })
      .catch((err) => console.log(err));
  } else {
    shareDialog.classList.add("is-open");
  }
});

const shareButtonTarget = document.querySelectorAll(".targets .button");

shareButtonTarget.forEach((element) => {
  switch (element.title) {
    case "Whatsapp":
      element.href = "https://wa.me/?text=" + shareId();
      break;

    case "Telegram":
      element.href =
        "https://telegram.me/share/url?url=" + shareId() + "&text=<HI TEXT>";

      break;
    case "Email":
      element.href = "mailto:?subject=黎打牌啦 &body=" + shareId();

      break;

    default:
      break;
  }

  element.addEventListener("click", (e) => {
    showNotification("share by " + element.title);
    console.log(element.title);
  });
});

document.getElementById("btn-invite").addEventListener("click", (e) => {
  let share = shareId();
  copyToClipboard(share);
  document.getElementById("myTooltip").innerHTML = "Copied ";
  setTimeout(() => {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
  }, 1500);
});

closeButton.addEventListener("click", (event) => {
  shareDialog.classList.remove("is-open");
});

document.querySelector(".pen-url").innerHTML = shareId();

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
    let url = document.getElementById("modal-join-url").value;
    // console.log(url);
    if (url.indexOf("pwa-mj.web.app/pages/mj.html?id=") > -1) {
      window.location.href = url;
    }
  }
});

//evt.request.url.indexOf(".html"

const recipes = document.querySelector(".recipes");

document.addEventListener("DOMContentLoaded", function () {
  // nav menu
  const menus = document.querySelectorAll(".side-menu");
  M.Sidenav.init(menus, { edge: "right" });
  // add recipe form
  const forms = document.querySelectorAll(".side-form");
  M.Sidenav.init(forms, { edge: "left" });
});

// A2HS on desktop

var promptEvent;

// Capture event and defer
window.addEventListener("beforeinstallprompt", function (e) {
  e.preventDefault();
  promptEvent = e;
  listenToUserAction();
});

// listen to install button click
function listenToUserAction() {
  const installBtn = document.querySelector(".add-button");
  installBtn.addEventListener("click", presentAddToHome);
}

window.addEventListener('appinstalled', (evt) => {
  console.log('a2hs installed');
  const installBtn = document.querySelector(".add-button");
  installBtn.classList.add("hidden");
});

// present install prompt to user
function presentAddToHome() {
  promptEvent.prompt(); // Wait for the user to respond to the prompt
  promptEvent.userChoice.then((choice) => {
    if (choice.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
  });
}

