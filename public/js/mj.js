// open profile modal
const profileModal = document.querySelector(".Profile-page");
const moreDetail = document.querySelector(".moreDetail-page");

let defValue = Math.floor(1);
let arrayRecordData = [];
let arrayPrice = [0];
let intMinValue = 1;
let intMaxValue = 1;
let tvid = "";
let setting = false;
let jackpot = "";
let jackpotTotal = 0;
let chipTotal = 0;
var player1 = document.getElementById("player1").value;
var player2 = document.getElementById("player2").value;
var player3 = document.getElementById("player3").value;
var player4 = document.getElementById("player4").value;

//check tvid
const checkTvid = async () => {
  var url_string = window.location;
  var url = new URL(url_string);
  var tvid = url.searchParams.get("id");

  console.log(tvid);

  if (tvid == null) {
    throw new Error("tvid is null");
  }
  return tvid;
};

function printPriceTable(arrayPrice, min, max) {
  priceTable = document.getElementById("price-table");

  //table heading
  html = ` <table>
  <tr>
    <th>
      番
    </th>
    <th>
    出衝
    </th>
    <th>
      自摸(每位)
    </th>
  </tr>`;

  for (i = min; i <= max; i++) {
    html += `
    <tr>
    <th>
      ${i}
    </th>
    <th>
      ${arrayPrice[i]}
    </th>
    <th>
      ${arrayPrice[i] / 2}
    </th>
  </tr>`;
  }
  html += `</table>`;

  priceTable.innerHTML = html;

  eatPriceTable = document.getElementById("eat-price-table");
  html = ` <table>
  <tr>
    <th>
      番
    </th>
    <th>
    出衝
    </th>
    <th>
      自摸(每位)
    </th>
  </tr>`;

  eatPriceTable.innerHTML = html;

  for (i = min; i <= max; i++) {
    html += `
    <tr>
    <th>
      ${i}
    </th>
    <th>
    <button type="button" class="btn-eatPrice" value="${i}"> ${
      arrayPrice[i]
    }</button>
     
    </th>
    <th>
    <button type="button" class="btn-eatPrice"  value="${i}"> ${
      arrayPrice[i] / 2
    }</button>
    </th>
  </tr>`;
  }
  html += `</table>`;

  eatPriceTable.innerHTML = html;

  var btnEatPrice = document.querySelectorAll(".btn-eatPrice");

  for (let index = 0; index < btnEatPrice.length; index++) {
    var test = index % 2;

    if (test == 0) {
      btnEatPrice[index].addEventListener("click", () => {
        //reset
        MapEatDetail.set("type", "0");

        confirmModal.classList.add("open");
        MapEatDetail.set("farn", btnEatPrice[index].value);
        MapEatDetail.set(
          "eat",
          document.getElementById("eatSelect").selectedIndex
        );

        switch (MapEatDetail.get("eat")) {
          case 1:
            document.getElementById("confirm-1").disabled = true;

            break;
          case 2:
            document.getElementById("confirm-2").disabled = true;

            break;
          case 3:
            document.getElementById("confirm-3").disabled = true;

            break;
          case 4:
            document.getElementById("confirm-4").disabled = true;

            break;

          default:
            break;
        }
      });
    }

    if (test == 1) {
      btnEatPrice[index].addEventListener("click", () => {
        confirmModal.classList.add("open");
        MapEatDetail.set("farn", btnEatPrice[index].value);
        MapEatDetail.set(
          "eat",
          document.getElementById("eatSelect").selectedIndex
        );
        MapEatDetail.set("type", "1");

        document.getElementById("modal-confirm-table").style.display = "none";
      });
    }

    btnEatPrice[index].disabled = true; // disabled click
  }
}

