

/********************************************************** VARIAVEIS-GLOBAIS **********************************************************/

var divs = ["login", "classificacoes", "instrucoes", "configuracao"],
    tam = 5,           // Tamanho do tabuleiro
    vs = "ia",         // Contra quem vai jogar
    first = true,           // Se for primeiro a jogar
    level = 1,           // 1(facil) ou 2(dificil)
    numBolas,           // Numero total de bolas no jogo
    turn = 0,           // 0 se for o jogador 1 se for IA
    numVitorias = [0, 0, 0],          // Numero de vitorias na tabela
    numDerrotas = [0, 0, 0],          // Numero de derrotas na tabela
    comecou;


/********************************************************** ABOUT-GAME **********************************************************/


var Nim = (function () {

    // VARIAVEIS
    var maxColums = 5,          // Numero de maximo colunas
        maxBolas = 5,          // Numero maximo de bolas por coluna
        dx = 500 / maxColums,          // Posição das filas em pixeis
        dy = 400 / maxBolas,          // Posição das bolas
        bolas;          // Array com as bolas (objeto)

    // CONSTRUTOR PARA AS BOLAS
    var Bola = function (pos_x, pos_y, column, order) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.element = document.createElement("div");
        this.element.column = column;
        this.element.order = order;

        // Sublinhar bola (muda o background da bola)
        this.sublinhar = function (event) {
            this.element.style.backgroundColor = "red";

            // Nao sublinhar se a proxima for a ultima da coluna
            if (this.element.order + 1 !== bolas[this.element.column].length)
                bolas[this.element.column][this.element.order + 1].sublinhar();
        };

        // Desublinhar a bola ao tirar o rato
        this.desublinhar = function (event) {
            if (typeof bolas[this.element.column] !== "undefined") {
                if (typeof bolas[this.element.column][this.element.order] !== "undefined") {
                    this.element.style.backgroundColor = "orange";

                    if (this.element.order + 1 !== bolas[this.element.column].length)
                        bolas[this.element.column][this.element.order + 1].desublinhar();
                }
            }
        };

        // Remover as bolas
        this.remove = function (event) {
            console.log("TURN = "+ turn);
            console.log("[" + this.element.column + "][" + this.element.order + "]");

            // Remover bola ate a selcionada
            for (var j = bolas[this.element.column].length - 1; j >= this.element.order; j--) {
                bolas[this.element.column][j].element.parentNode.removeChild(bolas[this.element.column][j].element);
                bolas[this.element.column].pop();
                numBolas--;
                console.log("bolas:" + numBolas);
            }

            // Check se a coluna esta vazio
            if (bolas[this.element.column].length === 0) {
                for (var i = this.element.column + 1; i < bolas.length; i++)
                    for (j = 0; j < bolas[i].length; j++)
                        bolas[i][j].element.column--;
                bolas.splice(this.element.column, 1);
            }

            // Check se o Jogador ganhou o jogo e acabar o jogo
            if(numBolas === 0 && turn === 0){
                alert("Jogador Ganhou!");
                if(tam === 5){
                    numVitorias[0]++;
                }
                else if (tam === 6){
                    numVitorias[1]++;
                }
                else{
                    numVitorias[2]++;
                }
                refresh();
            }

            // Check se a IA Ganhou o jogo e acabar o jogo
            if(numBolas === 0 && turn === 1){
                alert("IA Ganhou!");
                if(tam === 5){
                    numDerrotas[0]++;
                }
                else if (tam === 6){
                    numDerrotas[1]++;
                }
                else{
                    numDerrotas[2]++;
                }
                refresh();
            }

            // Muda o turno
            if(turn === 0) {
                turn = 1;
            }
            else {
                turn = 0;
            }

        };

        this.element.addEventListener("mouseover", this.sublinhar.bind(this), false);
        this.element.addEventListener("mouseout", this.desublinhar.bind(this), false);
        this.element.addEventListener("click", this.remove.bind(this), false);
        this.element.addEventListener("click", delayTurnoIA, false);
    };

    // COMECAR O JOGO (CRIA O TABULEIRO)
    var startGame = function (tamTotal) {
        console.log("turno: " + turn);
        console.log ("level: " + level );
        console.log("tamanho "+ tam);

        var mudWidth = (tamTotal * 100);
        document.getElementById('play-area').style.width = mudWidth.toString() + "px";
        maxColums = tamTotal;
        maxBolas = tamTotal;
        dx = mudWidth / maxColums;
        dy = 400 / maxBolas;

        numBolas = 0;
        var playArea = document.getElementById("play-area");

        var numDeColunas = maxColums;

        document.getElementById("play-button").style.display = "none";         //Ocultar butao para comecar o jogo

        //Escolher com random o numero de bolas por cada coluna e guardar num array
        bolas = new Array(numDeColunas);
        for (var i = 0; i < numDeColunas; i++)
            bolas[i] = new Array(getRandomInt(2, maxBolas));

        // Imprimir as bolas no tabuleiro
        for (i = 0; i < bolas.length; i++) {
            for (var j = 0; j < bolas[i].length; j++) {
                bolas[i][j] = new Bola(((20 + i * dx)), (400 - (dy + j * dy)), i, j);
                playArea.appendChild(bolas[i][j].element);
                bolas[i][j].element.classList.add("token");

                // Escolher a localizacao das bolas no tabuleiro
                bolas[i][j].element.style.left = bolas[i][j].pos_x + "px";
                bolas[i][j].element.style.top = bolas[i][j].pos_y + "px";
                numBolas++;
            }
        }

        console.log(numBolas);
        // Jogar primeiro a IA
        if (!first) {
            delayTurnoIA();
        }
    };

    // APAGAR O TABULEIRO
    var removeGame = function () {
        for (i = 0; i < bolas.length; i++) {
            for (var j = 0; j < bolas[i].length; j++) {
                bolas[i][j].remove();
            }
        }
    };

    // RETORNA UM INTEIRO ALEATORIO
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // FUNCAO QUUE COMELA O JOGO DA IA
    var delayTurnoIA = function () {
        window.setTimeout(comecarTurnoIA, 200);
    };

    // JOGO DA IA
    var comecarTurnoIA = function () {
        var nimSumTodos,          // Soma de todos os tamanhos das colunas
            nimSumCada = new Array(bolas.length),          // Soma em separado de cada coluna
            selectedCol, selectedBol;          // Indices da bola selecionada pela IA

        nimSumTodos = bolas[0].length;               // Calcular a soma de todos os tamanhos das colunas com XOR
        for (var i = 1; i < bolas.length; i++)
            nimSumTodos ^= bolas[i].length;

        // Se nimSumTodos for igual a 0, entao IA escolhe uma bola a sorte (random)
        if (nimSumTodos === 0 || level === 1) {
            console.log("aleatorio");
            selectedCol = getRandomInt(0, bolas.length - 1);
            selectedBol = getRandomInt(0, bolas[selectedCol].length - 1);
        }
        // Se nao utiliza Inteligencia Artificial
        else {
            // Numero de bolas em cada coluna XOR num total de bolas
            for (i = 0; i < bolas.length; i++)
                nimSumCada[i] = bolas[i].length ^ nimSumTodos;

            // Escolhe a coluna onde nimSumcada for maior que o numerod e bolas em essa coluna
            for (i = 0; i < bolas.length; i++) {
                if (nimSumCada[i] < bolas[i].length) {
                    selectedCol = i;
                    selectedBol = nimSumCada[i];
                    break;
                }
            }
        }
        // Sublinha a jogada da IA
        bolas[selectedCol][selectedBol].sublinhar();

        // Faz a jogada ou remove a bola depois de 200ms
        // As with the event listeners, the value of "this" needs to be corrected with bind()
        window.setTimeout(bolas[selectedCol][selectedBol].remove.bind(bolas[selectedCol][selectedBol]), 200);
    };

    // CONTROL
    return {
        init: function (tamTotal) {          // Chama a funcao para comecar o jogo
            startGame(tamTotal);
        },
        remove: function () {          // Chama a funcao para remover o jogo
            removeGame();
        }
    };
})();

