var arrGetColor = [];//Массив для хранения  цветов состояний

var arrKeyCol = {};//Массив, у которого ключом яв-ся цвет, а значения состояния

var arrKeyColDuplicate = {};
var AutomatonDuplicate = {};

var numOfSplits = 1;//Переменная для хранения количеств разбиений

var finalSplit = [];// Массив для ввода пользователем минимального автомата

var lastSplit = false;

var AutomColor = {};

//Create arrayColors of options to be added
var arrayColors = ['#ffffff', '#FF9999', '#FF0066', '#CC00CC', '#FF9900', '#6699CC', '#CCCC00', '#00CC66', '#FF3300'];

//Хранение автомата в виде ассоциативного массива
var AutomatonWithOut = {
    'I/S': ['1', '2', '3', '4', '5', '6', '7', '8'],
    'a': ['7/0', '4/1', '7/0', '2/1', '4/1', '6/1', '8/0', '7/1'],
    'b': ['2/0', '4/1', '2/0', '2/1', '2/1', '7/1', '2/0', '4/1'],
    'c': ['2/1', '1/0', '2/1', '3/0', '7/0', '8/0', '6/1', '3/1']
};

//Копия автомата без выходов
var Automaton = {};
for (const key in AutomatonWithOut) {
    if (Object.hasOwnProperty.call(AutomatonWithOut, key)) {
        for (let i = 0; i < AutomatonWithOut[key].length; i++) {
            if (!(key in Automaton)) {
                Automaton[key] = [];
                Automaton[key].push(AutomatonWithOut[key][i].split('/')[0]);
            } else {
                Automaton[key].push(AutomatonWithOut[key][i].split('/')[0]);
            }
        }
    }
}

//Массив, у которого ключом яв-ся состояние автомата, а значения его выходы по каждому символу
var Outputs = {};
for (const key in AutomatonWithOut) {
    if (Object.hasOwnProperty.call(AutomatonWithOut, key)) {
        for (let i = 0; i < AutomatonWithOut[key].length; i++) {
            if ('I/S' == key) {
                Outputs[AutomatonWithOut[key][i]] = [];
            } else {
                Outputs[i + 1].push(AutomatonWithOut[key][i].split('/')[1])
            }
        }
    }
}

//Заполнение массива цветами, которыми пользователь окрасил состояния
function getColor() {
    arrGetColor = [];
    for (var i = 0; i < arrayColors.length - 1; i++) {
        arrGetColor.push(document.getElementsByClassName('select_el' + numOfSplits)[i].value);
    }
}

// Создаем объект, у которого ключом является состояние, а в значениях хранятс цвета переходов по каждому символу
function fillAutomColor() {
    AutomColor = {};
    for (const key in Automaton) {
        if (Object.hasOwnProperty.call(Automaton, key)) {
            for (let i = 0; i < Automaton[key].length; i++) {
                if ('I/S' == key) {
                    AutomColor[Automaton[key][i]] = [];
                } else {
                    AutomColor[i + 1].push(arrGetColor[Automaton[key][i] - 1]);
                }
            }
        }
    }
}

//Создание ассоциативного массива с ключом цвет
function fillArrKeyCol() {
    arrKeyCol = {};
    for (let i = 0; i < arrGetColor.length; i++) {
        if (!(arrGetColor[i] in arrKeyCol)) {
            arrKeyCol[arrGetColor[i]] = [];
            arrKeyCol[arrGetColor[i]].push(i + 1);

        } else {
            arrKeyCol[arrGetColor[i]].push(i + 1);
        }
    }
}

