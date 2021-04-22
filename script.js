var arrGetColor = [];//Массив для хранения  цветов состояний

var arrKeyCol = {};//Объект, у которого ключом яв-ся цвет, а значения состояния
var arrKeyMin = {};

var arrKeyColDuplicate = {};//Хранит в себе предыдущие параметры arrKeyCol

var numOfSplits = 1;//Переменная для хранения количеств разбиений

var finalSplit = [];// Массив для ввода пользователем минимального автомата

var lastSplit = false;//Булева переменная, для хранении информации о последнем разбиении
var confirmEnd;
var confirmT;

var AutomColor = {};//объект с ключом состояние, а в значениях хранятся цвета переходов по каждому символу


var string1 = 'Постройте разбиение P1, т.е раскрасьте 1-эквивалентные состояния. Нажмите "Подтвердить", чтобы убедиться, что ваше разбиение верно.';
var string2 = 'В дальнейшем вам необходимо перекрашивать лишь те состояния, которые образовали отдельный класс. Постройте разбиение P2. Если вы считаете, что текущее разбиение совпадает с предыдущим, то нажмите "Завершить"';
var string3 = 'Введите по одному состоянию из каждого класса через пробел. Например, если P={{1,2},{3,5},{4}}, то вводим: 1 3 4. Согласно выбранным состояниям будет построена минимальная форма';

//Create arrayColors of options to be added
var colors = ['#ffffff', '#FF9999', '#FF0066', '#CC00CC', '#FF9900', '#6699CC', '#CCCC00', '#00CC66', '#FF3300'];
var arrayColors =[];
//Хранение автомата в виде ассоциативного массива
var AutomatonWithOut0 = {
    'I/S': ['1', '2', '3', '4', '5', '6', '7', '8'],
    'a': ['7/0', '4/1', '7/0', '2/1', '4/1', '6/1', '8/0', '7/1'],
    'b': ['2/0', '4/1', '2/0', '2/1', '2/1', '7/1', '2/0', '4/1'],
    'c': ['2/1', '1/0', '2/1', '3/0', '7/0', '8/0', '6/1', '3/1']
};
var AutomatonWithOut1 = {
    'I/S': ['1', '2', '3', '4', '5', '6', '7', '8'],
    'a': ['1/0', '1/0', '1/1', '5/1', '5/0', '6/1', '5/0', '8/1'],
    'b': ['6/1', '8/1', '7/0', '2/0', '1/1', '5/0', '2/1', '5/0'],
};
var AutomatonWithOut2 = {
    'I/S': ['1', '2', '3', '4', '5', '6', '7'],
    'a': ['3/0', '4/0', '1/0', '3/0', '4/1', '6/0', '7/0'],
    'b': ['4/1', '6/1', '2/1', '1/1', '1/1', '7/1', '5/1'],
    'c': ['1/1', '6/1', '4/1', '4/1', '7/0', '1/1', '3/1']
};
var AutomatonWithOut3 = {
    'I/S': ['1', '2', '3', '4', '5', '6'],
    'a': ['2/0', '1/1', '6/0', '1/0', '2/1', '1/1',],
    'b': ['3/0', '2/0', '3/0', '5/0', '5/0', '6/0',],
};

var setOfAuts = [AutomatonWithOut0, AutomatonWithOut1, AutomatonWithOut2, AutomatonWithOut3];
var item = setOfAuts[Math.floor(Math.random() * setOfAuts.length)];

for (let i = 0; i < item['I/S'].length; i++) {
    arrayColors.push(colors[i]);
}

var AutomatonWithOut = item;

//Копия автомата без выходов
var Automaton = {};
var AutomatonMin = {};
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

//Проверка правильности очередного разбиения
function checkingOuts(localArr) {
    const keys = Object.keys(arrKeyCol);
    for (const key in arrKeyCol) {
        if (Object.hasOwnProperty.call(arrKeyCol, key)) {
            for (let i = 0; i < arrKeyCol[key].length; i++) {
                if ((i + 1) == arrKeyCol[key].length) break;
                for (let j = 0; j < localArr[arrKeyCol[key][i]].length; j++) {
                    if (localArr[arrKeyCol[key][i]][j] != localArr[arrKeyCol[key][i + 1]][j]) {
                        //console.log('False', arrKeyCol[key][i], arrKeyCol[key][i + 1]);
                        return false;
                    }
                    else {
                        //console.log('True', arrKeyCol[key][i], arrKeyCol[key][i + 1]) 
                    }
                }
            }
        }
    }
    if (keys.length > 1 && numOfSplits == 1) {
        for (let i = 0; i < keys.length - 1; i++) {
            for (let j = i + 1; j < keys.length; j++) {
                var Index = 0;
                for (let k = 0; k < localArr[arrKeyCol[keys[0]][0]].length; k++) {
                    if (localArr[arrKeyCol[keys[i]][0]][k] == localArr[arrKeyCol[keys[j]][0]][k]) Index++;
                }
                if (Index == localArr[arrKeyCol[keys[0]][0]].length) {
                    //console.log('Элементы разного цвета с одинаковыми выходами', arrKeyCol[keys[i]][0], ' и ', arrKeyCol[keys[j]][0]);
                    return false;
                } //else console.log('Нет элементов разного цвета с одинаковыми выходами');

            }

        }
    }

    return true;
}

