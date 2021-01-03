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

//黑棋先下
blackActive(); 

//玩家下白棋
function blackclick(e) {
    e = e;
    var name = e.target.getAttribute('id');
    var s = name.split('-');
    let x = parseInt(s[0]);
    let y = parseInt(s[1]);
    black_go(x, y);
    init();

    setTimeout(function () {
        if (total == 64) {
            setTimeout(endgame(), 50);
            return;
        } else {
            setTimeout(function () {
                white_can_play = 0;
                whiteActive();
            }, 500);
        }
    }, 50);
}

//玩家下黑棋
function whiteclick(e) {
    e = e;
    var name = e.target.getAttribute('id');
    var s = name.split('-');
    let x = parseInt(s[0]);
    let y = parseInt(s[1]);
    white_go(x, y);
    init();

    setTimeout(function () {
        if (total == 64) {
            setTimeout(endgame(), 50);
            return;
        } else {
            setTimeout(function () {
                black_can_play = 0;
                blackActive();
            }, 500);
        }
    }, 50);
}

var blackpass = 0;
var whitepass = 0;
var total = 4;
var black_can_play = 0;
var white_can_play = 0;


//找出下白棋的合法位置
function whiteActive() {
    white_can_play = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (value[i][j] == 2) {
                //上
                if (i - 1 >= 0 && value[i - 1][j] == 1) {
                    for (let k = i - 2; k >= 0; k--) {
                        if (value[k][j] == 1)
                            continue;
                        else if (value[k][j] == 0) {
                            board[k][j].node.setAttribute('id', 'active');
                            board[k][j].node.firstChild.addEventListener('click', whiteclick, false);
                            white_can_play += 1;
                            break;
                        } else if (value[k][j] == 2) {
                            break;
                        }
                    }
                }
                //下
                if (i + 1 < 8 && value[i + 1][j] == 1) {
                    for (let k = i + 2; k < 8; k++) {
                        if (value[k][j] == 1)
                            continue;
                        else if (value[k][j] == 0) {
                            board[k][j].node.setAttribute('id', 'active');
                            board[k][j].node.firstChild.addEventListener('click', whiteclick, false);
                            white_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //左
                if (j - 1 >= 0 && value[i][j - 1] == 1) {
                    for (let k = j - 2; k >= 0; k--) {
                        if (value[i][k] == 1)
                            continue;
                        else if (value[i][k] == 0) {
                            board[i][k].node.setAttribute('id', 'active');
                            board[i][k].node.firstChild.addEventListener('click', whiteclick, false);
                            white_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //右
                if (j + 1 < 8 && value[i][j + 1] == 1) {
                    for (let k = j + 2; k < 8; k++) {
                        if (value[i][k] == 1)
                            continue;
                        else if (value[i][k] == 0) {
                            board[i][k].node.setAttribute('id', 'active');
                            board[i][k].node.firstChild.addEventListener('click', whiteclick, false);
                            white_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //右下
                if (j + 1 < 8 && i + 1 < 8 && value[i + 1][j + 1] == 1) {
                    for (let k = 2; i + k < 8 && j + k < 8; k++) {
                        if (value[i + k][j + k] == 1)
                            continue;
                        else if (value[i + k][j + k] == 0) {
                            board[i + k][j + k].node.setAttribute('id', 'active');
                            board[i + k][j + k].node.firstChild.addEventListener('click', whiteclick, false);
                            white_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //右上
                if (j + 1 < 8 && i - 1 >= 0 && value[i - 1][j + 1] == 1) {
                    for (let k = 2; i - k >= 0 && j + k < 8; k++) {
                        if (value[i - k][j + k] == 1)
                            continue;
                        else if (value[i - k][j + k] == 0) {
                            board[i - k][j + k].node.setAttribute('id', 'active');
                            board[i - k][j + k].node.firstChild.addEventListener('click', whiteclick, false);
                            white_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //左上
                if (j - 1 >= 0 && i - 1 >= 0 && value[i - 1][j - 1] == 1) {
                    for (let k = 2; i - k >= 0 && j - k >= 0; k++) {
                        if (value[i - k][j - k] == 1)
                            continue;
                        else if (value[i - k][j - k] == 0) {
                            board[i - k][j - k].node.setAttribute('id', 'active');
                            board[i - k][j - k].node.firstChild.addEventListener('click', whiteclick, false);
                            white_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
                //左下
                if (j - 1 >= 0 && i + 1 < 8 && value[i + 1][j - 1] == 1) {
                    for (let k = 2; i + k < 8 && j - k >= 0; k++) {
                        if (value[i + k][j - k] == 1)
                            continue;
                        else if (value[i + k][j - k] == 0) {
                            board[i + k][j - k].node.setAttribute('id', 'active');
                            board[i + k][j - k].node.firstChild.addEventListener('click', whiteclick, false);
                            white_can_play += 1;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }
    setTimeout(function () {
        if (white_can_play == 0) {
            setTimeout(function () {
                alert('白棋沒地方下了QAQ\n  白棋PASS  \n');
                setTimeout(function () {
                    if (blackpass == 1) {
                        endgame();
                        return;
                    } else {
                        whitepass = 1;
                        blackActive();
                    }
                }, 50);
            }, 50)
        } else {
            $('#turn').html('<strong>白方</strong>下棋');
            $('#turn').show();
        }
    }, 50)
}

//白棋落子，並把該變的地方變一變
function white_go(x, y) {
    value[x][y] = 2;
    board[x][y].setpiece(2);
    whitepass = 0;
    total++;
    //下完之後把白棋之間黑棋的部分變顏色
    setTimeout(function () {
        //左
        let flag = 0; //避免相鄰兩白旗還變得情況
        for (let j = y - 1; j >= 0; j--) {
            if (value[x][j] == 1) {
                flag = 1;
                continue;
            }
            if (value[x][j] == 2 && flag == 1) {
                for (let k = y; k >= j; k--) {
                    value[x][k] = 2;
                    board[x][k].setpiece(2);
                }
                break;
            } else break;
        }
        flag = 0; //init
        //右
        for (let j = y + 1; j < 8; j++) {
            if (value[x][j] == 1) {
                flag = 1;
                continue;
            }
            if (value[x][j] == 2 && flag == 1) {
                for (let k = y; k <= j; k++) {
                    value[x][k] = 2;
                    board[x][k].setpiece(2);
                }
                break;
            } else break;
        }
        flag = 0;
        //上
        for (let j = x - 1; j >= 0; j--) {
            if (value[j][y] == 1) {
                flag = 1;
                continue;
            }
            if (value[j][y] == 2 && flag == 1) {
                for (let k = x; k >= j; k--) {
                    value[k][y] = 2;
                    board[k][y].setpiece(2);
                }
                break;
            } else break;
        }
        flag = 0;
        //下
        for (let j = x + 1; j < 8; j++) {
            if (value[j][y] == 1) {
                flag = 1;
                continue;
            }
            if (value[j][y] == 2 && flag == 1) {
                for (let k = x; k <= j; k++) {
                    value[k][y] = 2;
                    board[k][y].setpiece(2);
                }
                break;
            } else break;
        }
        flag = 0;
        //右下
        for (let j = 1; x + j < 8 && y + j < 8; j++) {
            if (value[x + j][y + j] == 1) {
                flag = 1;
                continue;
            }
            if (value[x + j][y + j] == 2 && flag == 1) {
                for (let k = 1; k <= j; k++) {
                    value[x + k][y + k] = 2;
                    board[x + k][y + k].setpiece(2);
                }
                break;
            } else break;
        }
        flag = 0;
        //右上
        for (let j = 1; x - j >= 0 && y + j < 8; j++) {
            if (value[x - j][y + j] == 1) {
                flag = 1;
                continue;
            }
            if (value[x - j][y + j] == 2 && flag == 1) {
                for (let k = 1; k <= j; k++) {
                    value[x - k][y + k] = 2;
                    board[x - k][y + k].setpiece(2);
                }
                break;
            } else break;
        }
        flag = 0;
        //左上
        for (let j = 1; x - j >= 0 && y - j >= 0; j++) {
            if (value[x - j][y - j] == 1) {
                flag = 1;
                continue;
            }
            if (value[x - j][y - j] == 2 && flag == 1) {
                for (let k = 1; k <= j; k++) {
                    value[x - k][y - k] = 2;
                    board[x - k][y - k].setpiece(2);
                }
                break;
            } else break;
        }
        flag = 0;
        //左下
        for (let j = 1; x + j < 8 && y - j >= 0; j++) {
            if (value[x + j][y - j] == 1) {
                flag = 1;
                continue;
            }
            if (value[x + j][y - j] == 2 && flag == 1) {
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
                setTimeout(endgame(), 50);
                return;
            }
        }, 50);

    }, 300);
}

//找出下黑棋的合法位置
function blackActive() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (value[i][j] == 1) {
                //上
                if (i - 1 >= 0 && value[i - 1][j] == 2) {
                    for (let k = i - 2; k >= 0; k--) {
                        if (value[k][j] == 2)
                            continue;
                        else if (value[k][j] == 0) {
                            board[k][j].node.setAttribute('id', 'active');
                            board[k][j].node.firstChild.addEventListener('click', blackclick, false);
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
                            board[k][j].node.firstChild.addEventListener('click', blackclick, false);
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
                            board[i][k].node.firstChild.addEventListener('click', blackclick, false);
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
                            board[i][k].node.firstChild.addEventListener('click', blackclick, false);
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
                            board[i + k][j + k].node.firstChild.addEventListener('click', blackclick, false);
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
                            board[i - k][j + k].node.firstChild.addEventListener('click', blackclick, false);
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
                            board[i - k][j - k].node.firstChild.addEventListener('click', blackclick, false);
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
                            board[i + k][j - k].node.firstChild.addEventListener('click', blackclick, false);
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
    if (black_can_play == 0) {
        setTimeout(function () {
            alert('黑棋沒地方下了QAQ\n  黑棋PASS  \n');
            setTimeout(function () {
                if (whitepass == 1) {
                    endgame();
                    return;
                } else {
                    blackpass = 1;
                    whiteActive();
                }
            }, 50);
        }, 50)
    } else {
        $('#turn').html('<strong>黑方</strong>下棋');
        $('#turn').show();
    }
}

//黑棋落子，並把該變的地方變一變
function black_go(x, y) {
    blackpass = 0;
    board[x][y].setpiece(1);
    value[x][y] = 1;
    total++;
    setTimeout(function () {
        let flag = 0;
        //左
        for (let j = y - 1; j >= 0; j--) {
            if (value[x][j] == 2) {
                flag = 1;
                continue;
            }
            if (value[x][j] == 1 && flag == 1) {
                for (let k = y; k >= j; k--) {
                    value[x][k] = 1;
                    board[x][k].setpiece(1);
                }
                break;
            } else break;
        }
        flag = 0;
        //右
        for (let j = y + 1; j < 8; j++) {
            if (value[x][j] == 2) {
                flag = 1;
                continue;
            }
            if (value[x][j] == 1 && flag == 1) {
                for (let k = y; k <= j; k++) {
                    value[x][k] = 1;
                    board[x][k].setpiece(1);
                }
                break;
            } else break;
        }
        flag = 0;
        //上
        for (let j = x - 1; j >= 0; j--) {
            if (value[j][y] == 2) {
                flag = 1;
                continue;
            }
            if (value[j][y] == 1 && flag == 1) {
                for (let k = x; k >= j; k--) {
                    value[k][y] = 1;
                    board[k][y].setpiece(1);
                }
                break;
            } else break;
        }
        flag = 0;
        //下
        for (let j = x + 1; j < 8; j++) {
            if (value[j][y] == 2) {
                flag = 1;
                continue;
            }
            if (value[j][y] == 1 && flag == 1) {
                for (let k = x; k <= j; k++) {
                    value[k][y] = 1;
                    board[k][y].setpiece(1);
                }
                break;
            } else break;
        }
        flag = 0;
        //右下
        for (let j = 1; x + j < 8 && y + j < 8; j++) {
            if (value[x + j][y + j] == 2) {
                flag = 1;
                continue;
            }
            if (value[x + j][y + j] == 1 && flag == 1) {
                for (let k = 1; k <= j; k++) {
                    value[x + k][y + k] = 1;
                    board[x + k][y + k].setpiece(1);
                }
                break;
            } else break;
        }
        flag = 0;
        //右上
        for (let j = 1; x - j >= 0 && y + j < 8; j++) {
            if (value[x - j][y + j] == 2) {
                flag = 1;
                continue;
            }
            if (value[x - j][y + j] == 1 && flag == 1) {
                for (let k = 1; k <= j; k++) {
                    value[x - k][y + k] = 1;
                    board[x - k][y + k].setpiece(1);
                }
                break;
            } else break;
        }
        flag = 0;
        //左上
        for (let j = 1; x - j >= 0 && y - j >= 0; j++) {
            if (value[x - j][y - j] == 2) {
                flag = 1;
                continue;
            }
            if (value[x - j][y - j] == 1 && flag == 1) {
                for (let k = 1; k <= j; k++) {
                    value[x - k][y - k] = 1;
                    board[x - k][y - k].setpiece(1);
                }
                break;
            } else break;
        }
        flag = 0;
        //左下
        for (let j = 1; x + j < 8 && y - j >= 0; j++) {
            if (value[x + j][y - j] == 2) {
                flag = 1;
                continue;
            }
            if (value[x + j][y - j] == 1 && flag == 1) {
                for (let k = 1; k <= j; k++) {
                    value[x + k][y - k] = 1;
                    board[x + k][y - k].setpiece(1);
                }
                break;
            } else break;
        }
        flag = 0;
        setTimeout(count, 50);
    }, 300);
}

//把board的狀態歸零
function init() {
    black_can_play = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            board[i][j].node.firstChild.removeEventListener('click', blackclick, false);
            board[i][j].node.firstChild.removeEventListener('click', whiteclick, false);
            board[i][j].node.setAttribute('id', 'inactive');
        }
    }
}

//更新黑棋白棋的數量
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

//遊戲結算
function endgame() {
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
        console.log('total_black: ' + total_black);
        console.log('total_white: ' + total_white);
        if (total_black > total_white) {
            $('.banner').text('Black WIN!');
            $('.banner').fadeIn("slow");
        } else if (total_black < total_white) {
            $('.banner').text('White WIN');
            $('.banner').fadeIn("slow");
        } else {
            $('.banner').text('   TIE   ');
            $('.banner').fadeIn("slow");
        }

    }, 500);
}

//new Game
function reload() {
    location.reload();
}
