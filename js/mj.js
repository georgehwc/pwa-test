// open profile modal
const eatButton = document.querySelector(".eat-button");
const profileModal = document.querySelector(".Profile-page");

let defValue = Math.floor(1);
let arrayRecordData = [];
let arrayPrice = [];
let intMinValue = 1;
let intMaxValue = 1;
let tvid = "";

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

  console.log(arrayPrice);
  console.log(min);
  console.log(max);

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
  // console.log(html);
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
  // console.log(html);
  eatPriceTable.innerHTML = html;

  var btnEatPrice = document.querySelectorAll(".btn-eatPrice");

  for (let index = 0; index < btnEatPrice.length; index++) {
    var test = index % 2;
    btnEatPrice[index].addEventListener("click", () => {
      MapEatDetail.set("type", "0");

      confirmModal.classList.add("open");
      MapEatDetail.set("farn", btnEatPrice[index].value);
      MapEatDetail.set(
        "eat",
        document.getElementById("eatSelect").selectedIndex
      );
    });

    if (test == 1) {
      btnEatPrice[index].addEventListener("click", () => {
        MapEatDetail.set("type", "1");

        document.getElementById("modal-confirm-table").style.display = "none";
      });
    }

    btnEatPrice[index].disabled = true; // disabled click
  }
}

function calPrice(arrayPrice, defValue) {
  var newvalue = defValue;
  var lart = document.getElementById("price-lart");
  if (lart.checked == false) {
    for (var i = 0; i < arrayPrice.length; i++) {
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

  console.log(tvid + " in calPrice");
  if (tvid != "") {
    firebase
      .firestore()
      .collection("recipes")
      .doc(tvid)
      .update({
        Price: arrayPrice,
        defValue: defValue,
      })
      .then(function (docRef) {
        console.log("price , defvaluse update ");
      })
      .catch((err) => console.log(err));
  }

  return arrayPrice;
}

function showRecord() {
  console.log("show record function");
  console.log(arrayRecordData);
  var recordTableBody = document.getElementById("record-table-body");

  var player1Total = 0;
  var player2Total = 0;
  var player3Total = 0;
  var player4Total = 0;

  for (let index = 1; index < arrayRecordData.length + 1; index++) {
    player1Total = arrayRecordData[index - 1][1] + player1Total;
    player2Total = arrayRecordData[index - 1][2] + player2Total;
    player3Total = arrayRecordData[index - 1][3] + player3Total;
    player4Total = arrayRecordData[index - 1][4] + player4Total;
  }

  recordTableBody.innerHTML = `<tr>
  <td class="tg-baqh">Total</td>
  <td class="tg-baqh">${player1Total}</td>
  <td class="tg-baqh">${player2Total}</td>
  <td class="tg-baqh">${player3Total}</td>
  <td class="tg-baqh">${player4Total}</td>
  </tr>`;

  document.getElementById("playerscore1").innerHTML = player1Total;
  document.getElementById("playerscore2").innerHTML = player2Total;
  document.getElementById("playerscore3").innerHTML = player3Total;
  document.getElementById("playerscore4").innerHTML = player4Total;

  var html = "";

  for (let index = 0; index < arrayRecordData.length; index++) {
    html += `<tr>
    <td class="tg-baqh">       ${index} </td>
    <td class="tg-baqh">${arrayRecordData[index][1]}</td>
    <td class="tg-baqh">${arrayRecordData[index][2]}</td>
    <td class="tg-baqh">${arrayRecordData[index][3]}</td>
    <td class="tg-baqh">${arrayRecordData[index][4]}</td>
    </tr>`;
  }

  recordTableBody.innerHTML += html;
}

function getData() {
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

        // console.log([intMinValue, intMaxValue]);

        slider.noUiSlider.set([intMinValue, intMaxValue]);
        console.log(slider.noUiSlider.get());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .then(() => {
      // try get round data

      firebase
        .firestore()
        .collection("recipes")
        .doc(tvid)
        .get()
        .then(function (doc) {
          console.log(doc.data());
          let roundLength = doc.data().round.length;
          console.log(roundLength);

          for (let index = 0; index < roundLength; index++) {
            arrayRecordData[index] = doc.data().round[index];
            console.log(arrayRecordData[index]);
          }
        })
        .then(() => {
          showRecord();
          calPrice();
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

checkTvid() // ------------------------------------- start here -------------------
  .then((data) => {
    console.log(data);
    tvid = data;
  })
  .then(() => {
    nameChange(1, 1); // default
  })
  .then(() => {
    getData(); // and also show record() is here
    console.log("get data");
  })
  .then(() => {
    // calPrice();
    // printPriceTable();
    // showRecord();
    // calPrice(arrayPrice, defValue);

    firebase
      .firestore()
      .collection("recipes")
      .doc(tvid)
      .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());
        // getData();
        console.log(doc.data());
        let roundLength = doc.data().round.length;
        console.log(roundLength);

        for (let index = 0; index < roundLength; index++) {
          arrayRecordData[index] = doc.data().round[index];
          console.log(arrayRecordData[index]);
        }

        // showRecord();
      });
  })
  .then(() => {
    showRecord();
    // printPriceTable();
  })
  .catch((err) => {
    console.log(err);
  });

// return console.log("get data from server");

document.getElementById("recipes").style.display = "none";

eatButton.addEventListener("click", () => {
  profileModal.classList.add("open");
  console.log("open");
});

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

function MakeNewRecord() {
  arrayRecordData.push(new Array(6));

  console.log(arrayRecordData.length);

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
  } else {
    arrayRecordData[arrayRecordData.length - 1][MapEatDetail.get("eat")] = // win
      arrayPrice[MapEatDetail.get("farn")];

    arrayRecordData[arrayRecordData.length - 1][MapEatDetail.get("gotEat")] = // lost
      arrayPrice[MapEatDetail.get("farn")] -
      arrayPrice[MapEatDetail.get("farn")] * 2;
  }

  arrayRecordData[arrayRecordData.length - 1][5] = MapEatDetail.get("type");

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
  // console.log(element);

  for (let int = 1; int < 4 + 1; int++) {
    var player = "player" + int;
    //console.log(player);
    // // element.classList.contains(id);
    //console.log(element);

    if (element.classList.contains(player)) {
      // console.log(element);
      // element.value = int;
      element.value = document.getElementById(player).value;
      // element.innerHTML = document.getElementById(player).value;
      element.innerText = document.getElementById(player).value;
      element.title = int;
      //  console.dir(element);
    }
  }
});

function nameChange(id, value) {
  // var y = document.getElementById(x).value;

  var playerName = document.querySelectorAll(".playername");
  // console.log(id + value);

  playerName.forEach((element) => {
    // console.log(element);

    if (element.classList.contains(id)) {
      element.innerHTML = value;
      element.value = value;
    }
  });

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

var player1 = document.getElementById("player1").value;
var player2 = document.getElementById("player2").value;
var player3 = document.getElementById("player3").value;
var player4 = document.getElementById("player4").value;

// open profile modal
const setting = document.getElementById("setting-div");
const settingModal = document.querySelector(".setting-page");

// close profile modal
profileModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("Profile-page")) {
    profileModal.classList.remove("open");
  }
});

