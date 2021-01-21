let arrayRecordData = [];

// let arrayDefault = ["any", "any", "any", "any", "any", "any",
// "any", "any", "any", "any", "any", "any", "any"];

CalForSelect();
arrayDefault();
printSelected();

function arrayDefault() {

    for (let index = 0; index < 14; index++) {
        arrayRecordData[index] = "any";

    }

}

function CalForSelect() {
    var btnCalForSelect = document.querySelectorAll('.cal-forSelect');

    btnCalForSelect.forEach(element => {
        element.addEventListener("click", () => {
            console.log(element.alt);

            let same = 0;
            for (let index = 0; index < arrayRecordData.length; index++) {

                if (arrayRecordData[index] == element.alt) {
                    same = same + 1;
                }
                if (same == 4) {
                    showNotification("點樣多過4隻");
                    break;
                }

                if (arrayRecordData[index] == "any") {
                    arrayRecordData[index] = element.alt;
                    printSelected();
                    if (index == arrayRecordData.length - 1) {
                        showNotification("齊");
                        checkLegit();
                    }
                    break;
                }

            }
            printSelected();

        })
    });
}


function printSelected() {
    var html = "";
    var temple1 = `<div class="cal cal-selected `
    var temple2 = `"><img src="../img/common/MJ`;

    var temple3 = `.svg" alt=""></div>`;

    for (let index = 0; index < 14; index++) {
        html = html + temple1;
        if (index == 13) {
            html = html + `rotate90`;
        }
        html = html + temple2;

        html = html + arrayRecordData[index];
        if (arrayRecordData[index] != "any") {
            html = html + `-`;
        }
        html = html + temple3;

    }

    document.querySelector(".cal-selected").innerHTML = html;

}

document.getElementById("calReset").addEventListener("click", () => {
    arrayDefault();
    printSelected();
})

const ShowAllModal = document.querySelector('.ShowAll-page')


document.getElementById("calShowAll").addEventListener("click", () => {
    ShowAllModal.classList.add('open');
    printAllEat();

})

// close ShowAllModal
ShowAllModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('ShowAll-page')) {
        ShowAllModal.classList.remove('open');

    }
})

function printAllEat() {
    if(document.querySelector(".ShowAll-page.modal") == null){
        console.log("empty");
    }
}

function checkLegit() {
    console.log("checking");
    console.log(arrayRecordData);
    arrayRecordData.sort();
    console.log(arrayRecordData);

    // 順 s
    // 碰 p
    // 槓 k
    // 眼 n


    let total = 14;
    let finalArray = {};

    for (let index = 0; index < arrayRecordData.length; index++) {
        let test = arrayRecordData[index] ;
        finalArray[index] = {[test]: "0"};
    }

    console.log(finalArray);

    let type = {};
    var obj = {};

    arrayRecordData.forEach(element => {
        var s = element.toString();
        if (typeof type[s.charAt(0)] == 'undefined') {
            type[s.charAt(0)] = 1;
        } else {
            type[s.charAt(0)] = type[s.charAt(0)] + 1;
        }

    });


    arrayRecordData.forEach(function (item) {
        // console.log(item);
        if (typeof obj[item] == 'number') {
            obj[item]++;
        } else {
            obj[item] = 1;
        }
    });


    console.log(type);
    console.log(obj);

    console.log(Object.keys(obj));
    console.log(Object.values(obj));


    console.log(type.length);
    console.log(obj.length);


    let typeLength = Object.keys(type).length;
    let objLength = Object.keys(type).length;

    console.log(typeLength);
    console.log(objLength);


    if(typeLength == 1){
        console.log("清一色/字一色");
    }

    if(typeLength == 2){
        console.log("混一色 maybe");
    }
    if(typeLength == 2){
        console.log("混一色 maybe");
    }


    document.getElementById('output').innerHTML = Object.keys(obj).map(function (item) {
        return item + (obj[item] == 1 ? '' : ' ' + obj[item]);
    }).join('\n');


}

//  for (let [key, value] of obj) {
//    console.log(key + " = " + value);
//  }