function calPrice(defValue, intMaxValue) {

  var newvalue = defValue;
  var lart = document.getElementById("price-lart");

  if (lart.checked == false) {
    for (var i = 0; i < intMaxValue + 1; i++) {
      // 半辣上

      if (i == 0) {
        arrayPrice[i] = newvalue;
        newvalue = newvalue * 2;
        continue;
      }

      if (i >= 1 && i <= 3) {
        arrayPrice[i] = newvalue;
        newvalue = newvalue * 2;
        continue;
      }

      if (i >= 4) {
        if (newvalue == 2.4000000000000004) {
          newvalue = 2.4;
        } else if (newvalue == 4.800000000000001) {
          newvalue = 4.8;
        } else if (newvalue == 0.0024000000000000002) {
          newvalue = 0.0024;
        } else if (newvalue == 0.0048000000000000004) {
          newvalue = 0.0048;
        }

        arrayPrice[i] = newvalue;

        if (i % 2 == 0) {
          newvalue = newvalue * 1.5;
        } else {
          newvalue = arrayPrice[i - 1] * 2;
        }

        continue;
      }
    }
  } else {
    //辣辣上
    for (var i = 0; i < arrayPrice.length; i++) {
      arrayPrice[i] = newvalue;
      newvalue = newvalue * 2;
    }
  }

  if (tvid != "") {
    firebase
      .firestore()
      .collection("recipes")
      .doc(tvid)
      .update({
        Price: arrayPrice,
        defValue: defValue,
      })
      // .then(function (docRef) {
      //   console.log("price , defvaluse update ");
      // })
      .catch((err) => console.log(err));
  }

  return arrayPrice;
}

async function getData() {
  // ----------- use data from firebase
  firebase
    .firestore()
    .collection("recipes")
    .doc(tvid)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        defValue = doc.data().defValue;
        arrayPrice = doc.data().Price;
        intMinValue = doc.data().MinFarn;
        intMaxValue = doc.data().MaxFarn;
        setting = doc.data().setting;
        jackpot = doc.data().Jackpot;
        chipTotal = Number(doc.data().chip);

        if (setting) {
          settingCover(jackpot);
        }

        calPrice(defValue, intMaxValue);

        slider.noUiSlider.set([intMinValue, intMaxValue]);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        showNotification("資料有錯")
      }
    })
    .then(() => {
      document.getElementById("range-value-1").innerHTML = intMinValue;
      document.getElementById("range-value-2").innerHTML = intMaxValue;
      if (jackpot == "") {
        document.getElementById("head-jackpot").innerHTML =
          "<del>jackpot</del>";
      } else {
        document.getElementById("head-jackpot").innerHTML = "jackpot =";
      }

      document.getElementById("max-farn").innerHTML =
        "最大" + intMaxValue + "番" + arrayPrice[intMaxValue] + "蚊";

      // try get round data
      firebase
        .firestore()
        .collection("recipes")
        .doc(tvid)
        .get()
        .then(function (doc) {
          console.log(doc.data());
          let roundLength = doc.data().round.length;

          for (let index = 0; index < roundLength; index++) {
            arrayRecordData[index] = doc.data().round[index];
          }
        })
        .then(() => {
          showRecord();
          // calPrice();
          calPrice(defValue, intMaxValue);
          printPriceTable(arrayPrice, intMinValue, intMaxValue);
        });

      return true;
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
      throw new Error("getData error ");
    });

  // -----------------------}
}

async function showRecord() {
  console.log("show record function: arrayRecordData = " + arrayRecordData);
  var recordTableBody = document.getElementById("record-table-body");


  var player1Total = 0;
  var player2Total = 0;
  var player3Total = 0;
  var player4Total = 0;
  // var player1Total = chipTotal;
  // var player2Total = chipTotal;
  // var player3Total = chipTotal;
  // var player4Total = chipTotal;

  jackpotTotal = 0;

  for (let index = 1; index < arrayRecordData.length + 1; index++) {
    if (arrayRecordData[index - 1][1] == "") {
      player1Total = 0 + player1Total;
    } else {
      player1Total = arrayRecordData[index - 1][1] + player1Total;
    }

    if (arrayRecordData[index - 1][2] == "") {
      player2Total = 0 + player2Total;
    } else {
      player2Total = arrayRecordData[index - 1][2] + player2Total;
    }

    if (arrayRecordData[index - 1][3] == "") {
      player3Total = 0 + player3Total;
    } else {
      player3Total = arrayRecordData[index - 1][3] + player3Total;
    }
    if (arrayRecordData[index - 1][4] == "") {
      player4Total = 0 + player4Total;
    } else {
      player4Total = arrayRecordData[index - 1][4] + player4Total;
    }

    if (arrayRecordData[index - 1][5] == 2) {
      // console.log(jackpotTotal);
      jackpotTotal = jackpot * 4 + jackpotTotal;
      // console.log(jackpotTotal);
    }

    if (arrayRecordData[index - 1][0] == intMaxValue) {
      jackpotTotal = 0;
    }
  }

  document.getElementById("head-jackpot-value").innerHTML = jackpotTotal;

  recordTableBody.innerHTML = `<tr>
  <td class="tg-baqh">起始 ($${chipTotal})</td>
  <td class="tg-baqh">${player1Total + chipTotal}</td>
  <td class="tg-baqh">${player2Total + chipTotal}</td>
  <td class="tg-baqh">${player3Total + chipTotal}</td>
  <td class="tg-baqh">${player4Total + chipTotal}</td>
  </tr>`;

  document.getElementById("playerscore1").innerHTML = player1Total;
  document.getElementById("playerscore2").innerHTML = player2Total;
  document.getElementById("playerscore3").innerHTML = player3Total;
  document.getElementById("playerscore4").innerHTML = player4Total;

  showRecordBody().then(() => {
    let recordRound = document.querySelectorAll(".recordRound");

    recordRound.forEach((element) => {
      element.addEventListener("click", (e) => {
        moreDetail.classList.add("open");
        showDetail(element.id);
      });
    });
  });
}
//  moreDetail modal