setting.addEventListener("click", () => {
  settingModal.classList.add("open");
  // console.log("open");
});

document.getElementById("setting-submit").addEventListener("click", (e) => {
  document.getElementById("setting-page-cover").classList.add("yes");
  settingModal.classList.remove("open");
});

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

// / When the slider value changes, update the input and span
slider.noUiSlider.on("change", function (values, handle) {
  // console.log(values);
  // console.log(handle);
  // console.log(values[handle]);

  document.getElementById("range-value-1").innerHTML = Math.floor(values[0]);

  document.getElementById("range-value-2").innerHTML = Math.floor(values[1]);

  intMinValue = Math.floor(values[0]); // low farn
  intMaxValue = Math.floor(values[1]); // max farn

  arrayPrice = new Array(intMaxValue + 1);

  calPrice(arrayPrice, defValue);
  printPriceTable(arrayPrice, intMinValue, intMaxValue);

  var lart = document.getElementById("price-lart");
  lart.addEventListener("change", (event) => {
    calPrice(arrayPrice, defValue);
    printPriceTable(arrayPrice, intMinValue, intMaxValue);
  });

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
    calPrice(arrayPrice, defValue);
    printPriceTable(arrayPrice, intMinValue, intMaxValue);
  }
});

document.getElementById("price-d2").addEventListener("click", function () {
  defValue = div(defValue, 2);
  if (defValue < 0.0001) {
    alert("打咁細點比錢呀? 比bitcoin都比唔到啦");
    defValue = mul(defValue, 2);
  } else {
    calPrice(arrayPrice, defValue);
    printPriceTable(arrayPrice, intMinValue, intMaxValue);
  }
});

