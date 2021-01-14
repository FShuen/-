//#inital begin
let container = document.getElementById("container");
let board = new Array();

for (let i = 0; i < 8; i++) {
    board[i] = new Array();
}

let value = new Array();

for (let i = 0; i < 8; i++) {
    value[i] = new Array();
}
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        value[i][j] = 0;
    }
}

//估值表
let vtable = [[100, -5, 10,  5,  5, 10, -5,100],
              [ -5,-45,  1,  1,  1,  1,-45, -5],
              [ 10,  1,  3,  2,  2,  3,  1, 10],
              [  5,  1,  2,  1,  1,  2,  1,  5],
              [  5,  1,  2,  1,  1,  2,  1,  5],
              [ 10,  1,  3,  2,  2,  3,  1, 10],
              [ -5,-45,  1,  1,  1,  1,-45, -5],
              [100, -5, 10,  5,  5, 10, -5,100]];

//棋盤上的方格
class Square {
    constructor(i, j) {
        this.node = document.createElement("div");
        this.node.setAttribute("class", "square");
        this.node.style.backgroundColor = 'sandybrown';

        this.chessman = document.createElement("div");
        this.chessman.setAttribute("class", "square s0");
        this.chessman.setAttribute('id', String(i) + '-' + String(j))
        this.node.appendChild(this.chessman);
    }
    setpiece(i) {
        this.chessman.setAttribute("class", "square s" + i);
    }
}

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        board[i].push(new Square(i, j));
        container.appendChild(board[i][j].node);
        board[i][j].node.setAttribute('id', 'inactive');
    }
}

//一開始中間那四顆
board[3][3].setpiece(1);
board[4][4].setpiece(1);
board[3][4].setpiece(2);
board[4][3].setpiece(2);
value[3][3] = 1;
value[4][4] = 1;
value[3][4] = 2;
value[4][3] = 2;

//電腦戰績(localstorage)
var wins = JSON.parse(localStorage.getItem('win'));
var loses = JSON.parse(localStorage.getItem('lose'));
var ties = JSON.parse(localStorage.getItem('tie'));
if(wins == null){
    wins = 0;
}
if(loses == null){
    loses = 0;
}
if(ties == null){
    ties = 0;
}
let p= wins/(loses+ties+wins)*100.0;
p = Math.round(p * 100) / 100;
$('.AIgrade').html('電腦戰績:'+wins+'勝'+loses+'負'+ties+'和&nbsp;&nbsp;勝率:'+p+'%');


//黑棋(玩家)要先下
function blackfirst() {
    blackActive();
    $('.btn.bblack').hide();
    $('.btn.bwhite').hide();
    $('#choose').hide();
}

//白棋(電腦)要先下
function whitefirst() {
    whiteActive();
    $('.btn.bblack').hide();
    $('.btn.bwhite').hide();
    $('#choose').hide();
}
//initial end



//玩家選擇要下的地方
function click(e) {
    e = e;
    var name = e.target.getAttribute('id');
    var s = name.split('-');
    let x = parseInt(s[0]);
    let y = parseInt(s[1]);
    black_go(x, y);
    init();

    setTimeout(function () {
        if (total == 64) {
            setTimeout(endgame(), 70);
            return;
        } else {
            setTimeout(function () {
                whiteActive();
            }, 1000);
        }
    }, 50);
}