//Функция вывод образовавшегося разбиения
function createPstring(obj) {
    var Pstring = '';
    var div = document.createElement('div');
    div.className = 'Mydiv';
    Pstring = 'Разбиение P' + numOfSplits + '= {';
    let indexKey = 0;
    for (const key in obj) {
        indexKey++;
        if (Object.hasOwnProperty.call(obj, key)) {
            Pstring = Pstring + '{';
            for (let i = 0; i < obj[key].length; i++) {
                Pstring = Pstring + obj[key][i];
                if ((i + 1) != obj[key].length) Pstring = Pstring + ', ';
            }
            Pstring = Pstring + '}';
            if (indexKey != Object.keys(obj).length) Pstring = Pstring + ', ';
        }
    }
    Pstring = Pstring + '}';
    div.innerHTML = Pstring;
    div.style.display = 'block';
    document.body.appendChild(div);
    numOfSplits++;
}

//Функция вывод окна для ввода
function createInBox() {
    var div = document.createElement('div');
    div.className = 'Mydiv';
    let indexKey = 0;
    for (const key in arrKeyCol) {
        indexKey++;
        if (Object.hasOwnProperty.call(arrKeyCol, key)) {
            Pstring = Pstring + '{';
            for (let i = 0; i < arrKeyCol[key].length; i++) {
                Pstring = Pstring + arrKeyCol[key][i];
                if ((i + 1) != arrKeyCol[key].length) Pstring = Pstring + ', ';
            }
            Pstring = Pstring + '}';
            if (indexKey != Object.keys(arrKeyCol).length) Pstring = Pstring + ', ';
        }
    }
    Pstring = Pstring + '}';
    div.innerHTML = Pstring;
    div.style.display = 'block';
    document.body.appendChild(div);
    numOfSplits++;
}

//Кнопка подтверждения
function Confirmation(buttonId) {
    if (buttonId == 'buttonP' + numOfSplits) {
        if (confirm("Вы подтверждаете операцию?")) {
            getColor();
            fillArrKeyCol();
            if ((numOfSplits == 1) && (checkingOuts(Outputs) == true)) {
                createPstring(arrKeyCol);
                createTable(Automaton, arrKeyCol);
                var div = document.createElement('div');
                div.className = 'flex';
                createButton(false);
                createEndButton();
                document.body.appendChild(div);
                fillAutomColor();
                disableButton(buttonId);
            }
            else if ((numOfSplits > 1) && (checkingOuts(AutomColor) == true)) {
                disableButton(buttonId);
                disableButton('EndbuttonP' + numOfSplits);
                createPstring(arrKeyCol);
                createTable(Automaton, arrKeyCol);
                var div = document.createElement('div');
                div.className = 'flex';
                createButton(false);
                createEndButton();
                document.body.appendChild(div);
                fillAutomColor();
            }
            else alert("Неправильное разбиение");
            return (true);
        } else {
            alert("Подождем");
            return (false);
        }
    }
    else if (buttonId == 'LastButton') {
        if (confirm("Вы подтверждаете операцию?")) {
            var val = document.getElementById('inputP' + numOfSplits).value;
            val.split(' ');
            var jindex = 0;
            for (let index = 0; index < val.length; index += 2) {
                finalSplit[jindex] = val[index];
                jindex++;
            }
            createMinAut();
            lastSplit = true;
            createTable(AutomatonDuplicate, arrKeyColDuplicate);
            disableButton(buttonId);
            divF();
            return (true);
        }
        else {
            alert("Подождем");
            return (false);
        }
    }
}

//Функция создания таблицы
function createTable(arrLoc, arrKeyLoc) {
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    tbl.className = 'Mytable';
    var tbdy = document.createElement('tbody');
    for (const key in arrLoc) {
        if (Object.hasOwnProperty.call(arrLoc, key)) {
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(key));
            tr.appendChild(td);
            for (var j = 0; j < arrLoc[key].length; j++) {
                var td = document.createElement('td');
                if (lastSplit != true) colorizing(arrKeyLoc, arrLoc[key][j], td);
                td.appendChild(document.createTextNode(arrLoc[key][j]));
                if (key == 'I/S' && lastSplit != true) {
                    createSelect(td, j);
                }
                tr.appendChild(td);
            }
            tbdy.appendChild(tr);
        }
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}