document.getElementById("price-x2").addEventListener("click", function () {
  defValue = mul(defValue, 2);
  calPrice(arrayPrice, defValue);
  printPriceTable(arrayPrice, intMinValue, intMaxValue);
});

document.getElementById("price-x10").addEventListener("click", function () {
  defValue = mul(defValue, 10);
  calPrice(arrayPrice, defValue);
  printPriceTable(arrayPrice, intMinValue, intMaxValue);
});

document.getElementById("price-reset").addEventListener("click", function () {
  defValue = 1;
  calPrice(arrayPrice, defValue);
  printPriceTable(arrayPrice, intMinValue, intMaxValue);
});

var eatSelect = document.getElementById("eatSelect");

eatSelect.addEventListener("change", (event) => {
  console.log(eatSelect.value);

  if (eatSelect.value != "") {
    var btnEatPrice = document.querySelectorAll(".btn-eatPrice");

    btnEatPrice.forEach((element) => {
      element.disabled = false;
    });
  }
});

var confirmEat = document.querySelectorAll(".confirm-eat .playerbox");

document.getElementById("eat-confirm").addEventListener("click", (e) => {
  console.log("confrim eat");

  // for (let [key, value] of MapEatDetail) {
  //   console.log(key + " = " + value);
  // }

  if (MapEatDetail.get("eat") == MapEatDetail.get("gotEat")) {
    alert("出衝點會同食糊係同一個人呀");
  } else {
    MakeNewRecord();
    showRecord();
    document.getElementById("modal-confirm-table").style.display = "block";

    MapEatDetail.get("gotEat");

    // const record = {
    //   farn: arrayRecordData[arrayRecordData.length - 1][0],
    //   player1: arrayRecordData[arrayRecordData.length - 1][1],
    //   player2: arrayRecordData[arrayRecordData.length - 1][2],
    //   player3: arrayRecordData[arrayRecordData.length - 1][3],
    //   player4: arrayRecordData[arrayRecordData.length - 1][4],
    //   type: MapEatDetail.get("type"),
    //   time: timeConverter(Date.now()),
    // };

    let roundNum = arrayRecordData.length.toString();

    const record = {
      0: arrayRecordData[arrayRecordData.length - 1][0],
      1: arrayRecordData[arrayRecordData.length - 1][1],
      2: arrayRecordData[arrayRecordData.length - 1][2],
      3: arrayRecordData[arrayRecordData.length - 1][3],
      4: arrayRecordData[arrayRecordData.length - 1][4],
      5: MapEatDetail.get("type"),
      time: timeConverter(Date.now()),
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
    });

    //reset map
    MapEatDetail.set("eat", "default");
    MapEatDetail.set("gotEat", "default");
  }
});

confirmEat.forEach((element) => {
  // console.log(element);
  element.addEventListener("click", (e) => {
    // console.log(element);
    confirmEat.forEach((element) => {
      element.classList.remove("selected");
    });
    element.classList.add("selected");
    MapEatDetail.set("gotEat", element.title);
    // console.log(element.value);
    // console.dir(element);
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
    });
  }
});

//-------------------------------------------------------- for testing

// console.log(MapEatDetail.get("eat")); // 食
// console.log(MapEatDetail.get("farn")); // 番
// console.log(MapEatDetail.get("gotEat")); // 被食

for (let [key, value] of MapEatDetail) {
  console.log(key + " = " + value);
}
// MakeNewRecord();
// MakeNewRecord();
// arrayRecordData[0][1] = 16;
// arrayRecordData[0][2] = 0;
// arrayRecordData[0][3] = -16;
// arrayRecordData[0][4] = 0;

// arrayRecordData[1][1] = 128;
// arrayRecordData[1][2] = 0;
// arrayRecordData[1][3] = -128;
// arrayRecordData[1][4] = 0;

console.log("12312312");

// // return ref.doc(docid).onSnapshot((doc) => {
// //   console.log("Current data: ", doc.data());
// //   console.log("some data change");
// // });

// firebase
// .firestore()
// .collection("recipes")
// .doc(tvid)
// .onSnapshot(()=>{
//   console.log("Current data: ", doc.data());
// })