moreDetail.addEventListener("click", (e) => {
  if (e.target.classList.contains("moreDetail-page")) {
    moreDetail.classList.remove("open");
  }
});

function showDetail(id) {
  let roundid = id.replace("recordRound", "");

  document.getElementById("detailround").innerHTML = parseInt(roundid) + 1;
  document.getElementById("detailplayer1").innerHTML =
    arrayRecordData[roundid][1];
  document.getElementById("detailplayer2").innerHTML =
    arrayRecordData[roundid][2];
  document.getElementById("detailplayer3").innerHTML =
    arrayRecordData[roundid][3];
  document.getElementById("detailplayer4").innerHTML =
    arrayRecordData[roundid][4];

  document.getElementById("detailTime").innerHTML =
    arrayRecordData[roundid]["time"];
  let detailString = "";

  let winid = 0;

  for (let index = 1; index < 5; index++) {
    if (arrayRecordData[roundid][index] > 0) {
      winid = "player" + index;
      break;
    }
  }

  switch (winid) {
    case "player1":
      winid = player1;
      break;
    case "player2":
      winid = player2;
      break;
    case "player3":
      winid = player3;
      break;
    case "player4":
      winid = player4;
      break;

    default:
      break;
  }

  switch (arrayRecordData[roundid][5]) {
    case "0":
      let loseid = 0;

      for (let index = 1; index < 5; index++) {
        if (arrayRecordData[roundid][index] < 0) {
          console.log(index);
          loseid = "player" + index;
          break;
        }
      }

      switch (loseid) {
        case "player1":
          loseid = player1;
          break;
        case "player2":
          loseid = player2;
          break;
        case "player3":
          loseid = player3;
          break;
        case "player4":
          loseid = player4;
          break;

        default:
          break;
      }
      detailString =
        winid + " 食左 " + loseid + arrayRecordData[roundid][0] + "番";
      break;
    case "1":
      detailString = winid + " 自摸左 " + arrayRecordData[roundid][0] + "番";
      break;
    case 2:
      detailString = " 流左局";
      break;

    default:
      break;
  }

  document.getElementById("detailDetail").innerHTML = detailString;

  if (
    roundid == arrayRecordData.length - 2 ||
    roundid == arrayRecordData.length - 1
  ) {
    document.getElementById("detailMid").style.display = "inline";
  } else {
    document.getElementById("detailMid").style.display = "none";
  }
}

document.getElementById("detailDel").addEventListener("click", (e) => {
  delRecord(document.getElementById("detailround").innerHTML);
  showRecord();
  moreDetail.classList.remove("open");
});

async function showRecordBody() {
  var html = "";

  for (let index = 0; index < arrayRecordData.length; index++) {
    html += `<tr id="recordRound${index}" class="recordRound" >
    <td class="tg-baqh">       ${index + 1} </td>
    <td class="tg-baqh">${arrayRecordData[index][1]}</td>
    <td class="tg-baqh">${arrayRecordData[index][2]}</td>
    <td class="tg-baqh">${arrayRecordData[index][3]}</td>
    <td class="tg-baqh">${arrayRecordData[index][4]}</td>
    </tr>`;
  }

  document.getElementById("record-table-body").innerHTML += html;
}

