////////////CALENDÁRIO////////////////

var Cal = function(divId) {

    //referencia o id da div do calendário
    this.divId = divId;

    // referencia os dias da semana, iniciando no domingo
    this.DiasDaSem = [
        'DOM',
        'SEG',
        'TER',
        'QUA',
        'QUI',
        'SEX',
        'SAB'
    ];

    // referencia os meses do ano
    this.Meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // pega a data atual
    var d = new Date();

    this.mesAtual = d.getMonth();
    this.anoAtual = d.getFullYear();
    this.diaAtual = d.getDate();

};

// função de ir para o próximo mês
Cal.prototype.proxMes = function() {
    if (this.mesAtual == 11) {
        this.mesAtual = 0;
        this.anoAtual = this.anoAtual + 1;
    } else {
        this.mesAtual = this.mesAtual + 1;
    }
    this.mostraratual();
};

// função de ir para o mês anterior
Cal.prototype.mesAnterior = function() {
    if (this.mesAtual == 0) {
        this.mesAtual = 11;
        this.anoAtual = this.anoAtual - 1;
    } else {
        this.mesAtual = this.mesAtual - 1;
    }
    this.mostraratual();
};

// mostra o mês atual
Cal.prototype.mostraratual = function() {
    this.mostraMes(this.anoAtual, this.mesAtual);
};

// mostra mês (ano, mês)
Cal.prototype.mostraMes = function(y, m) {

    var d = new Date()
        // primeiro dia da semana no mês selecionado
        ,
        primDiaMes = new Date(y, m, 1).getDay()
        // último dia do mês selecionado
        ,
        ultimoDiaMes = new Date(y, m + 1, 0).getDate()
        // último dia do mês anterior
        ,
        ultimoDiaUltimoMes = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();


    var html = '<table>';

    // escreve mês e ano selecionados
    html += '<thead><tr>';
    html += '<td colspan="7"><strong>' + this.Meses[m] + ' ' + y + '</strong></td>';
    html += '</tr></thead>';


    // escreve o cabeçalho dos dias da semana
    html += '<tr class="days">';
    for (var i = 0; i < this.DiasDaSem.length; i++) {
        html += '<td><strong>' + this.DiasDaSem[i] + '</strong></td>';
    }
    html += '</tr>';

    // escreve o dia
    var i = 1;
    do {

        var dow = new Date(y, m, i).getDay();

        // se domingo, comaça nova linha
        if (dow == 0) {
            html += '<tr>';
        }
        // Se não for domingo, mas primeiro dia do mês
        // vai escrever os últimos dias do mês anterior EM ÊNFASE PARA DIFERENCIAR 
        else if (i == 1) {
            html += '<tr>';
            var k = ultimoDiaUltimoMes - primDiaMes + 1;
            for (var j = 0; j < primDiaMes; j++) {
                html += '<td class="nao-atual"><em>' + k + '</em></td>';
                k++;
            }
        }

        // escreve o dia atual no loop
        var datual = new Date();
        var anotual = datual.getFullYear();
        var mestual = datual.getMonth();
        if (anotual == this.anoAtual && mestual == this.mesAtual && i == this.diaAtual) {
            html += '<td class="hoje">' + i + '</td>';
        } else {
            html += '<td class="normal">' + i + '</td>';
        }
        // se sábado, termina linha
        if (dow == 6) {
            html += '</tr>';
        }
        // Se não for sábado, mas último dia do mês selecionado
        // vai escrever nos próximos dias a partir do próximo mês EM ÊNFASE PARA DIFERENCIAR
        else if (i == ultimoDiaMes) {
            var k = 1;
            for (dow; dow < 6; dow++) {
                html += '<td class="nao-atual"><em>' + k + '</em></td>';
                k++;
            }
        }

        i++;
    } while (i <= ultimoDiaMes);

    // fecha tabela
    html += '</table>';

    // escreve HTML na div
    document.getElementById(this.divId).innerHTML = html;
};

// função onload
window.onload = function() {

    // chama calendário
    var c = new Cal("divCal");
    c.mostraratual();

    // funções dos botões prev e next vinculados 
    getId('btnNext').onclick = function() {
        c.proxMes();
    };
    getId('btnPrev').onclick = function() {
        c.mesAnterior();
    };
}

function getId(id) {
    return document.getElementById(id);
}

//////////////TAREFAS/////////////////

function createCloseButton(li) {
    let span = document.createElement("SPAN");
    let txt = document.createTextNode(" ❌");

    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    span.onclick = () => span.parentElement.style.display = "none";
}

document.querySelectorAll('li').forEach(createCloseButton);

document.querySelector('ul').addEventListener('click', (e) => {
    if (e.target.tagName === 'LI')
        e.target.classList.toggle('checked');
});

function add() {
    let li = document.createElement('LI');
    let input_value = document.form_main.task.value;
    let input_text = document.createTextNode(input_value);

    //aqui deveria ser a entrada de tarefas com a tecla enter
    //input_text.addEventListener('keyup', (e) => {
    //if (e.keyCode === 13) {}
    // })
    li.appendChild(input_text);
    document.querySelector('ul').appendChild(li);
    document.form_main.task.value = "";



    createCloseButton(li);

}

//////////TEMPERATURA - API OPENWEATHERMAP////////////

