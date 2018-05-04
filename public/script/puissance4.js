(function ($) {
    $.fn.puissance4 = function(options) {
        var defaultOptions = {
            "dimensions": [4, 4],
            "colors": ["red", "yellow"],
            "winningCount": 4
        };
        var param = $.extend(defaultOptions, options);

        return this.each(function(){
            makeUtility($(this), param.colors, param.winningCount);
            makeGrid($(this), param.dimensions[0], param.dimensions[1]);
            pimpMyGrid();
            slotChips();
            play();
            cancelPreviousMove();
            announceTurn();
            showScores()
        });
    }
})(jQuery);

function makeGrid(parent, x, y)
{

    var grid = $("<table class='table'></table>"),
        slot = $("<table class='table slot'></table>"),
        slotRow = $("<tr class='slot-row'></tr>"),
        win = $("#winning-count").data("win");

    x = (x < win) ? win : x;
    y = (y < win) ? win : y;

    for(var j = 0; j < x; j++){
        slotRow.append("<td class='slots'></td>");
    }
    slot.append(slotRow);
    parent.append(slot);
    for(var i = 0; i < y; i++) {
        var currentLigne = $("<tr class='row'></tr>");
        for(var j = 0; j < x; j++){
            currentLigne.append("<td class='column' data-status='empty'></td>");
        }
        grid.append(currentLigne);
    }
    grid.append("<input id='turn' type='hidden' data-turn='0' />");
    parent.append(grid);
}

function makeUtility(parent, colors, win)
{
    var mainUtility = $("<div class='utility'></div>"),
        score = "<div><p id='score'>Score : Player 1 :<span id='score-0'>0</span> Player 2 : <span id='score-1'>0</span></p></div>",
        turn = "<div><p>Current Turn : <span id='turn-announcer'></span></p></div>",
        prevScore = "<div><p id='scores-drop'> Previous Score : </p><span id='prev-scores'></span></div>",
        lastMove = "<button id='cancel-move'>Cancel Previous Move</button><input id='last-move' type='hidden' data-move='empty'>",
        color = "<input id='colors' type='hidden' data-colors-p1='"+colors[0]+"' data-colors-p2='"+colors[1]+"'>",
        winning = "<input id='winning-count' type='hidden' data-win='"+win+"'>";
    mainUtility.append(score);
    mainUtility.append(turn);
    mainUtility.append(prevScore);
    mainUtility.append(lastMove);
    mainUtility.append(color);
    mainUtility.append(winning);
    parent.append(mainUtility);
}

function pimpMyGrid()
{
    var tab = $(".table"), slot = $(".slot"), row = $(".table >"), cell =  $(".table >>"), ui = $(".utility");

    tab.css({
        "border-radius": "25px",
        "background-image": "url('http://19twentythree.com/wp-content/uploads/2013/06/Peterguess-bigstock-Natural-Beech-Wood-Background-5136923.jpg')",
        "border": "3px outset brown"
    });

    slot.css({
        "border-radius": "25px",
        "margin-bottom": "10px"
    });

    row.outerHeight("100px");

    cell.outerHeight("100px");
    cell.outerWidth("100px");
    cell.css({
        "background-color": "#826043",
        "border-radius": "100%",
        "border": "3px inset brown"
    });

    ui.css({
        "float": "left",
        "background-image": "url('http://19twentythree.com/wp-content/uploads/2013/06/Peterguess-bigstock-Natural-Beech-Wood-Background-5136923.jpg')",
        "border-radius": "25px",
        "border": "3px outset brown",
        "padding": "10px",
        "margin-right": "10px",
        "width": "250px",
        "font-family": "Helvetica",
        "font-weight": "bold",
        "color": "#333300"
    });

    $("#prev-scores").css("display", "none");
}

function slotChips()
{
    var slot = $(".slots");

    slot.mouseenter(function(e){
        var color = checkColors();
        $(e.target).css("background-color", color);
    });

    slot.mouseleave(function(e){
        $(e.target).css("background-color", "#826043");
    });

}

function play()
{
    var bool, turn = $("#turn");

    $(".slot").click(function(e) {
        if(checkTurns() === 0) {
            bool = fallDown($(e.target).index(), 0);
            if(bool) {
                bictory(turn.data("turn"));
                turn.data("turn", 1);
            }
        } else if(checkTurns() === 1) {
            bool = fallDown($(e.target).index(), 1);
            if(bool) {
                bictory(turn.data("turn"));
                turn.data("turn", 0);
            }
        }
        announceTurn();
    });
}