checkTvid() // ------------------------------------- start here -------------------
  .then((data) => {
    tvid = data;
  })
  .then(() => {
    getData(); // and also show record() is here
    console.log("get data");
  })
  .then(() => {
    firebase
      .firestore()
      .collection("recipes")
      .doc(tvid)
      .onSnapshot((doc) => {
        console.log(doc);
        // doc.docChanges().forEach(function (change) {
        //   if (change.type === "added") {
        //     console.log("New city: ", change.doc.data());
        //   }
        //   if (change.type === "modified") {
        //     console.log("Modified city: ", change.doc.data());
        //   }
        //   if (change.type === "removed") {
        //     console.log("Removed city: ", change.doc.data());
        //   }
        // });

        getData().then(()=>{
          showRecord();
        });
        let roundLength = doc.data().round.length;
        console.log("roundLength" + roundLength);

        for (let index = 0; index < roundLength; index++) {
          arrayRecordData[index] = doc.data().round[index]
          console.log(arrayRecordData[index]);
        }

        var playerName = document.querySelectorAll(".playername");

        player1 = doc.data().PlayerName.player1;
        player2 = doc.data().PlayerName.player2;
        player3 = doc.data().PlayerName.player3;
        player4 = doc.data().PlayerName.player4;

        playerName.forEach((element) => {
          // console.log(element);

          if (element.classList.contains("player1")) {
            element.innerHTML = doc.data().PlayerName.player1;
            element.value = doc.data().PlayerName.player1;
          }
          if (element.classList.contains("player2")) {
            element.innerHTML = doc.data().PlayerName.player2;
            element.value = doc.data().PlayerName.player2;
          }
          if (element.classList.contains("player3")) {
            element.innerHTML = doc.data().PlayerName.player3;
            element.value = doc.data().PlayerName.player3;
          }
          if (element.classList.contains("player4")) {
            element.innerHTML = doc.data().PlayerName.player4;
            element.value = doc.data().PlayerName.player4;
          }
        });
      });
  })
  .then(() => {
    showRecord();
    // printPriceTable();
  })
  .catch((err) => {
    console.log(err);
    showNotification("Error");

    // var intervalID = setInterval(function () {
    //   url = window.location.origin + "/pages/fallback.html";
    //   window.location.href = url;
    // }, 5000);
  });

// return console.log("get data from server");
const eatButton = document.querySelector(".eat-button");

document.getElementById("recipes").style.display = "none";

eatButton.addEventListener("click", () => {
  if (setting == false) {
    showNotification("請先完成設定");
    const settingModal = document.querySelector(".setting-page");
    settingModal.classList.add("open");
  } else {
    profileModal.classList.add("open");
    console.log("open");
  }
});

function checkSetting() {}

// close profile modal
profileModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("Profile-page")) {
    profileModal.classList.remove("open");
    document.getElementById("selectDefault").selected = "true";
    document.getElementById("eatSelect").value = "";

    var btnEatPrice = document.querySelectorAll(".btn-eatPrice");

    btnEatPrice.forEach((element) => {
      element.disabled = true;
    });
  }
});

//record table

var recordTableHead = document.getElementById("record-table-head");

recordTableHead.innerHTML = `
<tr>
  <th class="tg-c3ow">round</th>
  <th class="tg-c3ow playername player1">~</th>
  <th class="tg-c3ow playername player2">~</th>
  <th class="tg-c3ow playername player3">~</th>
  <th class="tg-c3ow playername player4">~</th>
</tr>`;

var MapEatDetail = new Map([
  ["eat", "default"],
  ["farn", 0],
  ["gotEat", "default"],
  ["type", 0],
]);

function delRecord(recordNumber) {
  recordNumber = recordNumber - 1;
  const record = {
    0: arrayRecordData[recordNumber][0],
    1: arrayRecordData[recordNumber][1],
    2: arrayRecordData[recordNumber][2],
    3: arrayRecordData[recordNumber][3],
    4: arrayRecordData[recordNumber][4],
    5: arrayRecordData[recordNumber][5],
    time: arrayRecordData[recordNumber]["time"],
  };

  for (var i = 0; i < arrayRecordData.length; i++) {
    if (JSON.stringify(arrayRecordData[i]) === JSON.stringify(record)) {
      arrayRecordData.splice(i, 1);
      i--;
    }
  }

  firebase
    .firestore()
    .collection("recipes")
    .doc(tvid)
    // .doc(arrayRecordData.length.toString())
    .update({
      round: firebase.firestore.FieldValue.arrayRemove(record),
    })
    .then(function (docRef) {
      console.log("Success update del delNewRecord");
    })
    .catch((err) => console.log(err));
}