//
function checkingOuts(localArr) {
    const keys = Object.keys(arrKeyCol);
    for (const key in arrKeyCol) {
        if (Object.hasOwnProperty.call(arrKeyCol, key)) {
            for (let i = 0; i < arrKeyCol[key].length; i++) {
                if ((i + 1) == arrKeyCol[key].length) break;
                for (let j = 0; j < localArr[arrKeyCol[key][i]].length; j++) {
                    if (localArr[arrKeyCol[key][i]][j] == localArr[arrKeyCol[key][i + 1]][j]) {
                        console.log('True', arrKeyCol[key][i], arrKeyCol[key][i + 1])
                    }
                    else {
                        console.log('False', arrKeyCol[key][i], arrKeyCol[key][i + 1]);
                        return false;
                    }
                }
            }
        }
    }
    if (keys.length > 1) {
        for (let i = 0; i < keys.length - 1; i++) {
            for (let j = i + 1; j < keys.length; j++) {
                var Index = 0;
                for (let k = 0; k < localArr[arrKeyCol[keys[0]][0]].length; k++) {
                    if (localArr[arrKeyCol[keys[i]][0]][k] == localArr[arrKeyCol[keys[j]][0]][k]) Index++;
                }
                if (Index == localArr[arrKeyCol[keys[0]][0]].length) {
                    console.log('Элементы разного цвета с одинаковыми выходами', arrKeyCol[keys[i]][0], ' и ', arrKeyCol[keys[j]][0]);
                    return false;
                } else console.log('Нет элементов разного цвета с одинаковыми выходами');

            }

        }
    }

    // for (const key in arrKeyCol) {
    //     if (Object.hasOwnProperty.call(arrKeyCol, key)) {
    //         for (let i = 0; i < arrKeyCol[key].length; i++) {

    //         }
    //     }
    // }
    // arrKeyColDuplicate = arrKeyCol;
    return true;
}

//Функция окрашивания ячеек
function colorizing(arr, value, td) {
    for (const key in arr) {
        if (Object.hasOwnProperty.call(arr, key)) {
            for (let i = 0; i < arr[key].length; i++) {
                if (value == arr[key][i]) {
                    td.style.backgroundColor = key;
                }

            }

        }
    }
}

//Функция создания списка с выбором цветов
function createSelect(element, index) {
    var myParent = element;

    //Create and append select list
    var selectList = document.createElement("select");

    //selectList.id = "mySelect"+numOfSplits;
    myParent.appendChild(selectList);
    selectList.className = 'select_el' + numOfSplits;
    //Create and append the options
    for (var i = 0; i < arrayColors.length; i++) {
        var option = document.createElement("option");
        // if(arrKeyCol!= 0 && i==0){
        //     for (const key in arrKeyCol) {
        //         if (Object.hasOwnProperty.call(arrKeyCol, key)) {
        //             for (let k = 0; k < arrKeyCol[key].length; k++) {
        //                 if(index==arrKeyCol[key][k]) option.value = key;
        //             }
        //         }
        //     }
        // }
        // else 
        option.value = arrayColors[i];
        //option.text = arrayColors[i];
        option.style.backgroundColor = arrayColors[i];
        selectList.appendChild(option);
    }

    selectList.addEventListener("change", function () {
        this.style.backgroundColor = this.value;
    });
}

function createButton(last) {
    var button = document.createElement('button');
    if (!last) button.id = 'buttonP' + numOfSplits;
    else button.id = 'LastButton';
    button.innerHTML = 'Подтвердить';
    button.className = 'buttonP';
    button.onclick = function () {
        Confirmation(button.id);
        return false;
    };
    document.body.appendChild(button);
}

function createEndButton() {
    var button = document.createElement('button');
    button.id = 'EndbuttonP' + numOfSplits;
    button.innerHTML = 'Завершить';
    button.className = 'buttonP';
    button.onclick = function () {
        end(button.id);
        return false;
    };
    document.body.appendChild(button);
}