function fallDown(x,turn)
{
    for(var y = 0, c = $(".row").length; y < c; y++){
        var row = $(".row"),
            current = $(row[y]),
            next = $(row[(y + 1)]),
            nextChild = $(next).children()[x],
            child = $(current).children()[x];

        var target = $(child),
            nexTarget = $(nextChild),
            color = checkColors();

        if(target.data("status") != 0&&target.data("status") != 1) {
            target.css("background-color", color);
            if (nexTarget.data("status") !== "empty") {
                target.data("status", turn);
                saveLastMove(target);
                return true;
            } else {
                target.css("background-color", "#826043");
            }
        }
    }
}

function bictory(turn)
{
    var win = $("#winning-count").data("win");
    for(var z = 0, count = $(".row").length; z < count; z++) {
        checkDiagRight(turn, z, win);
        checkDiagLeft(turn, z, win);
        checkVertical(turn, z, win);
        checkHorizon(turn, z, win);
    }
    draw();
}

function checkDiagRight(turn, z, win)
{
    var p = 0, row, child;
    for (var i = 0, c = $(".row")[z].cells.length; i < c; i++) {
        for (var j = 0; j < win; j++) {
            row = $(".row")[j + z];
            child = $(row).children()[i + j];

            if($(child).data("status") == turn) p += 1;
            else p = 0;
            if(p === win) {
                changeScore(turn);
                saveScore();
                resetGrid();
            }
        }
        p = 0;
    }
}
function checkDiagLeft(turn, z, win)
{
    var p = 0, row, child;
    for (var i = 0, c = $(".row")[z].cells.length; i < c; i++) {
        for (var j = 0; j < win; j++) {
            row = $(".row")[j + z];
            child = $(row).children()[i - j];

            if($(child).data("status") == turn) p += 1;
            else p = 0;
            if(p === win) {
                changeScore(turn);
                saveScore();
                resetGrid();
            }
        }
        p = 0;
    }
}
function checkHorizon(turn, z, win)
{
    var p = 0, row, child;
    for (var i = 0, c = $(".row")[z].cells.length; i < c; i++) {
        for (var j = 0; j < win; j++) {
            row = $(".row")[z];
            child = $(row).children()[j + i];

            if($(child).data("status") == turn) p += 1;
            else p = 0;
            if(p === win) {
                changeScore(turn);
                saveScore();
                resetGrid();
            }
        }
        p = 0;
    }
}
function checkVertical(turn, z, win)
{
    var p = 0, row, child;
    for (var i = 0, c = $(".row")[z].cells.length; i < c; i++) {
        for (var j = 0; j < win; j++) {
            row = $(".row")[z + j];
            child = $(row).children()[i];

            if($(child).data("status") == turn) p += 1;
            else p = 0;
            if(p === win) {
                changeScore(turn);
                saveScore();
                resetGrid();
            }
        }
        p = 0;
    }
}

function changeScore(player)
{
    var id = $("#score-"+player), scorePlus = parseInt(id.text()) + 1;
    id.text(scorePlus);
}

function resetGrid()
{
    $(".column").data("status", "empty").css("background-color", "#826043");
}

function draw()
{
    var draw = $(".column").map(function(){
        return $(this).data("status");
    });
    if(draw.get().indexOf("empty") === -1) {
        alert("It's a Draw");
        $("#prev-scores").html($("#prev-scores").html() + "Score : Draw<br>");
        resetGrid();
    }
}

function checkTurns()
{
    if($("#turn").data("turn") == 0) return 0;
    else if($("#turn").data("turn") == 1) return 1;
}

function checkColors()
{
    if(checkTurns() === 0) return $("#colors").data("colors-p1");
    else if(checkTurns() === 1) return $("#colors").data("colors-p2");
}

function announceTurn()
{
    if(checkTurns() === 0) $("#turn-announcer").text("Player 1");
    if(checkTurns() === 1) $("#turn-announcer").text("Player 2");
}

function saveScore()
{
    $("#prev-scores").html($("#prev-scores").html() + $("#score").html() + "<br>");
}

function saveLastMove(move)
{
    $("#last-move").data("move", move);
}

function cancelPreviousMove()
{
    $("#cancel-move").click(function(){
        var last = $("#last-move").data("move");
        if(last !== "empty") {
            last.data("status", "empty");
            last.css("background-color", "#826043");
            if (checkTurns() === 0) $("#turn").data("turn", 1);
            else if (checkTurns() === 1) $("#turn").data("turn", 0);
            announceTurn();
            $("#last-move").data("move", "empty");
        }
    });
}

function showScores()
{
    $("#scores-drop").click(function () {
        $("#prev-scores").slideToggle();
    });
}