//Проверяем правильно ли пользователь ввел состояния в окно ввода
function checkInputStates() {
    finalSplit = [];
    var val = document.getElementById('inputP' + numOfSplits).value;
    val.split(' ');
    var jindex = 0;
    for (let index = 0; index < val.length; index += 2) {
        finalSplit[jindex] = val[index];
        jindex++;
    }
    if (finalSplit.length == Object.keys(arrKeyCol).length) {
        var hasAllStates = 0;
        for (const key in arrKeyCol) {
            var index = 0;
            if (Object.hasOwnProperty.call(arrKeyCol, key)) {
                for (let i = 0; i < arrKeyCol[key].length; i++) {
                    for (let j = 0; j < finalSplit.length; j++) {
                        if (finalSplit[j] == arrKeyCol[key][i]) {
                            index++
                            hasAllStates++;
                        };
                        if (index > 1) {
                            //console.log(index);
                            return false;
                        }
                    }

                }
            }
        }
        if (hasAllStates == finalSplit.length)
            return true;
    }
    else return false;
}

//Проверяем новая раскраска у автомата или нет
function chekingSimilarP() {
    var similarP = true;
    for (const key in arrKeyCol) {
        if (Object.hasOwnProperty.call(arrKeyCol, key) && Object.hasOwnProperty.call(arrKeyColDuplicate, key)) {
            if (arrKeyColDuplicate[key].length == arrKeyCol[key].length)
                for (let i = 0; i < arrKeyCol[key].length; i++) {
                    if (arrKeyColDuplicate[key][i] != arrKeyCol[key][i]) similarP = false;
                }
            else similarP = false;
        }
        else similarP = false;
    }

    if (similarP == false) {
        arrKeyColDuplicate = {};
        for (const key in arrKeyCol) {
            if (Object.hasOwnProperty.call(arrKeyCol, key)) {
                arrKeyColDuplicate[key] = [];
                for (let i = 0; i < arrKeyCol[key].length; i++) {
                    arrKeyColDuplicate[key].push(arrKeyCol[key][i]);
                }
            }
        }
        return false;
    }
    else {
        return true;
    }
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

//Кнопка подтверждения
function Confirmation(buttonId) {
    if (buttonId == 'buttonP' + numOfSplits) {
        if (confirmT == true) {
            getColor();
            fillArrKeyCol();
            if ((numOfSplits == 1) && (checkingOuts(Outputs) == true) && chekingSimilarP() == false) {
                disableButton(buttonId);
                createPstring(arrKeyCol);
                Information(string2);
                //removeColor();
                createTable(Automaton, arrKeyCol);
                twoButtons();
                fillAutomColor();

            }
            else if ((numOfSplits > 1) && (checkingOuts(AutomColor) == true) && chekingSimilarP() == false) {
                disableButton(buttonId);
                disableButton('EndbuttonP' + numOfSplits);
                disableButton('tableB' + numOfSplits);
                createPstring(arrKeyCol);
                Information('Постройте разбиение P' + numOfSplits + '. Если вы считаете, что текущее разбиение совпадает с предыдущим, то нажмите "Завершить"');
                //removeColor();
                createTable(Automaton, arrKeyCol);
                twoButtons();
                fillAutomColor();
            }
            else myAlert("Неправильное разбиение");
            return (true);
        } else {
            myAlert("Подождем");
            return (false);
        }
    }
    else if (buttonId == 'LastButton') {
        if (confirmT == true) {
            if (checkInputStates() == true) {
                disableButton(buttonId);
                createMinAut();
                lastSplit = true;
                myAlert("Поздравляем, вы справились!");
                Information('Минимальная форма исходного автомата:');
                createTable(AutomatonMin, arrKeyMin);
            }
            else myAlert("Неправильно введены состояния!");
            return (true);
        }
        else {
            myAlert("Подождем");
            return (false);
        }
    }
}

//Создаем всплывающее окно информации
function myAlert(text) {
    var divpop = document.createElement('div');
    divpop.className = 'b-popup';

    var divcontent = document.createElement('div');
    divcontent.className = 'b-popup-content';

    divcontent.innerHTML = text;

    var divbutton = document.createElement('div');
    divbutton.className = 'b-popup_button';
    var button = document.createElement('button');
    button.className = "b_button";
    button.innerHTML = 'Ок';
    button.onclick = function () {
        divpop.style.visibility = 'hidden';
        return false;
    };
    divbutton.appendChild(button);
    divcontent.appendChild(divbutton);
    divpop.appendChild(divcontent);
    document.body.appendChild(divpop);
}

//Кнопка для подтверждения очередного разбиения
function createButton(last, appendBody) {
    var button = document.createElement('button');
    if (!last) button.id = 'buttonP' + numOfSplits;
    else button.id = 'LastButton';
    button.innerHTML = 'Подтвердить';
    button.className = 'buttonP';
    button.onclick = function () {
        confirmEnd = false;
        createConfirm(button.id, confirmEnd);
        return false;
    };
    appendBody.appendChild(button);
}

//Создаем всплывающее окно подтверждения
function createConfirm(buttonId, conformEnd) {
    var divpop = document.createElement('div');
    divpop.className = 'b-popup';

    var divcontent = document.createElement('div');
    divcontent.className = 'b-popup-content';

    divcontent.innerHTML = "Вы подтверждаете операцию?";

    var divbutton = document.createElement('div');
    divbutton.className = 'b-popup_button';
    var button1 = document.createElement('button');
    button1.className = "b_button";
    button1.innerHTML = 'Да';
    button1.onclick = function myconfirm() {
        divpop.style.visibility = 'hidden';
        confirmT = true;
        if (conformEnd == false) Confirmation(buttonId);
        else end(buttonId);
        return false;
    };
    var button2 = document.createElement('button');
    button2.className = "b_button";
    button2.innerHTML = 'Нет';
    button2.onclick = function myconfirm() {
        divpop.style.visibility = 'hidden';
        confirmT = false;
        if (conformEnd == false) Confirmation(buttonId);
        else end(buttonId);
        return false;
    };
    divbutton.appendChild(button1);
    divbutton.appendChild(button2);
    divcontent.appendChild(divbutton);
    divpop.appendChild(divcontent);
    document.body.appendChild(divpop);
}

//Кнопка для завершения разбиения автомата
function createEndButton(appendBody) {
    var button = document.createElement('button');
    button.id = 'EndbuttonP' + numOfSplits;
    button.innerHTML = 'Завершить';
    button.className = 'buttonP';
    button.onclick = function () {
        confirmEnd = true;
        createConfirm(button.id, confirmEnd)
        return false;
    };
    appendBody.appendChild(button);
}

//Создание поля для ввода состояний минимального автомата
function createInput() {
    var input = document.createElement('input');
    input.type = "text";
    input.id = 'inputP' + numOfSplits;
    input.className = 'inputP';
    document.body.appendChild(input);
}

//Создание таблицы переходов-выходов минимального автомата
function createMinAut() {
    numOfSplits--;

    //Происходит дублирование по одному состоянию из каждого класса (строится минимальный автомат)
    for (const key in AutomatonWithOut) {
        AutomatonMin[key] = [];
        if (Object.hasOwnProperty.call(AutomatonWithOut, key)) {
            for (let i = 0; i < AutomatonWithOut[key].length; i++) {
                for (let j = 0; j < finalSplit.length; j++) {
                    if ((key != 'I/S') && (AutomatonWithOut['I/S'][i] == finalSplit[j]))
                        AutomatonMin[key].push(AutomatonWithOut[key][i]);
                    else if (AutomatonWithOut['I/S'][i] == finalSplit[j])
                        AutomatonMin[key].push(AutomatonWithOut[key][i]);
                }

            }
        }
    }

    //Переписывается объект с ключом цвет и значениям состояний минимального автомата, переименовываются состояния из одного класса
    for (const key1 in arrKeyCol) {
        if (Object.hasOwnProperty.call(arrKeyCol, key1)) {
            if (arrKeyCol[key1].length > 1) {
                arrKeyMin[key1] = [];
                for (var j = 0; j < arrKeyCol[key1].length; j++) {
                    for (let index = 0; index < finalSplit.length; index++) {
                        if (finalSplit[index] == arrKeyCol[key1][j]) {
                            for (var p = 0; p < arrKeyCol[key1].length; p++)
                                if (finalSplit[index] != arrKeyCol[key1][p]) {
                                    for (const key2 in AutomatonMin) {
                                        if (Object.hasOwnProperty.call(AutomatonMin, key2)) {
                                            for (let k = 0; k < AutomatonMin[key2].length; k++) {
                                                if ((key2 != 'I/S') && (arrKeyCol[key1][p] == AutomatonMin[key2][k].split('/')[0]))
                                                    AutomatonMin[key2][k] = finalSplit[index] + '/' + AutomatonMin[key2][k].split('/')[1];
                                            }
                                        }
                                    }
                                }
                            arrKeyMin[key1].push(arrKeyCol[key1][j]);
                        }
                    }
                }
            }
            else {
                arrKeyMin[key1] = [];
                arrKeyMin[key1].push(arrKeyCol[key1][0]);
            }
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
    document.body.appendChild(div);
    numOfSplits++;
}

//Функция создания списка с выбором цветов
function createSelect(element, State) {
    var myParent = element;

    //Создается атрибут select
    var selectList = document.createElement("select");

    //selectList.id = "mySelect"+numOfSplits;
    myParent.appendChild(selectList);
    selectList.className = 'select_el' + numOfSplits;

    //Создаются атрибуты option
    for (var i = 0; i < arrayColors.length; i++) {
        var option = document.createElement("option");
        option.value = arrayColors[i];
        if (arrKeyCol != 0) {
            for (const key in arrKeyCol) {
                if (Object.hasOwnProperty.call(arrKeyCol, key) && key == arrayColors[i]) {
                    for (let k = 0; k < arrKeyCol[key].length; k++) {
                        if (State == arrKeyCol[key][k]) {
                            //console.log(State);
                            //console.log(arrKeyCol[key][k]);
                            option.selected = 'selected';
                            //console.log(arrayColors[i]);
                            //console.log('----');
                        }
                    }
                }
            }
        }
        option.style.backgroundColor = arrayColors[i];
        selectList.appendChild(option);
    }

    selectList.addEventListener("change", function () {
        this.style.backgroundColor = this.value;
    });
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
                    createSelect(td, arrLoc[key][j]);
                }
                tr.appendChild(td);
            }
            tbdy.appendChild(tr);
        }
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}

