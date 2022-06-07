let arrayRecordData = [];

// let arrayDefault = ["any", "any", "any", "any", "any", "any",
// "any", "any", "any", "any", "any", "any", "any"];

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


function printSelected() {
    var html = "";
    var temple1 = `<div class="cal cal-selected `
    var temple2 = `"><img src="../img/common/MJ`;

    var temple3 = `.svg" alt=""></div>`;

    for (let index = 0; index < 14; index++) {
        html = html + temple1;
        if (index == 13) {
            // html = html + `rotate90`;
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
    if (document.querySelector(".ShowAll-page.modal") == null) {
        console.log("empty");
    }
}

async function checkInit() {

    arrayRecordData.sort();
    console.log(arrayRecordData);

    // 順 s
    // 碰 p
    // 槓 k
    // 眼 n

    var finalArray = {};

    for (let index = 0; index < arrayRecordData.length; index++) {
        let test = arrayRecordData[index];
        finalArray[index] = { name: test, used: 0 };
        // finalArray[test] = { [index]: 0 };
    }

    console.log(finalArray);

    var type = {};
    var obj = {};

    // defind obj
    for (let index = 0; index < Object.keys(finalArray).length; index++) {
        var same = 1;
        for (let x = index + 1; x < Object.keys(finalArray).length + 1; x++) {
            // console.log(finalArray[index].name);
            // console.log(finalArray[x].name);
            if (typeof finalArray[x] == 'undefined') {
                obj[Object.keys(obj).length] = { name: finalArray[index].name, same: same };
                index = x - 1;
                break;
            }

            if (finalArray[index].name == finalArray[x].name) {
                same = same + 1;
            } else {
                obj[Object.keys(obj).length] = { name: finalArray[index].name, same: same };
                index = x - 1;
                break;
            }

        }


    }

    // define type

    for (let index = 0; index < Object.keys(finalArray).length; index++) {
        var same = 1;
        for (let x = index + 1; x < Object.keys(finalArray).length + 1; x++) {
            // console.log(finalArray[index].name.charAt(0));
            // console.log(finalArray[x].name.charAt(0));
            if (typeof finalArray[x] == 'undefined') {
                type[Object.keys(type).length] = { name: finalArray[index].name.charAt(0), sameType: same };
                index = x - 1;

                break;
            }

            if (finalArray[index].name.charAt(0) == finalArray[x].name.charAt(0)) {
                same = same + 1;
            } else {
                type[Object.keys(type).length] = { name: finalArray[index].name.charAt(0), sameType: same };
                index = x - 1;
                break;
            }

        }


    }

    console.log(type);
    console.log(obj);


    let typeLength = Object.keys(type).length;
    let objLength = Object.keys(obj).length;

    console.log(typeLength);
    console.log(objLength);

    // document.getElementById('output').innerHTML = Object.keys(obj).map(function (item) {
    //     return item + (obj[item] == 1 ? '' : ' ' + obj[item]);
    // }).join('\n');

    let checkResult = checkLegit(obj, objLength);

    if (checkResult == true) { // start check

        console.log(obj);

        console.log(Object.keys(obj).length);

        // (async function loop() {
        //     for (let i = 0; i < 10; i++) {
        //         await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
        //         console.log(i);
        //     }
        // })();

        // for (let i = 0, p = Promise.resolve(); i < Object.keys(obj).length; i++) {
        //     p = p.then(_ => new Promise(resolve => {
        //         console.log(i);
        //         console.log(p);

        //         if (obj[i].same >= 2) {
        //             test123(finalArray, type, obj[i]).then((final) => {
        //                 console.log(final);

        //                 if (final[0] = true) {
        //                     return final;

        //                 }
        //                 console.log("resolved 1");


        //             })


        //         } else {
        //             resolve(console.log("resolve else"));
        //         }

        //     }));

        // }

        console.log(Object.keys(obj).length);
        someProcedure(Object.keys(obj).length, finalArray, type, obj).then(x =>
            console.log(x)
        )
            .then((result) => {
                console.log("12333");
                console.log({ result });
            }); // => Promise

    }
    // return console.log("finish check");

}

const someProcedure = async (n, finalArray, type, obj) => {
    for (let i = 0; i < n; i++) {
        const t = Math.random() * 1000;
        const x = await new Promise(r => setTimeout(r, t, i));

        console.log({ n, i, x });

        const val1 = await new Promise((test123) => validmj(finalArray, type, obj[i]));

        console.log(test123);

        console.log(val1);

        if (val1 == true) {

            return Promise.resolve(true);
        }
        if ((i + 1) == n) {

            return Promise.resolve(false);

        }

        return Promise.resolve(true);


    }


}


async function validmj(finalArray, type, obj) {

    console.log({ finalArray, type, obj });


    try {
        var val1 = await setEye(finalArray, obj); //delete eye

        var val2 = await checkSequenceOrTriple(val1);

        // var val2 = await resetEye(val1);

        if (val2 == false) {
            console.log(" val2 = false");
        }


        console.log("Final: ", val2);

        // return console.log(Date.now());

        return Promise.resolve(val2);

    }
    catch (err) {
        console.error(err);
    }
    console.log("finish");
    return Promise.resolve(false);

}

function resetEye(finalArray) {
    for (let index = 0; index < Object.keys(finalArray).length; index++) {
        finalArray[index].used = 0;
    }
    return finalArray;
}

function setEye(finalArray, obj) {

    console.log("-------------set eye ----------");
    console.log({ finalArray, obj });

    let index = 0;


    for (var i = 0; i < Object.keys(finalArray).length; i++) {
        if (index >= 2) {
            i = Object.keys(finalArray).length;
            break;
        }
        console.log(i);
        console.log(finalArray[i].name);

        if (finalArray[i].name == obj.name) {
            delete finalArray[i];
            index = index + 1;

        }
    }


    console.log({ finalArray, index });

    // return finalArray;
    return Promise.resolve(finalArray);
}

async function checkSequenceOrTriple(finalArray) {
    console.log(finalArray);
    let tri = 0;
    let seq = 0;


    for (const [key] of Object.entries(finalArray)) {
        let find = false;
        console.log(finalArray[key]);
        console.log(finalArray[key].used);
        if (finalArray[key].used == 0) {

            value = await checkTriple(finalArray, key);

            finalArray = value[0];
            find = value[1];

            if (value[1] == true) {
                tri = tri + 1;
                continue;
            }

            // console.log(finalArray);
            // console.log(find);

            value2 = await checkSequence(finalArray, key);

            finalArray = value[0];
            find = value[1];

            if (value[1] == true) {
                seq = seq + 1;
                continue;
            }

        }
    }

    console.log((tri + seq) == 4);
    if ((tri + seq) == 4) {
        // return [true, tri, seq];
        return Promise.resolve([true, tri, seq]);
    }


    return Promise.resolve(false);
}

//check at least 1 pair eye
function checkLegit(obj, objLength) {

    if (objLength == 14) {
        return false;
    }
    for (let index = 0; index < objLength; index++) {
        console.log(obj[index]);

        if (obj[index].same == 2) {
            console.log("true");
            return true;
        }

    }

    console.log("false");

    return false;

}


async function checkTriple(finalArray, index) {
    console.log("checkTriple");

    index = parseInt(index, 10);

    // console.log(finalArray);
    // console.log(finalArray[index].name);
    // console.log(finalArray[index + 1].name);
    // console.log(finalArray[index + 2].name);

    if (finalArray[index].name == finalArray[(index + 1)].name && finalArray[(index + 1)].name == finalArray[(index + 2)].name) {
        console.log("Triple");
        finalArray[index].used = 1;
        finalArray[index + 1].used = 1;
        finalArray[index + 2].used = 1;
        console.log(finalArray);

        return [finalArray, true];
    }

    console.log(finalArray);

    return [finalArray, false];

}


async function checkSequence(finalArray, index) {

    console.log("---checkSequence---");

    index = parseInt(index, 10);
    console.log(index);
    // console.log(typeof index);

    console.log(finalArray[index].name);
    console.log(finalArray[index + 1].name);
    console.log(finalArray[index + 2].name);

    let nameA = finalArray[index].name;
    let nameB = finalArray[index + 1].name;
    let nameC = finalArray[index + 2].name;

    console.log(nameA, nameB, nameC);

    let name1x = nameA.charAt(0);
    let name2x = nameB.charAt(0);
    let name3x = nameC.charAt(0);

    let namex1 = nameA.charAt(1);
    let namex2 = nameB.charAt(1);
    let namex3 = nameC.charAt(1);
    console.log(typeof namex1);

    if (name1x == name2x && name2x == name3x) {
        console.log(namex1, namex2, namex3);
        if (namex1 + 1 == namex2 && namex2 == namex3) {
            finalArray[index].used = 1;
            finalArray[index + 1].used = 1;
            finalArray[index + 2].used = 1;
            console.log("true");
            return [finalArray, true];
        }
    }
    console.log("false");

    return [finalArray, false];
}



//  for (let [key, value] of obj) {
//    console.log(key + " = " + value);
//  }

start();