function MakeNewRecord() {
  //番 player1 player2 player3 player4 0(出)/1(自)/2(流)


  arrayRecordData.push(new Array(6));


  for (var j = 0; j < 6; j++) {
    // Initializes:
    arrayRecordData[arrayRecordData.length - 1][j] = 0;
  }

  arrayRecordData[arrayRecordData.length - 1][0] = MapEatDetail.get("farn");

  if (MapEatDetail.get("type") == 1) {
    //自摸

    for (let index = 1; index < 5; index++) {
      // everyone lose
      arrayRecordData[arrayRecordData.length - 1][index] =
        (arrayPrice[MapEatDetail.get("farn")] / 2) * -1;
    }

    arrayRecordData[arrayRecordData.length - 1][MapEatDetail.get("eat")] = // win
      (arrayPrice[MapEatDetail.get("farn")] / 2) * 3;
  } else if (MapEatDetail.get("type") == 0) {
    //出
    arrayRecordData[arrayRecordData.length - 1][MapEatDetail.get("eat")] = // win
      arrayPrice[MapEatDetail.get("farn")];

    arrayRecordData[arrayRecordData.length - 1][MapEatDetail.get("gotEat")] = // lost
      arrayPrice[MapEatDetail.get("farn")] -
      arrayPrice[MapEatDetail.get("farn")] * 2;
  } else if (MapEatDetail.get("type") == 2) {
    for (let index = 1; index < 5; index++) {
      // everyone lose
      arrayRecordData[arrayRecordData.length - 1][index] =
        jackpot - jackpot * 2;
    }
  }

  if (MapEatDetail.get("farn") == intMaxValue) {
    arrayRecordData[arrayRecordData.length - 1][
      MapEatDetail.get("eat")
    ] += jackpotTotal;
    jackpotTotal = 0;
  }

  arrayRecordData[arrayRecordData.length - 1][5] = MapEatDetail.get("type");

  arrayRecordData[arrayRecordData.length - 1]["time"] = timeConverter(
    Date.now()
  );

  return console.table(arrayRecordData);
}

/**
 * 乘法运算
 *
 * @param {Number} a
 * @param {Number} b
 */

/* 提示：因为原生js会出现类似：
1.3*3=3.9000000000000004
5.3*9=47.699999999999996
的情况。所以共同乘以10的n次方，n为a、b两个数小数部分的最大长度值，这样就能一起化为整数运算
*/
const mul = (a, b) => {
  if (!a || !b) {
    console.log("Error: 乘法运算需要传入2个数字");
    return "乘法运算需要传入2个数字";
  }
  let c = 0; // a的小数部分长度
  let d = 0; // b的小数部分长度
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {}
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {}

  return (
    (Number(a.toString().replace(".", "")) *
      Number(b.toString().replace(".", ""))) /
    10 ** (c + d)
  );
};

/**
 * 除法运算
 *
 * @param {Number} a
 * @param {Number} b
 */

/* 提示：因为原生js会出现类似：
0.3/0.1=2.9999999999999996
0.6/3=0.19999999999999998
的情况。所以共同乘以10的n次方，n为a、b两个数小数部分的最大长度值，这样就能一起化为整数运算
*/
const div = (a, b) => {
  if (!a || !b) {
    console.log("Error: 减法运算需要传入2个数字");
    return "减法运算需要传入2个数字";
  }
  let c = 0; // a的小数部分长度
  let d = 0; // b的小数部分长度
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {}
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {}

  const fenzi = Number(a.toString().replace(".", "")) * 10 ** (c + d);
  const fenmu = Number(b.toString().replace(".", "")) * 10 ** (c + d);
  return fenzi / fenmu / 10 ** (c - d);
};

var playerName = document.querySelectorAll(".playername");
playerName.forEach((element) => {

  for (let int = 1; int < 4 + 1; int++) {
    var player = "player" + int;


    if (element.classList.contains(player)) {

      element.value = document.getElementById(player).value;
      // element.innerHTML = document.getElementById(player).value;
      element.innerText = document.getElementById(player).value;
      element.title = int;
      //  console.dir(element);
    }
  }
});

