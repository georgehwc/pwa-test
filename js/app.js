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


if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('service worker registered'))
    .catch(err => console.log('service worker not registered', err));
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
  var hour = b.getHours();
  var min = b.getMinutes();
  var sec = b.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}