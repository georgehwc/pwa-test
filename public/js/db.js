// // real-time listener
// firebase
//   .firestore()
//   .collection("recipes")
//   .onSnapshot((snapshot) => {
//     console.log(snapshot);
//     // snapshot.docChanges().forEach((change) => {
//     //   if (change.type === "added") {
//     //     renderRecipe(change.doc.data(), change.doc.id);
//     //   }
//     //   if (change.type === "removed") {
//     //     removeRecipe(change.doc.id);
//     //   }
//     // });
//   });

// remove recipe
const removeRecipe = (id) => {
  const recipe = document.querySelector(`.recipe[data-id=${id}]`);
  recipe.remove();
};

// add new recipe
const addForm = document.getElementById("add-recipe-form");

function iconRandom(prefer) {
  var icon = [
    "MJat1-",
    "MJat2-",
    "MJat3-",
    "MJd1-",
    "MJd2-",
    "MJd3-",
    "MJd3rv1-",
    "MJf1-",
    "MJf2-",
    "MJf3-",
    "MJf4-",
    "MJh1-",
    "MJh2-",
    "MJh3-",
    "MJh4-",
    "MJh5-",
    "MJh6-",
    "MJh7-",
    "MJh8-",
    "MJs1-",
    "MJs2-",
    "MJs3-",
    "MJs4-",
    "MJs5-",
    "MJs6-",
    "MJs7-",
    "MJs8-",
    "MJs9-",
    "MJt1-",
    "MJt2-",
    "MJt3-",
    "MJt4-",
    "MJt5-",
    "MJt6-",
    "MJt7-",
    "MJt8-",
    "MJt9-",
    "MJw1-",
    "MJw2-",
    "MJw3-",
    "MJw4-",
    "MJw5-",
    "MJw6-",
    "MJw7-",
    "MJw8-",
    "MJw9-",
  ];

  if (prefer == "mjrandom") {
    let random = Math.floor(Math.random() * 46);
    return icon[random];
  }
  if (prefer == "mjother") {
    let random = Math.floor(Math.random() * 19);
    return icon[random];
  }
  if (prefer == "mjs") {
    let random = Math.floor(Math.random() * 9) + 19;
    return icon[random];
  }
  if (prefer == "mjt") {
    let random = Math.floor(Math.random() * 9) + 28;
    return icon[random];
  }
  if (prefer == "mjw") {
    let random = Math.floor(Math.random() * 9) + 37;
    return icon[random];
  }
}

if (addForm != null) {
  addForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const recipe = {
      name: addForm.title.value,
      ingredients: addForm.ingredients.value,
      CreateTime: timeConverter(Date.now()),
      icon: iconRandom(addForm.recipesIcon.value),
      round: 0,
      defValue: 1,
      Price: [0],
      MinFarn: 3,
      MaxFarn: 8,
      setting: false,
      Jackpot: "",
      chip: 0,
      PlayerName: {
        player1: "Player1",
        player2: "Player2",
        player3: "Player3",
        player4: "Player4",
      },
    };

    firebase
      .firestore()
      .collection("recipes")
      .add(recipe)
      .then((data) => {
        // console.log(data.id);
        addForm.title.value = "";
        addForm.ingredients.value = "";
        SaveDataToLocalStorage(data.id);
        return data.id;
      })
      .then((id) => {
        console.log(id);
        gotopage(id);
      })
      .catch((err) => console.log(err));
  });
}

const recipeContainer = document.querySelector(".recipes");

if (recipeContainer != null) {
  recipeContainer.addEventListener("click", (evt) => {
    console.log(evt);
    // remove a recipe
    if (evt.target.tagName === "I") {
      const id = evt.target.getAttribute("data-id");
      console.log(id);
      firebase.firestore().collection("recipes").doc(id).delete();

      var retrievedData = localStorage.getItem("mjsession");

      var retrievedDataArray = JSON.parse(retrievedData);
      console.log(retrievedDataArray);

      for (var i = 0; i < retrievedDataArray.length; i++) {
        if (retrievedDataArray[i] === id) {
          retrievedDataArray.splice(i, 1);
          i--;
        }
      }
      console.log(retrievedDataArray);
      localStorage.setItem("mjsession", JSON.stringify(retrievedDataArray));

      removeRecipe(id);
    }

    if (evt.toElement.offsetParent === "div.card-panel.recipe.white.row") {
      const id = evt.target.getAttribute("data-id");
      console.log("test");
    }

    if (
      evt.target.classList.contains("card-panel") ||
      evt.target.classList.contains("recipe-title") ||
      evt.target.classList.contains("recipe-details") ||
      evt.target.tagName === "IMG" ||
      evt.target.classList.contains("recipe-ingredients")
      // evt.target.classList.contains("123")
    ) {
      const id = evt.target.getAttribute("data-id");
      gotopage(id);
    }
  });
}

function gotopage(id) {
  // const id = evt.target.getAttribute("data-id");
  let href = window.location.href;

  if (href.indexOf("/index.html?") > -1) {
    href = href.replace("index.html?", "");
  }
  if (href.indexOf("/index.html") > -1) {
    href = href.replace("index.html", "");
  }

  url = href + "pages/mj.html?id=" + id;
  console.log(url);
  window.location.href = url;
}