//Отключение кнопок, с которыми пользователь уже взаимодействовал
function disableButton(buttonId) {
    var elem = document.getElementById(buttonId);
    elem.style.visibility = 'hidden';
    elem.style.display = 'none';
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

//Заполнение массива цветами, которыми пользователь окрасил состояния
function getColor() {
    arrGetColor = [];
    for (var i = 0; i < arrayColors.length; i++) {
        arrGetColor.push(document.getElementsByClassName('select_el' + numOfSplits)[i].value);
    }
}

// Вывод блока и необходимой информацией
function Information(informationString) {
    var div = document.createElement('div');
    div.className = 'Information';
    if (lastSplit) div.style.textAlign = 'center';
    div.innerHTML = informationString;
    div.style.display = 'block';
    document.body.appendChild(div);
}

//Таблица из двух ячеек, используемая для удобства расположения двух кнопок рядом
function twoButtons() {
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    tbl.id = 'tableB' + numOfSplits;
    tbl.className = 'flex';
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');
    tr.className = 'flex';
    var td = document.createElement('td');
    td.className = 'flex';
    createButton(false, td);
    tr.appendChild(td);
    var td = document.createElement('td');
    td.className = 'flex';
    createEndButton(td);
    tr.appendChild(td);
    tbdy.appendChild(tr);
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}

//Функция, которая вызывается при загрузке сайта
function start() {
    Information(string1);
    createTable(AutomatonWithOut);
    createButton(false, document.body);
}

//Функция, которая вызывается при нажатии на кнопку "Завершить"
function end(EndbuttonId) {
    if (confirmT == true) {
        if (EndbuttonId == 'EndbuttonP' + numOfSplits) {
            if (checkingOuts(AutomColor) == true) {
                disableButton('buttonP' + numOfSplits);
                disableButton('tableB' + numOfSplits);
                disableButton(EndbuttonId);
                Information(string3);
                createInput()
                createButton(true, document.body);

            }
            else myAlert("Вы построили не все разбиения!");
        }
        else myAlert("Вы построили не все разбиения!");
        return (true);
    } else {
        myAlert("Подождем");
        return (false);
    }
}