/********************************************************** DIVISOES **********************************************************/

//Começar jogo
function iniciar() {
    comecou = true;
    Nim.init(tam);
}

//Refresh do jogo (comecar um jogo novo)
function refresh() {
    comecou = false;

    document.getElementById("play-button").remove();
    document.getElementById("play-area").remove();
    document.getElementById("divDesistir").remove();

    var iDiv = document.createElement('div');
    iDiv.id = 'play-area';
    iDiv.style.zIndex = 0;


    var btn = document.createElement("BUTTON");        // Create a <button> element
    var t = document.createTextNode("Click to play");       // Create a text node
    btn.id = 'play-button';
    btn.appendChild(t);                                // Append the text to <button>
    iDiv.appendChild(btn);                    // Append <button> to <body>

    document.getElementById('wrapper').appendChild(iDiv);
    document.getElementById('play-button').style.display = 'block';

    document.getElementById("play-button").addEventListener("click", iniciar);

    //Criar button desistir
    var iDes = document.createElement('div');
    iDes.id = 'divDesistir';
    iDes.style.textAlign = 'center';
    iDes.style.top = '30px';
    // Crear butao desistir
    var btnDes = document.createElement("BUTTON");
    btnDes.className = 'buttons-options';
    btnDes.addEventListener("click", desistir);
    var text = document.createTextNode("Desistir");
    btnDes.appendChild(text);
    iDes.appendChild(btnDes);

    document.getElementById('wrapper').appendChild(iDes);

    hideDiv(3);

    // Atualizar Tabela
    document.getElementById("vicTam5").innerHTML = numVitorias[0].toString();
    document.getElementById("vicTam6").innerHTML = numVitorias[1].toString();
    document.getElementById("vicTam7").innerHTML = numVitorias[2].toString();

    document.getElementById("derrTam5").innerHTML = numDerrotas[0].toString();
    document.getElementById("derrTam6").innerHTML = numDerrotas[1].toString();
    document.getElementById("derrTam7").innerHTML = numDerrotas[2].toString();

}