function nameChange(playerNum, value) {
  // var y = document.getElementById(x).value;

  console.log(playerNum, value);

  var playerName = document.querySelectorAll(".playername");


  playerName.forEach((element) => {


    if (element.classList.contains(playerNum)) {
      element.innerHTML = value;
      element.value = value;
    }
  });

  player1 = document.getElementById("player1").value;
  player2 = document.getElementById("player2").value;
  player3 = document.getElementById("player3").value;
  player4 = document.getElementById("player4").value;

  firebase
    .firestore()
    .collection("recipes")
    .doc(tvid)
    .update({
      PlayerName: {
        player1: document.getElementById("player1").value,
        player2: document.getElementById("player2").value,
        player3: document.getElementById("player3").value,
        player4: document.getElementById("player4").value,
      },
    })
    .then(function (docRef) {
      console.log("firebase: name change ");
    })
    .catch((err) => console.log(err));
}

// open profile modal
const settingDiv = document.getElementById("setting-div");
const settingModal = document.querySelector(".setting-page");

// close profile modal
profileModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("Profile-page")) {
    profileModal.classList.remove("open");
  }
});

settingDiv.addEventListener("click", () => {
  settingModal.classList.add("open");

});

document.getElementById("setting-submit").addEventListener("click", (e) => {
  e.preventDefault();
  setting = true;

  firebase
    .firestore()
    .collection("recipes")
    .doc(tvid)
    .update({
      setting: true,
    })
    .then(() => {
      console.log("setting true");
      settingCover();
      getData();
    })
    .catch((err) => console.log(err));
});

function settingCover(jackpot) {

  if (document.getElementById("setting-submit").disabled == true) {
    return 0;
  }
  showNotification("設定完成啦");
  document.querySelector(".setting-page .modal").scrollTop = 0;

  document.getElementById("player1").disabled = true;
  document.getElementById("player2").disabled = true;
  document.getElementById("player3").disabled = true;
  document.getElementById("player4").disabled = true;

  slider.setAttribute("disabled", true);

  document.getElementById("price-lart").disabled = true;
  document.getElementById("price-d10").disabled = true;
  document.getElementById("price-d2").disabled = true;
  document.getElementById("price-reset").disabled = true;
  document.getElementById("price-x2").disabled = true;
  document.getElementById("price-x10").disabled = true;
  document.getElementById("setting-jackpot").disabled = true;
  document.getElementById("setting-jackpot-input").disabled = true;
  document.getElementById("setting-jackpot-input").value = jackpot;

  document.getElementById("setting-chip").disabled = true;
  document.getElementById("setting-chip-input").disabled = true;
  // document.getElementById("setting-chip-input").value = x;

  document.getElementById("setting-invite").style.display = "block";

  document.getElementById("setting-submit").disabled = true;
}

function copyToClipboard(text) {
  console.log("copy");
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return clipboardData.setData("Text", text);
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported("copy")
  ) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy"); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

// close profile modal
settingModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("setting-page")) {
    settingModal.classList.remove("open");
  }
});

var slider = document.getElementById("farn-slider");
noUiSlider.create(slider, {
  start: [intMinValue, intMaxValue],
  connect: true,
  step: 1,
  range: {
    min: 0,
    max: 13,
  },
  pips: {
    mode: "steps",
    stepped: true,
    density: 10,
    // format: wNumb({
    //   decimals: 2,
    //   prefix: "$",
    // }),
  },
});

console.log(intMinValue, intMaxValue);
var lart = document.getElementById("price-lart");
lart.addEventListener("change", (event) => {
  calPrice(defValue, intMaxValue);

  printPriceTable(arrayPrice, intMinValue, intMaxValue);
});

// / When the slider value changes, update the input and span
slider.noUiSlider.on("change", function (values, handle) {


  document.getElementById("range-value-1").innerHTML = Math.floor(values[0]);

  document.getElementById("range-value-2").innerHTML = Math.floor(values[1]);

  intMinValue = Math.floor(values[0]); // low farn
  intMaxValue = Math.floor(values[1]); // max farn

  arrayPrice = new Array(intMaxValue + 1);

  // calPrice(arrayPrice, defValue);
  calPrice(defValue, intMaxValue);

  printPriceTable(arrayPrice, intMinValue, intMaxValue);

  document.getElementById("max-farn").innerHTML =
    "最大" + intMaxValue + "番" + arrayPrice[intMaxValue] + "蚊";

  if (tvid != "") {
    firebase
      .firestore()
      .collection("recipes")
      .doc(tvid)
      .update({
        MinFarn: intMinValue,
        MaxFarn: intMaxValue,
      })
      .then(function (docRef) {
        console.log("min max farn added ");
        console.log([intMinValue, intMaxValue]);
      })
      .catch((err) => console.log(err));
  }
});