var blackpass = 0;
var whitepass = 0;
var total = 4;
var black_can_play = 0;
let box = [];
//把可以下白旗的地方放進box裡
function whiteActive() {
    box = []; //box.clear()
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (value[i][j] == 2) {
                //上
                if (i - 1 >= 0 && value[i - 1][j] == 1) {
                    for (let k = i - 2; k >= 0; k--) {
                        if (value[k][j] == 1)
                            continue;
                        else if (value[k][j] == 2) {
                            break;
                        } else {
                            box.push([k, j]);
                            break;
                        }
                    }
                }
                //下
                if (i + 1 < 8 && value[i + 1][j] == 1) {
                    for (let k = i + 2; k < 8; k++) {
                        if (value[k][j] == 1) continue;
                        else if (value[k][j] == 2) {
                            break;
                        } else {
                            box.push([k, j]);
                            break;
                        }
                    }
                }
                //左
                if (j - 1 >= 0 && value[i][j - 1] == 1) {
                    for (let k = j - 2; k >= 0; k--) {
                        if (value[i][k] == 1)
                            continue;
                        else if (value[i][k] == 2) {
                            break;
                        } else {
                            box.push([i, k]);
                            break;
                        }
                    }
                }
                //右
                if (j + 1 < 8 && value[i][j + 1] == 1) {
                    for (let k = j + 2; k < 8; k++) {
                        if (value[i][k] == 1)
                            continue;
                        else if (value[i][k] == 2) {
                            break;
                        } else {
                            box.push([i, k]);
                            break;
                        }
                    }
                }
                //右下
                if (j + 1 < 8 && i + 1 < 8 && value[i + 1][j + 1] == 1) {
                    for (let k = 2; k + j < 8 && k + i < 8; k++) {
                        if (value[i + k][j + k] == 1)
                            continue;
                        else if (value[i + k][j + k] == 2) {
                            break;
                        } else {
                            box.push([i + k, j + k]);
                            break;
                        }
                    }
                }
                //右上
                if (j + 1 < 8 && i - 1 >= 0 && value[i - 1][j + 1] == 1) {
                    for (let k = 2; j + k < 8 && i - k >= 0; k++) {
                        if (value[i - k][j + k] == 1)
                            continue;
                        else if (value[i - k][j + k] == 2) {
                            break;
                        } else {
                            box.push([i - k, j + k]);
                            break;
                        }
                    }
                }
                // 左上
                if (j - 1 >= 0 && i - 1 >= 0 && value[i - 1][j - 1] == 1) {
                    for (let k = 2; j - k >= 0 && i - k >= 0; k++) {
                        if (value[i - k][j - k] == 1)
                            continue;
                        else if (value[i - k][j - k] == 2) {
                            break;
                        } else {
                            box.push([i - k, j - k]);
                            break;
                        }
                    }
                }
                //左下
                if (i + 1 < 8 && j - 1 >= 0 && value[i + 1][j - 1] == 1) {
                    for (let k = 2; i + k < 8 && j - k >= 0; k++) {
                        if (value[i + k][j - k] == 1)
                            continue;
                        else if (value[i + k][j - k] == 2) {
                            break;
                        } else {
                            box.push([i + k, j - k]);
                            break;
                        }
                    }
                }
            }
        }
    }
    if (box.length == 0) {
        if (blackpass == 1) {
            setTimeout(endgame(), 70);
        } else {
            whitepass = 1;
            alert('白棋沒地方下了\n白棋PASS\n');
            setTimeout(function () {
                blackActive();
            }, 50);
        }
    } else {
        white_go();
    }
}