//função para pegar a geolocalização do usuário
function geoUser() {
    let url = ''
    navigator.geolocation.getCurrentPosition((pos) => {
        let lat = pos.coords.latitude
        let long = pos.coords.longitude
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&APPID=2b246542d26932e1a1419fb7a7dc2d92`
        fetchApi(url)
        console.log(url) //aqui é para que, no primeiro acesso, seja perguntado ao user se ele deseja habilitar a geolocalização
    })
}

function fetchApi(url) { //método fetch para consultar a api externa acima 
    let city = document.querySelector('.city')
    let temperature = document.querySelector('#temp')

    fetch(url)
        .then((data) => {
            return data.json()
        })
        .then((data) => {
            let grausCelsius = ((5 / 9) * (data.main.temp - 32)).toFixed(0);

            city.textContent = data.name
            temperature.innerHTML = grausCelsius
        })
        .catch((err) => { //em caso de perda da conexão com a internet, aparecerá a seguinte msg para o usuário
            city.innerText = `Erro! Verifique a sua conexão.`;
            temperature.innerHTML = `-`;
        })
}
geoUser();

////////////CONVERSOR DE MOEDAS////////////////

let valorDigitado = document.querySelector('#valorEmReal')

// seleciona a moeda: dolar, euro, libra ou bitcoin
let moedaSelecionada = document.getElementsByName('moedaEstrangeira')

let aviso = document.querySelector('#aviso')

// selecionar os botoes
let btnConverter = document.querySelector('#btnConverter')
let btnLimpar = document.querySelector('#btnLimpar')

// COTACOES DO DIA 06/01/2022 
let valorDoDolar = 5.71
let valorDoEuro = 6.47
let valorDaLibra = 7.74
let valorDoBitcoin = 244560.20
let valorEmReal = 0

let moedaEstrangeira = ''
let moedaConvertida = 0.00

// mensagem exibida ao user com resultado da conversão
function mensagemFormatada(moedaConvertida) {
    isNaN(valorEmReal) ? valorEmReal = 0 : ''
    console.log("Moeda Convertida " + moedaConvertida)
    aviso.textContent = "O valor " + (valorEmReal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + " convertido em " + moedaEstrangeira + " é " + moedaConvertida
}

// VERIFICAR QUAL BOTAO RADIO ESTA MARCADO checked ou checked == true
// vincular a verificacao a um evento, click no botao Converter
btnConverter.addEventListener('click', function() {
        // FAZER o parseFloat dos valores monetarios (converter String para Float)
        valorEmReal = parseFloat(valorDigitado.value)

        console.log('Escolhe a moeda estrangeira')
        for (let i = 0; i < moedaSelecionada.length; i++) {
            if (moedaSelecionada[i].checked) {
                moedaEstrangeira = moedaSelecionada[i].value
                console.log(moedaEstrangeira)
            }
        }

        // pegar moedaEstrangeira e dividir pelo valorEmReal
        switch (moedaEstrangeira) {

            case 'Dólar':
                moedaConvertida = valorEmReal / valorDoDolar
                mensagemFormatada(moedaConvertida.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
                break

            case 'Euro':
                moedaConvertida = valorEmReal / valorDoEuro
                mensagemFormatada(moedaConvertida.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }))
                break

            case 'Libra':
                moedaConvertida = valorEmReal / valorDaLibra
                mensagemFormatada(moedaConvertida.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' }))
                break

            case 'Bitcoins':
                moedaConvertida = valorEmReal / valorDoBitcoin
                mensagemFormatada(parseFloat(moedaConvertida).toFixed(5))
                break

            default:
                aviso.textContent = 'Escolha uma das moedas estrangeiras acima!'
        }
        isNaN(moedaConvertida) ? moedaConvertida = 0 : ''
    })
    //limpa todos os campos para nova consulta
btnLimpar.addEventListener('click', function() {
    valorDigitado.focus()
    valorDigitado.value = ''
    aviso.textContent = 'Digite o valor, escolha a moeda e clique em converter!'
    moedaSelecionada[0].checked = false
    moedaSelecionada[1].checked = false
    moedaSelecionada[2].checked = false
    moedaSelecionada[3].checked = false
})

//////////////NOTÍCIAS - NEWS API//////////////////

//elementos do formulários para busca das noticias
const busca = document.querySelector('.procurarNoticias');
const inputexto = document.querySelector('.inputxt');
const lista = document.querySelector('.noticialista');
busca.addEventListener('submit', recuperar)
    // função recuperar notícias puxadas da api de acordo com a busca 

function recuperar(e) {
    //alerta para preencher o campo para buscar algo
    if (inputexto.value == '') {
        alert('Preencha o campo para busca!')
    }
    //limpa lista
    lista.innerHTML = ''
    e.preventDefault()

    const apiKey = '50c98b3db33d44498d4bcd84ec7f0c2c'
    let topicos = inputexto.value;
    let url = `https://newsapi.org/v2/everything?q=${topicos}&apiKey=${apiKey}`

    fetch(url).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data)
        data.articles.forEach(article => {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.setAttribute('href', article.url);
            a.setAttribute('target', '_blank');
            a.textContent = article.title;
            li.appendChild(a);
            lista.appendChild(li);

        })
    }).catch((erro) => {
        console.log(erro)
    })
}
///////////////LEMBRETE/////////////////


function novoAlerta() {
    const txtDataEvento = document.querySelector('#dataEvento').value;
    const txtHoraEvento = document.querySelector('#horaEvento').value;
    const txtDescEvento = document.querySelector('#descEvento').value;
    const hoje = new Date();
    const dataEvento = Date.parse(txtDataEvento + ' ' + txtHoraEvento);
    const diff = parseInt(dataEvento - hoje.getTime());

    setTimeout(function() { //função de alerta com o lembrete do user

        alert('ALERTA! ' + txtDescEvento + '!'); //alerta concatenando a msg de alerta que o user inseriu
    }, diff);
}