document.getElementById("price-d10").addEventListener("click", function () {
  defValue = div(defValue, 10);

  if (defValue < 0.0001) {
    alert("打咁細點比錢呀? 比bitcoin都比唔到啦");
    defValue = mul(defValue, 10);
  } else {
    calPrice(defValue, intMaxValue);
    printPriceTable(arrayPrice, intMinValue, intMaxValue);
  }
});

document.getElementById("price-d2").addEventListener("click", function () {
  defValue = div(defValue, 2);
  if (defValue < 0.0001) {
    alert("打咁細點比錢呀? 比bitcoin都比唔到啦");
    defValue = mul(defValue, 2);
  } else {
    calPrice(defValue, intMaxValue);
    printPriceTable(arrayPrice, intMinValue, intMaxValue);
  }
});

document.getElementById("price-x2").addEventListener("click", function () {
  defValue = mul(defValue, 2);
  calPrice(defValue, intMaxValue);
  printPriceTable(arrayPrice, intMinValue, intMaxValue);
});

document.getElementById("price-x10").addEventListener("click", function () {
  defValue = mul(defValue, 10);
  calPrice(defValue, intMaxValue);
  printPriceTable(arrayPrice, intMinValue, intMaxValue);
});

document.getElementById("price-reset").addEventListener("click", function () {
  defValue = 1;
  calPrice(defValue, intMaxValue);
  printPriceTable(arrayPrice, intMinValue, intMaxValue);
});

var eatSelect = document.getElementById("eatSelect");

eatSelect.addEventListener("change", (event) => {
  if (eatSelect.value != "") {
    var btnEatPrice = document.querySelectorAll(".btn-eatPrice");

    btnEatPrice.forEach((element) => {
      element.disabled = false;
    });
  }
});

var confirmEat = document.querySelectorAll(".confirm-eat .playerbox");

document.getElementById("eat-confirm").addEventListener("click", (e) => {

  if (MapEatDetail.get("gotEat") == "default" && eatSelect.value == "") {
    showNotification("邊個出衝?");
  } else if (
    MapEatDetail.get("eat") == MapEatDetail.get("gotEat") &&
    MapEatDetail.get("type") == 0
  ) {
    showNotification("出衝點會同食糊係同一個人呀");
  } else {
    console.log("confrim eat");
    MakeNewRecord();
    showRecord();

    // MapEatDetail.get("gotEat");

    const record = {
      0: arrayRecordData[arrayRecordData.length - 1][0],
      1: arrayRecordData[arrayRecordData.length - 1][1],
      2: arrayRecordData[arrayRecordData.length - 1][2],
      3: arrayRecordData[arrayRecordData.length - 1][3],
      4: arrayRecordData[arrayRecordData.length - 1][4],
      5: arrayRecordData[arrayRecordData.length - 1][5],
      time: arrayRecordData[arrayRecordData.length - 1]["time"],
    };

    firebase
      .firestore()
      .collection("recipes")
      .doc(tvid)
      // .doc(arrayRecordData.length.toString())
      .update({
        round: firebase.firestore.FieldValue.arrayUnion(record),
      })
      .then(function (docRef) {
        console.log("Created new record ");
      })
      .catch((err) => console.log(err));

    // close profile
    profileModal.classList.remove("open");
    document.getElementById("selectDefault").selected = "true";
    document.getElementById("eatSelect").value = "";
    var btnEatPrice = document.querySelectorAll(".btn-eatPrice");
    btnEatPrice.forEach((element) => {
      element.disabled = true;
    });

    //close confirm
    confirmModal.classList.remove("open");

    confirmEat.forEach((element) => {
      element.classList.remove("selected");
      element.disabled = false;
    });

    //reset map
    MapEatDetail.set("eat", "default");
    MapEatDetail.set("gotEat", "default");

    document.getElementById("modal-confirm-table").style.display = "block"; //reset
  }
});

confirmEat.forEach((element) => {

  element.addEventListener("click", (e) => {

    confirmEat.forEach((element) => {
      element.classList.remove("selected");
    });
    element.classList.add("selected");
    MapEatDetail.set("gotEat", element.title);

  });
});

//confirm page

const confirmModal = document.querySelector(".confirm-page");

confirmModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("confirm-page")) {
    confirmModal.classList.remove("open");
    document.getElementById("modal-confirm-table").style.display = "block";
    confirmEat.forEach((element) => {
      element.classList.remove("selected");
      element.disabled = false;
    });
  }
});