//白棋落子，並把該變的地方變一變
function white_go() {
    let choosen = pick();
    let x = box[choosen][0];
    let y = box[choosen][1];
    value[x][y] = 2;
    board[x][y].setpiece(2);
    whitepass = 0;
    total++;
    //下完之後把白棋之間黑棋的部分變顏色
    setTimeout(function () {
        //左
        for (let j = y - 1; j >= 0; j--) {
            if (value[x][j] == 1) {
                continue;
            }
            if (value[x][j] == 2) {
                for (let k = y; k >= j; k--) {
                    value[x][k] = 2;
                    board[x][k].setpiece(2);
                }
                break;
            } else break;
        }
        //右
        for (let j = y + 1; j < 8; j++) {
            if (value[x][j] == 1) {
                continue;
            }
            if (value[x][j] == 2) {
                for (let k = y; k <= j; k++) {
                    value[x][k] = 2;
                    board[x][k].setpiece(2);
                }
                break;
            } else break;
        }
        //上
        for (let j = x - 1; j >= 0; j--) {
            if (value[j][y] == 1) {
                continue;
            }
            if (value[j][y] == 2) {
                for (let k = x; k >= j; k--) {
                    value[k][y] = 2;
                    board[k][y].setpiece(2);
                }
                break;
            } else break;
        }
        //下
        for (let j = x + 1; j < 8; j++) {
            if (value[j][y] == 1) {
                continue;
            }
            if (value[j][y] == 2) {
                for (let k = x; k <= j; k++) {
                    value[k][y] = 2;
                    board[k][y].setpiece(2);
                }
                break;
            } else break;
        }
        //右下
        for (let j = 1; x + j < 8 && y + j < 8; j++) {
            if (value[x + j][y + j] == 1) {
                continue;
            }
            if (value[x + j][y + j] == 2) {
                for (let k = 1; k <= j; k++) {
                    value[x + k][y + k] = 2;
                    board[x + k][y + k].setpiece(2);
                }
                break;
            } else break;
        }
        //右上
        for (let j = 1; x - j >= 0 && y + j < 8; j++) {
            if (value[x - j][y + j] == 1) {
                continue;
            }
            if (value[x - j][y + j] == 2) {
                for (let k = 1; k <= j; k++) {
                    value[x - k][y + k] = 2;
                    board[x - k][y + k].setpiece(2);
                }
                break;
            } else break;
        }
        //左上
        for (let j = 1; x - j >= 0 && y - j >= 0; j++) {
            if (value[x - j][y - j] == 1) {
                continue;
            }
            if (value[x - j][y - j] == 2) {
                for (let k = 1; k <= j; k++) {
                    value[x - k][y - k] = 2;
                    board[x - k][y - k].setpiece(2);
                }
                break;
            } else break;
        }
        //左下
        for (let j = 1; x + j < 8 && y - j >= 0; j++) {
            if (value[x + j][y - j] == 1) {
                continue;
            }
            if (value[x + j][y - j] == 2) {
                for (let k = 1; k <= j; k++) {
                    value[x + k][y - k] = 2;
                    board[x + k][y - k].setpiece(2);
                }
                break;
            } else break;
        }
        setTimeout(function () {
            setTimeout(count, 50);
            if (total == 64) {
                setTimeout(endgame(), 70);
                return;
            } else {
                black_can_play = 0;
                blackActive();
                if (black_can_play == 0) {
                    if (whitepass == 1) {
                        setTimeout(endgame(), 70);
                    } else {
                        blackpass = 1;
                        alert('你沒有地方可以下\n黑棋PASS\n');
                        setTimeout(function () {
                            whiteActive();
                        }, 50);
                    }
                }
            }
        }, 50);
    }, 300);
}

