console.log("calv2");

let arrayRecordData = [];

// My function
const myfunction = async function (x, y) {
    return [
        x,
        y,
    ];
}

// Start function
const start = async function (a, b) {
    const result = await myfunction('test', 'test');

    console.log(result);
    arrayDefault();
    printSelected();
    const result2 = await CalForSelect();
    console.log(result2);
}


function arrayDefault() {

    for (let index = 0; index < 14; index++) {
        arrayRecordData[index] = "any";

    }

}

// function printSelected() {
//     var html = "";
//     var temple1 = `<div class="cal cal-selected `
//     var temple2 = `"><img src="../img/common/MJ`;

//     var temple3 = `.svg" alt=""></div>`;

//     for (let index = 0; index < 14; index++) {
//         html = html + temple1;
//         if (index == 13) {
//             // html = html + `rotate90`;
//         }
//         html = html + temple2;

//         html = html + arrayRecordData[index];
//         if (arrayRecordData[index] != "any") {
//             html = html + `-`;
//         }
//         html = html + temple3;

//     }

//     document.querySelector(".cal-selected").innerHTML = html;

// }

function printSelected() {
    var html = "";
    var temple1 = `<div class="cal cal-selected `
    var temple2 = `"><img src="../img/common/MJ`;

    var temple3 = `.svg" alt=""></div>`;

    // for (let index = 0; index < 14; index++) {
    //     html = html + temple1;
    //     if (index == 13) {
    //         // html = html + `rotate90`;
    //     }
    //     html = html + temple2;

    //     html = html + arrayRecordData[index];
    //     if (arrayRecordData[index] != "any") {
    //         html = html + `-`;
    //     }
    //     html = html + temple3;

    // }

    document.querySelector(".cal-selected").innerHTML = html;

}


async function CalForSelect() {
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
                        checkInit();
                    }
                    break;
                }

            }
            printSelected();

        })
    });

    return true;
}

start();