const lauGuk = document.getElementById("eat-lauGuk");

lauGuk.addEventListener("click", (e) => {
  MapEatDetail.set("eat", 0);
  MapEatDetail.set("farn", 0);
  MapEatDetail.set("gotEat", 0);
  MapEatDetail.set("type", 2);

  confirmModal.classList.add("open");
  document.getElementById("modal-confirm-table").style.display = "none";
});

document
  .getElementById("setting-jackpot-input")
  .addEventListener("change", (event) => {
    firebase
      .firestore()
      .collection("recipes")
      .doc(tvid)
      .update({
        Jackpot: document.getElementById("setting-jackpot-input").value,
      })
      .then(() => {
        console.log("Jackpot");
        jackpot = document.getElementById("setting-jackpot-input").value;
      })
      .catch((err) => console.log(err));
  });

document
  .getElementById("setting-jackpot")
  .addEventListener("change", (event) => {
    // document.getElementById("setting-jackpot").disabled = false;

    if (document.getElementById("setting-jackpot-input").disabled == false) {
      document.getElementById("setting-jackpot-input").disabled = true;
      document.getElementById("setting-jackpot-input").value = "";
      firebase
        .firestore()
        .collection("recipes")
        .doc(tvid)
        .update({
          Jackpot: document.getElementById("setting-jackpot-input").value,
        })
        .then(() => {
          console.log("Jackpot");
          jackpot = document.getElementById("setting-jackpot-input").value;
        })
        .catch((err) => console.log(err));
    } else {
      if (document.getElementById("setting-jackpot-input").disabled == true) {
        document.getElementById("setting-jackpot-input").disabled = false;
        firebase
          .firestore()
          .collection("recipes")
          .doc(tvid)
          .update({
            Jackpot: document.getElementById("setting-jackpot-input").value,
          })
          .then(() => {
            console.log("Jackpot");
            jackpot = document.getElementById("setting-jackpot-input").value;
          })
          .catch((err) => console.log(err));
      }
    }

    // console.log(document.getElementById("setting-jackpot-input").checked);
  });

document
  .getElementById("setting-chip-input")
  .addEventListener("change", (event) => {
    firebase
      .firestore()
      .collection("recipes")
      .doc(tvid)
      .update({
        chip: document.getElementById("setting-chip-input").value,
      })
      .then(() => {
        console.log("chip");
        jackpot = document.getElementById("setting-chip-input").value;
      })
      .catch((err) => console.log(err));
  });

document.getElementById("setting-chip").addEventListener("change", (event) => {
  if (document.getElementById("setting-chip-input").disabled == false) {
    document.getElementById("setting-chip-input").disabled = true;
    document.getElementById("setting-chip-input").value = "";
    firebase
      .firestore()
      .collection("recipes")
      .doc(tvid)
      .update({
        chip: document.getElementById("setting-chip-input").value,
      })
      .then(() => {
        console.log("chip");
        jackpot = document.getElementById("setting-chip-input").value;
      })
      .catch((err) => console.log(err));
  } else {
    if (document.getElementById("setting-chip-input").disabled == true) {
      document.getElementById("setting-chip-input").disabled = false;
      firebase
        .firestore()
        .collection("recipes")
        .doc(tvid)
        .update({
          chip: document.getElementById("setting-chip-input").value,
        })
        .then(() => {
          console.log("chip");
          jackpot = document.getElementById("setting-chip-input").value;
        })
        .catch((err) => console.log(err));
    }
  }

  // console.log(document.getElementById("setting-jackpot-input").checked);
});

// document.getElementById("btn-invite").addEventListener("click", (e) => {
//   let share = shareId();
//   console.log(share);
//   copyToClipboard(share);
//   document.getElementById("myTooltip").innerHTML = "Copied ";
//   setTimeout(() => {
//     var tooltip = document.getElementById("myTooltip");
//     tooltip.innerHTML = "Copy to clipboard";
//   }, 1500);
// });

// var qrcode = new QRCode("qrcode");
var qrcode = new QRCode("qrcode", {
  // text: "http://jindo.dev.naver.com/collie",
  width: 256,
  height: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H,
});

function makeCode() {
  qrcode.makeCode(shareId());
}

makeCode();

//-------------------------------------------------------- for testing


// for (let [key, value] of MapEatDetail) {
//   console.log(key + " = " + value);
// }