//算看看玩家的合法下棋位置，並讓那個位置hover有效果
function blackActive() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (value[i][j] == 1) {
                //看看有沒有黑棋可以下的地方
                //上
                if (i - 1 >= 0 && value[i - 1][j] == 2) {
                    for (let k = i - 2; k >= 0; k--) {
                        if (value[k][j] == 2)
                            continue;
                        else if (value[k][j] == 0) {
                            board[k][j].node.setAttribute('id', 'active');
                            board[k][j].node.firstChild.addEventListener('click', click, false);
                            black_can_play += 1;
                            break;
                        } else if (value[k][j] == 1) {
                            break;
                        }
                    }
                }
                //下
                if (i + 1 < 8 && value[i + 1][j] == 2) {
                    for (let k = i + 2; k < 8; k++) {
                        if (value[k][j] == 2)
                            continue;
                        else if (value[k][j] == 0) {
                            board[k][j].node.setAttribute('id', 'active');
                            board[k][j].node.firstChild.addEventListener('click', click, false);
                            black_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //左
                if (j - 1 >= 0 && value[i][j - 1] == 2) {
                    for (let k = j - 2; k >= 0; k--) {
                        if (value[i][k] == 2)
                            continue;
                        else if (value[i][k] == 0) {
                            board[i][k].node.setAttribute('id', 'active');
                            board[i][k].node.firstChild.addEventListener('click', click, false);
                            black_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //右
                if (j + 1 < 8 && value[i][j + 1] == 2) {
                    for (let k = j + 2; k < 8; k++) {
                        if (value[i][k] == 2)
                            continue;
                        else if (value[i][k] == 0) {
                            board[i][k].node.setAttribute('id', 'active');
                            board[i][k].node.firstChild.addEventListener('click', click, false);
                            black_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //右下
                if (j + 1 < 8 && i + 1 < 8 && value[i + 1][j + 1] == 2) {
                    for (let k = 2; i + k < 8 && j + k < 8; k++) {
                        if (value[i + k][j + k] == 2)
                            continue;
                        else if (value[i + k][j + k] == 0) {
                            board[i + k][j + k].node.setAttribute('id', 'active');
                            board[i + k][j + k].node.firstChild.addEventListener('click', click, false);
                            black_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //右上
                if (j + 1 < 8 && i - 1 >= 0 && value[i - 1][j + 1] == 2) {
                    for (let k = 2; i - k >= 0 && j + k < 8; k++) {
                        if (value[i - k][j + k] == 2)
                            continue;
                        else if (value[i - k][j + k] == 0) {
                            board[i - k][j + k].node.setAttribute('id', 'active');
                            board[i - k][j + k].node.firstChild.addEventListener('click', click, false);
                            black_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //左上
                if (j - 1 >= 0 && i - 1 >= 0 && value[i - 1][j - 1] == 2) {
                    for (let k = 2; i - k >= 0 && j - k >= 0; k++) {
                        if (value[i - k][j - k] == 2)
                            continue;
                        else if (value[i - k][j - k] == 0) {
                            board[i - k][j - k].node.setAttribute('id', 'active');
                            board[i - k][j - k].node.firstChild.addEventListener('click', click, false);
                            black_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //左下
                if (j - 1 >= 0 && i + 1 < 8 && value[i + 1][j - 1] == 2) {
                    for (let k = 2; i + k < 8 && j - k >= 0; k++) {
                        if (value[i + k][j - k] == 2)
                            continue;
                        else if (value[i + k][j - k] == 0) {
                            board[i + k][j - k].node.setAttribute('id', 'active');
                            board[i + k][j - k].node.firstChild.addEventListener('click', click, false);
                            black_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }
    $('#turn').show();
}

//黑棋下了之後，把該變色的變一變
function black_go(x, y) {
    blackpass = 0;
    board[x][y].setpiece(1);
    value[x][y] = 1;
    total++;
    $('#turn').hide();
    setTimeout(function () {
        //左
        for (let j = y - 1; j >= 0; j--) {
            if (value[x][j] == 2) {
                continue;
            }
            if (value[x][j] == 1) {
                for (let k = y - 1; k > j; k--) {
                    value[x][k] = 1;
                    board[x][k].setpiece(1);
                }
                break;
            } else break;
        }
        //右
        for (let j = y + 1; j < 8; j++) {
            if (value[x][j] == 2) {
                continue;
            }
            if (value[x][j] == 1) {
                for (let k = y + 1; k < j; k++) {
                    value[x][k] = 1;
                    board[x][k].setpiece(1);
                }
                break;
            } else break;
        }
        //上
        for (let j = x - 1; j >= 0; j--) {
            if (value[j][y] == 2) {
                continue;
            }
            if (value[j][y] == 1) {
                for (let k = x - 1; k > j; k--) {
                    value[k][y] = 1;
                    board[k][y].setpiece(1);
                }
                break;
            } else break;
        }
        //下
        for (let j = x + 1; j < 8; j++) {
            if (value[j][y] == 2) {
                continue;
            }
            if (value[j][y] == 1) {
                for (let k = x + 1; k < j; k++) {
                    value[k][y] = 1;
                    board[k][y].setpiece(1);
                }
                break;
            } else break;
        }
        //右下
        for (let j = 1; x + j < 8 && y + j < 8; j++) {
            if (value[x + j][y + j] == 2) {
                continue;
            }
            if (value[x + j][y + j] == 1) {
                for (let k = 1; k <= j; k++) {
                    value[x + k][y + k] = 1;
                    board[x + k][y + k].setpiece(1);
                }
                break;
            } else break;
        }
        //右上
        for (let j = 1; x - j >= 0 && y + j < 8; j++) {
            if (value[x - j][y + j] == 2) {
                continue;
            }
            if (value[x - j][y + j] == 1) {
                for (let k = 1; k < j; k++) {
                    value[x - k][y + k] = 1;
                    board[x - k][y + k].setpiece(1);
                }
                break;
            } else break;
        }
        //左上
        for (let j = 1; x - j >= 0 && y - j >= 0; j++) {
            if (value[x - j][y - j] == 2) {
                continue;
            }
            if (value[x - j][y - j] == 1) {
                for (let k = 1; k < j; k++) {
                    value[x - k][y - k] = 1;
                    board[x - k][y - k].setpiece(1);
                }
                break;
            } else break;
        }
        //左下
        for (let j = 1; x + j < 8 && y - j >= 0; j++) {
            if (value[x + j][y - j] == 2) {
                continue;
            }
            if (value[x + j][y - j] == 1) {
                for (let k = 1; k < j; k++) {
                    value[x + k][y - k] = 1;
                    board[x + k][y - k].setpiece(1);
                }
                break;
            } else break;
        }
        setTimeout(count, 50);
    }, 300);
}

var subsum = 0;
var tmp;
//從box中挑選白棋真的要下的地方
function pick() {
    let pickindex = 0,
        Max = -100000;
    for (let i = 0; i < box.length; i++) {
        subsum = 0;
        tmp = jsonDeepClone(value);
        
        guessWhite(box[i][0], box[i][1]);
        subsum -= guessBlack();        
        
        if(Max < subsum){
            Max = subsum;
            pickindex = i;
        }
    }
    return pickindex;
}

//計算白棋下在(x,y)的地方，會有多大的好處
function guessWhite(x,y) { 
    subsum += vtable[x][y];
    tmp[x][y]=2;
    //左
    for (let j = y - 1; j >= 0; j--) {
        if (tmp[x][j] == 1) {
             continue;
        }
        if (tmp[x][j] == 2) {
            for (let k = y-1; k > j; k--) {
                if(tmp[x][k] != 2){
                    tmp[x][k]=2;
                    subsum += vtable[x][k];
                }
            }
            break;
        } else break;
    }
    //右
    for (let j = y + 1; j < 8; j++) {
        if (tmp[x][j] == 1) {
            continue;
        }
        if (tmp[x][j] == 2) {
            for (let k = y + 1; k < j; k++) {
                if(tmp[x][k] != 2){
                    tmp[x][k]=2;
                    subsum += vtable[x][k];
                }
            }
            break;
        } else break;
    }
    //上
    for (let j = x - 1; j >= 0; j--) {
        if (tmp[j][y] == 1) {
            continue;
        }
        if (tmp[j][y] == 2) {
            for (let k = x-1 ; k > j; k--) {
                if(tmp[k][y] != 2){
                    tmp[k][y] = 2;
                    subsum += vtable[k][y];
                }
            }
            break;
        } else break;
    }
    //下
    for (let j = x + 1; j < 8; j++) {
        if (tmp[j][y] == 1) {
            continue;
        }
        if (tmp[j][y] == 2) {
            for (let k = x + 1; k < j; k++) {
                if(tmp[k][y] != 2){
                    tmp[k][y] = 2;
                    subsum += vtable[k][y];
                }
            }
            break;
        } else break;
    }
    //右下
    for (let j = 1; x + j < 8 && y + j < 8; j++) {
        if (tmp[x + j][y + j] == 1) {
            continue;
        }
        if (tmp[x + j][y + j] == 2) {
            for (let k = 1; k < j; k++) {
                if(tmp[x + k][y + k] != 2){
                    tmp[x+k][y+k] = 2;
                    subsum += vtable[x+k][y+k];
                }
            }
            break;
        } else break;
    }
    //右上
    for (let j = 1; x - j >= 0 && y + j < 8; j++) {
        if (tmp[x - j][y + j] == 1) {
            continue;
        }
        if (tmp[x - j][y + j] == 2) {
            for (let k = 1; k < j; k++) {
                if(tmp[x - k][y + k] != 2){
                    tmp[x-k][y+k] = 2;
                    subsum += vtable[x-k][y+k];
                }
            }
            break;
        } else break;
    }
    //左上
    for (let j = 1; x - j >= 0 && y - j >= 0; j++) {
        if (tmp[x - j][y - j] == 1) {
            continue;
        }
        if (tmp[x - j][y - j] == 2) {
            for (let k = 1; k < j; k++) {
                if(tmp[x - k][y - k] != 2){
                    tmp[x-k][y-k] = 2;
                    subsum += vtable[x-k][y-k];
                }
            }
            break;
        } else break;
    }
    //左下
    for (let j = 1; x + j < 8 && y - j >= 0; j++) {
        if (tmp[x + j][y - j] == 1) {
            continue;
        }
        if (tmp[x + j][y - j] == 2) {
            for (let k = 1; k < j; k++) {
                if(tmp[x + k][y - k] != 2){
                    tmp[x+k][y-k] = 2;
                    subsum += vtable[x+k][y-k];
                }
            }
            break;
        } else break;
    }
}

var tmp2;
var blackbox= [];
function guessBlack(){ 
    let mostindex;
    let blackmax = -10000;
    blackbox = [];  // blackbox.clear()
    for (let i = 0; i < 8; i++) {
        for(let j = 0; j<8;j++){
            if(tmp[i][j] == 1) {
                //看看有沒有黑棋可以下的地方
                //上
                if (i - 1 >= 0 && tmp[i - 1][j] == 2) {
                    for (let k = i - 2; k >= 0; k--) {
                        if (tmp[k][j] == 2)
                            continue;
                        else if (tmp[k][j] == 0) {
                            blackbox.push([k,j]);
                            break;
                        } else if (tmp[k][j] == 1) {
                            break;
                        }
                    }
                }
                //下
                if (i + 1 < 8 && tmp[i + 1][j] == 2) {
                    for (let k = i + 2; k < 8; k++) {
                        if (tmp[k][j] == 2)
                            continue;
                        else if (tmp[k][j] == 0) {
                            blackbox.push([k,j]);
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //左
                if (j - 1 >= 0 && tmp[i][j - 1] == 2) {
                    for (let k = j - 2; k >= 0; k--) {
                        if (tmp[i][k] == 2)
                            continue;
                        else if (tmp[i][k] == 0) {
                            blackbox.push([i,k]);
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //右
                if (j + 1 < 8 && tmp[i][j + 1] == 2) {
                    for (let k = j + 2; k < 8; k++) {
                        if (tmp[i][k] == 2)
                            continue;
                        else if (tmp[i][k] == 0) {
                            blackbox.push([i,k]);
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //右下
                if (j + 1 < 8 && i + 1 < 8 && tmp[i + 1][j + 1] == 2) {
                    for (let k = 2; i + k < 8 && j + k < 8; k++) {
                        if (tmp[i + k][j + k] == 2)
                            continue;
                        else if (tmp[i + k][j + k] == 0) {
                            blackbox.push([i+k,j+k]);
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //右上
                if (j + 1 < 8 && i - 1 >= 0 && tmp[i - 1][j + 1] == 2) {
                    for (let k = 2; i - k >= 0 && j + k < 8; k++) {
                        if (tmp[i - k][j + k] == 2)
                            continue;
                        else if (tmp[i - k][j + k] == 0) {
                            blackbox.push([i-k,j+k]);
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //左上
                if (j - 1 >= 0 && i - 1 >= 0 && tmp[i - 1][j - 1] == 2) {
                    for (let k = 2; i - k >= 0 && j - k >= 0; k++) {
                        if (tmp[i - k][j - k] == 2)
                            continue;
                        else if (tmp[i - k][j - k] == 0) {
                            blackbox.push([i-k,j-k]);
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //左下
                if (j - 1 >= 0 && i + 1 < 8 && tmp[i + 1][j - 1] == 2) {
                    for (let k = 2; i + k < 8 && j - k >= 0; k++) {
                        if (tmp[i + k][j - k] == 2)
                            continue;
                        else if (tmp[i + k][j - k] == 0) {
                            blackbox.push([i+k,j-k]);
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }
    
    for(let i=0;i<blackbox.length;i++) {
        tmp2 = jsonDeepClone(tmp);
        let t = execute(blackbox[i][0],blackbox[i][1]);
        if(blackmax < t){
            blackmax = t;
        }
    }
    return blackmax;
}

//模擬黑棋下在(x,y)的地方，會有多大的好處
function execute(x,y){ 
    let cnt = 0;
    //左
    for (let j = y - 1; j >= 0; j--) {
        if (tmp2[x][j] == 2) {
            continue;
        }
        if (tmp2[x][j] == 1) {
            for (let k = y - 1; k > j; k--) {
                if(tmp2[x][k] != 1){
                    tmp2[x][k]=1;
                    cnt += vtable[x][k];
                }
            }
            break;
        } else break;
    }
    //右
    for (let j = y + 1; j < 8; j++) {
        if (tmp2[x][j] == 2) {
            continue;
        }
        if (tmp2[x][j] == 1) {
            for (let k = y + 1; k < j; k++) {
                if(tmp2[x][k] != 1){
                    tmp2[x][k] = 1;
                    cnt += vtable[x][k];
                }
            }
            break;
        } else break;
    }
    //上
    for (let j = x - 1; j >= 0; j--) {
        if (tmp2[j][y] == 2) {
            continue;
        }
        if (tmp2[j][y] == 1) {
            for (let k = x - 1; k > j; k--) {
                if(tmp2[k][y] != 1){
                    tmp2[k][y]=1;
                    cnt += vtable[k][y];
                }
            }
            break;
        } else break;
    }
    //下
    for (let j = x + 1; j < 8; j++) {
        if (tmp2[j][y] == 2) {
            continue;
        }
        if (tmp2[j][y] == 1) {
            for (let k = x + 1; k < j; k++) {
                if(tmp2[k][y] != 1){
                    tmp2[k][y] = 1;
                    cnt += vtable[k][y];
                }
            }
            break;
        } else break;
    }
    //右下
    for (let j = 1; x + j < 8 && y + j < 8; j++) {
        if(tmp2[x + j][y + j] == 2) {
            continue;
        }
        if (tmp2[x + j][y + j] == 1) {
            for (let k = 1; k < j; k++) {
                if(tmp2[x+k][y+k] != 1){
                    tmp2[x+k][y+k] =1;
                    cnt += vtable[x+k][y+k];
                }
            }
            break;
        } else break;
    }
    //右上
    for (let j = 1; x - j >= 0 && y + j < 8; j++) {
        if (tmp2[x - j][y + j] == 2) {
            continue;
        }
        if (tmp2[x - j][y + j] == 1) {
            for (let k = 1; k < j; k++) {
                if(tmp2[x-k][y+k] != 1){
                    tmp2[x-k][y+k] = 1;
                    cnt += vtable[x-k][y+k];
                }
            }
            break;
        } else break;
    }
    //左上
    for (let j = 1; x - j >= 0 && y - j >= 0; j++) {
        if (tmp2[x - j][y - j] == 2) {
            continue;
        }
        if (tmp2[x - j][y - j] == 1) {
            for (let k = 1; k < j; k++) {
                if(tmp2[x-k][y-k] != 1){
                    tmp2[x-k][y-k] = 1;
                    cnt += vtable[x-k][y-k];
                }
            }
            break;
        } else break;
    }
    //左下
    for (let j = 1; x + j < 8 && y - j >= 0; j++) {
        if (tmp2[x + j][y - j] == 2) {
            continue;
        }
        if (tmp2[x + j][y - j] == 1 ) {
            for (let k = 1; k < j; k++) {
                if(tmp2[x+k][y-k] != 1){
                    tmp2[x+k][y-k] = 1;
                    cnt += vtable[x+k][y-k];
                }
            }
            break;
        } else break;
    }
    
    return cnt;
}

//深拷貝
//用JSON.stringify把物件轉成字串,再用JSON.parse把字串轉成新的物件
function jsonDeepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

//把board的狀態歸零
function init() {
    black_can_play = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            board[i][j].node.firstChild.removeEventListener('click', click, false);
            board[i][j].node.setAttribute('id', 'inactive');
        }
    }
}

//更新黑棋白棋數
function count() {
    setTimeout(function () {
        let total_white = 0;
        let total_black = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (value[i][j] == 1) {
                    total_black++;
                } else if (value[i][j] == 2) {
                    total_white++;
                }
            }
        }
        $('.grade.bgrade').text(total_black);
        $('.grade.wgrade').text(total_white);

    }, 50);
}

//結算遊戲
function endgame() {
    let total_white = 0;
    let total_black = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (value[i][j] == 1) {
                total_black++;
            } else if (value[i][j] == 2) {
                total_white++;
            }
        }
    }
    
    if (total_black > total_white) {
        loses += 1;
        update(wins,loses,ties);
        $('.banner').text('YOU  WIN!');
        $('.banner').fadeIn("slow");
    } else if (total_black < total_white) {
        wins += 1;
        update(wins,loses,ties);
        $('.banner').text('YOU LOSE!');
        $('.banner').fadeIn("slow");
    } else {
        ties += 1;
        update(wins,loses,ties);
        $('.banner').text('   TIE   ');
        $('.banner').fadeIn("slow");
    }
}

//update
function update(wins,loses,ties){
    localStorage.clear();
    localStorage.setItem('win', JSON.stringify(wins));
    localStorage.setItem('lose', JSON.stringify(loses));
    localStorage.setItem('tie', JSON.stringify(ties));
    let p= wins/(loses+ties+wins)*100.0;
    p = Math.round(p * 100) / 100;
    $('.AIgrade').html('電腦戰績:'+wins+'勝'+loses+'負'+ties+'和&nbsp;&nbsp;勝率:'+p+'%');
}

//New Game
function reload() {
    location.reload();
}