function createMinAut() {
    numOfSplits--;

    //Происходит дублирование по одному состоянию из каждого класса (строится минимальный автомат)
    for (const key in AutomatonWithOut) {
        AutomatonDuplicate[key] = [];
        if (Object.hasOwnProperty.call(AutomatonWithOut, key)) {
            for (let i = 0; i < AutomatonWithOut[key].length; i++) {
                for (let j = 0; j < finalSplit.length; j++) {
                    if ((key != 'I/S') && (AutomatonWithOut['I/S'][i] == finalSplit[j]))
                        AutomatonDuplicate[key].push(AutomatonWithOut[key][i]);
                    else if (AutomatonWithOut['I/S'][i] == finalSplit[j])
                        AutomatonDuplicate[key].push(AutomatonWithOut[key][i]);
                }

            }
        }
    }

    //Переписывается объект с ключом цвет и значениям состояний минимального автомата, переименовываются состояния из одного класса
    for (const key1 in arrKeyCol) {
        if (Object.hasOwnProperty.call(arrKeyCol, key1)) {
            if (arrKeyCol[key1].length > 1) {
                arrKeyColDuplicate[key1] = [];
                for (var j = 0; j < arrKeyCol[key1].length; j++) {
                    for (let index = 0; index < finalSplit.length; index++) {
                        if (finalSplit[index] == arrKeyCol[key1][j]) {
                            for (var p = 0; p < arrKeyCol[key1].length; p++)
                                if (finalSplit[index] != arrKeyCol[key1][p]) {
                                    for (const key2 in AutomatonDuplicate) {
                                        if (Object.hasOwnProperty.call(AutomatonDuplicate, key2)) {
                                            for (let k = 0; k < AutomatonDuplicate[key2].length; k++) {
                                                if ((key2 != 'I/S') && (arrKeyCol[key1][p] == AutomatonDuplicate[key2][k].split('/')[0]))
                                                    AutomatonDuplicate[key2][k] = finalSplit[index] + '/' + AutomatonDuplicate[key2][k].split('/')[1];
                                            }
                                        }
                                    }
                                }
                            arrKeyColDuplicate[key1].push(arrKeyCol[key1][j]);
                        }
                    }
                }
            }
            else {
                arrKeyColDuplicate[key1] = [];
                arrKeyColDuplicate[key1].push(arrKeyCol[key1][0]);
            }
        }
    }
}

function createInput() {
    var input = document.createElement('input');
    input.type = "text";
    input.id = 'inputP' + numOfSplits;
    input.className = 'inputP';
    document.body.appendChild(input);
}

//Функция, которая вызывается при загрузке сайта
function start() {
    createTable(AutomatonWithOut);
    createButton(false);
}

function end(EndbuttonId) {
    if (confirm("Вы подтверждаете операцию?")) {
        if (EndbuttonId == 'EndbuttonP' + numOfSplits) {
            if (checkingOuts(AutomColor) == true) {
                var div = document.createElement('div');
                div.className = 'Information';
                div.innerHTML = 'Введите по одному состоянию из каждого класса через пробел. Например, если P={{1,2},{3,5},{4}}, то вводим: 1, 3, 4.';
                div.style.display = 'block';
                document.body.appendChild(div);
                createInput()
                createButton(true);
                disableButton('buttonP' + numOfSplits);
                disableButton(EndbuttonId);
            }
            else alert("Неправильно!");
        }
        else alert("Неправильно выбранны состояния");
        return (true);
    } else {
        alert("Подождем");
        return (false);
    }
}

function disableButton(buttonId) {
    var elem = document.getElementById(buttonId);
    elem.disabled = 'true';
    elem.classList.remove('buttonP');
    elem.style.background = 'lightgrey';

}


function divF(){
    var div = document.createElement('div');
    div.style.display = 'block';
    div.className = 'endBlock';
    document.body.appendChild(div);
}