// Ocultar Div
function hideDiv(num) {
    var namediv = divs[num];
    var objectdiv = document.getElementById(namediv);
    objectdiv.style.visibility = "hidden";
}

// Mostrar Div
function showDiv(num) {
    var access = true;

    if(document.getElementById(divs[3]).style.visibility === "visible") {
        access = confirm("As configurações vã ser guardadas. Deseja continuar?") === true;
    }


    if(access) {
        var namediv;
        var objectdiv;
        for (i = 3; i >= 0; i--) {
            if (i === num) {
                namediv = divs[i];
                objectdiv = document.getElementById(namediv);
                if (objectdiv.style.visibility === "visible")
                    hideDiv(i);
                else if (access) {
                    console.log("i " + i);
                    objectdiv.style.visibility = "visible";
                }

            }
            else {
                hideDiv(i);
            }
        }
    }
}


/********************************************************** CONFIGURATION **********************************************************/

// Reset predfinido
function resetPred() {
    getSize(5);
    getVs('ia');
    getFirst(1);
    getLevel(1);
}

//Ler o tamanho
function  getSize(size) {
    /* Reset valores */
    for(i=5; i<8; i++){
        document.getElementById("cs".concat(i)).className = "non-selected";
    }
    tam = size;
    var id = "cs".concat(size);
    document.getElementById(id).className = "selected";
}

//Ler oponente
function getVs(name) {
    /* Reset valores */
    document.getElementById('vsIa').className = "non-selected";
    document.getElementById('vsJogador').className = "non-selected";

    vs = name;
    if(name === 'ia'){
        document.getElementById('vsIa').className = "selected";
    }
    else{
        document.getElementById('vsJogador').className = "selected";
    }
}

//Ler primeiro a jogar
function getFirst(num){
    /* Reset valores */
    document.getElementById('comecaS').className = "non-selected";
    document.getElementById('comecaN').className = "non-selected";
    if(num === 1){
        first = true;
        turn = 0;
        document.getElementById('comecaS').className = "selected";
    }
    else if (num === 2){
        first = false;
        turn = 1;
        document.getElementById('comecaN').className = "selected";
    }
}

function getLevel(nivel) {
    /* Reset valores */

    document.getElementById("cl1").className = "non-selected";
    document.getElementById("cl2").className = "non-selected";

    level = nivel;
    var id = "cl".concat(nivel);
    document.getElementById(id).className = "selected";
}


/********************************************************** OTHERS **********************************************************/


//Ocultar todas as divs
function hideAll() {
    var access = true;
    if(document.getElementById(divs[3]).style.visibility === "visible") {
        access = confirm("As configurações vã ser guardadas. Deseja continuar?") === true;
    }
    if(access) {
        for (i = 0; i < divs.length; i++) {
            hideDiv(i);
        }
    }
}

//Alerta Coming soon
function comingSoon() {
    alert("Coming soon...")
}

//Reset dos pontos
function resetPoints() {
    for(i=0; i<4; i++) {
        numVitorias[i] = 0;
        numDerrotas[i] = 0;
    }
    refresh();
}

//Desitir do jogo
function desistir() {
    if(comecou) {
        if (confirm("Se desistir do jogo vai contar como derrota. Desja contiunar?") === true) {
            if (tam === 5) {
                numDerrotas[0]++;
            }
            else if (tam === 6) {
                numDerrotas[1]++;
            }
            else {
                numDerrotas[2]++;
            }
            refresh();
        }
    }
    else {
        alert("O jogo ainda não começou!");
    }
}

/********************************************************** 
JSON 
**********************************************************/

function loginRegister(){
    
    var xhr = new XMLHttpRequest();
    var display = this.display;
    xhr.open("POST","http://twserver.alunos.dcc.fc.up.pt:8008/register", true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var data = JSON.parse(xhr.responseText);
        }
    }
    xhr.send(JSON.stringify({"nick": username, "pass": password}));
    
    
}