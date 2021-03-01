var arrGetColor = [];//Массив для хранения  цветов состояний
var arrKeyCol = {};//Массив, у которого ключом яв-ся цвет, а значения состояния
//Переменная для вывода разбиения
var numOfSplits = 1;//Переменная для хранения количеств разбиений
var AutomColor = {};
//Create arrayColors of options to be added
var arrayColors = ['#ffffff', '#FF9999', '#FF0066', '#CC00CC', '#FF9900', '#6699CC', '#CCCC00', '#00CC66', '#FF3300'];

//Хранение автомата в виде ассоциативного массива
var AutomatonWithOut = {
    'I/S': ['1', '2', '3', '4', '5', '6', '7', '8'],
    'a': ['7/0', '4/1', '7/0', '2/1', '7/1', '6/1', '8/0', '7/1'],
    'b': ['2/0', '4/1', '2/0', '2/1', '7/1', '7/1', '2/0', '4/1'],
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

//Массив, у которого ключом яв-ся состояние автомата, а значения его выходы
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
    AutomColor = {};
    for (var i = 0; i < arrayColors.length - 1; i++) {
        arrGetColor.push(document.getElementsByClassName('select_el' + numOfSplits)[i].value);
    }
    for (const key in Automaton) {
        if (Object.hasOwnProperty.call(Automaton, key)) {
            for (let i = 0; i < Automaton[key].length; i++) {
                if ('I/S' == key) {
                    AutomColor[Automaton[key][i]] = [];
                } else {
                    AutomColor[i + 1].push(arrGetColor[Automaton[key][i]-1]);
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
function createPstring() {
    var Pstring = '';
    var div = document.createElement('div');
    div.className = 'Mydiv';
    Pstring = 'Разбиение P' + numOfSplits + '= { ';
    for (const key in arrKeyCol) {
        if (Object.hasOwnProperty.call(arrKeyCol, key)) {
            Pstring = Pstring + '{ ';
            for (let i = 0; i < arrKeyCol[key].length; i++) {
                Pstring = Pstring + arrKeyCol[key][i];
                if ((i + 1) != arrKeyCol[key].length) Pstring = Pstring + ', ';
            }
            Pstring = Pstring + ' }';
        }
    }
    Pstring = Pstring + ' }';
    div.innerHTML = Pstring;
    div.style.display = 'block';
    document.body.appendChild(div);
    numOfSplits++;
}

//Кнопка подтверждения
function Confirmation() {
    if (confirm("Вы подтверждаете операцию?")) {
        getColor();
        fillArrKeyCol();
        if ((checkingOuts(Outputs) == true) && (numOfSplits == 1)) {
            createPstring();
            createTable(Automaton);
            createButton();
        }
        else if ((numOfSplits > 1)&&(checkingOuts(AutomColor) == true)) {
            createPstring();
            createTable(Automaton);
            createButton();
        }
        else alert("Неправильное разбиение");
        return (true);
    } else {
        alert("Подождем");
        return (false);
    }
}

//Функция создания таблицы
function createTable(arrLoc) {
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
                colorizing(arrKeyCol, arrLoc[key][j], td);
                td.appendChild(document.createTextNode(arrLoc[key][j]));
                if (key == 'I/S') {
                    createSelect(td);
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
    return true;
}

// //
// function chekingState() {
//     for (const key in object) {
        
//     }
// }

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
function createSelect(element) {
    var myParent = element;

    //Create and append select list
    var selectList = document.createElement("select");

    //selectList.id = "mySelect"+numOfSplits;
    myParent.appendChild(selectList);
    selectList.className = 'select_el' + numOfSplits;
    //Create and append the options
    for (var i = 0; i < arrayColors.length; i++) {
        var option = document.createElement("option");
        option.value = arrayColors[i];
        //option.text = arrayColors[i];
        option.style.backgroundColor = arrayColors[i];
        selectList.appendChild(option);
    }

    selectList.addEventListener("change", function () {
        this.style.backgroundColor = this.value;
    });
}

function createButton() {
    var button = document.createElement('button');
    button.innerHTML = 'Подтвердить';
    button.className = 'buttonP';
    button.onclick = function () {
        Confirmation();
        return false;
    };
    document.body.appendChild(button);
    //className = 'buttonP' + numOfSplits
}

//Функция, которая вызывается при загрузке сайта
function start() {
    createTable(AutomatonWithOut);
    createButton();
}

// //Преобразование string в hex
// function ConvertStringToHex(str) {
//     var arr = [];
//     for (var i = 0; i < str.length; i++) {
//         arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
//     }
//     return "\\u" + arr.join("\\u");
// }

    // $(document).ready(function(){
    //     $('select').on('change',function(){
    //       $(this).css({color: $(this).find('option:selected').data('color')});
    //     });
    //   }); 
    //<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>