// enable offline data
// const db = firebase.firestore();
firebase
  .firestore()
  .enablePersistence()
  .catch(function (err) {
    if (err.code == "failed-precondition") {
      // probably multible tabs open at once
      console.log("persistance failed");
    } else if (err.code == "unimplemented") {
      // lack of browser support for the feature
      console.log("persistance not available");
    }
  });

// real-time listener
firebase
  .firestore()
  .collection("recipes")
  .onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        renderRecipe(change.doc.data(), change.doc.id);
      }
      if (change.type === "removed") {
        removeRecipe(change.doc.id);
      }
    });
  });

// add new recipe
const addForm = document.getElementById("add-recipe-form");

if (addForm != null) {
  addForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const recipe = {
      name: addForm.title.value,
      ingredients: addForm.ingredients.value,
      CreateTime: timeConverter(Date.now()),
      round: 0,
      defValue: 1,
      Price: [0],
      MinFarn: 3,
      MaxFarn: 8,
      setting: false,
      Jackpot: "",
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
      .catch((err) => console.log(err));

    addForm.title.value = "";
    addForm.ingredients.value = "";
  });
}

// remove a recipe
const recipeContainer = document.querySelector(".recipes");
recipeContainer.addEventListener("click", (evt) => {
  console.log(evt);
  if (evt.target.tagName === "I") {
    const id = evt.target.getAttribute("data-id");
    console.log(id);
    firebase.firestore().collection("recipes").doc(id).delete();
  }

  if (evt.toElement.offsetParent === "div.card-panel.recipe.white.row") {
    const id = evt.target.getAttribute("data-id");
    console.log("test");
  }
  // console.log(evt.target);
  if (evt.target.className === "recipe-title") {
    console.log("hihi");
    const id = evt.target.getAttribute("data-id");
    console.log(id);

    url = window.location.href + "pages/mj.html?id=" + id;

    // url = "http://127.0.0.1:5500/pages/mj.html?" + "id="+id;
    console.log(url);

    window.location.replace(url);
  }
});
