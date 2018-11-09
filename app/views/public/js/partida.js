// se o primeiro valor for 1 o usuário tem permição para pickar
// se o segundo valor for 1 o usuário é do time 2 se 0 é do time 1
var config = [1, 0];

var picks = {};
var key = 'jogador';
var key2 = 'capitao';
picks[key] = [];

var time1 = {};
time1[key] = [];
time1[key2] = [];

var time2 = {};
time2[key] = [];
time2[key2] = [];


var data = {
  id: '1',
  nome: 'BalacoBakko',
  rank: '6',
  idimg: '39244'
};

var data2 = {
  id: '2',
  nome: 'Nalfu',
  rank: '7',
  idimg: '39270'
};

var data3 = {
  id: '3',
  nome: 'Boccato',
  rank: '1',
  idimg: '39255'
};

var data4 = {
  id: '4',
  nome: 'Techzz',
  rank: '4',
  idimg: '39253'
};

var data5 = {
  id: '5',
  nome: 'Jonais',
  rank: '2',
  idimg: '39251'
};

var data6 = {
  id: '6',
  nome: 'Lukks',
  rank: '3',
  idimg: '39219'
};


picks[key].push(data);
picks[key].push(data2);

picks[key].push(data3);
picks[key].push(data4);

picks[key].push(data5);
picks[key].push(data6);

gerarCapitaes();

function gerarCapitaes() {

  capitao1 = [0, picks[key][0].rank];
  capitao2 = [0, picks[key][0].rank];

  for (var i = 1; i < picks[key].length; i++) {
    if (picks[key][i].rank < capitao1[1]) {
      capitao1[0] = i;
      capitao1[1] = picks[key][i].rank;
    }
  }

  time1[key2].push(picks[key][capitao1[0]]);

  picks[key].splice(capitao1[0], 1);

  for (var i = 1; i < picks[key].length; i++) {
    if (picks[key][i].rank < capitao2[1]) {
      if (picks[key][i].rank != capitao1[1]) {
        capitao2[0] = i;
        capitao2[1] = picks[key][i].rank;
      }
    }
  }

  time2[key2].push(picks[key][capitao2[0]]);

  picks[key].splice(capitao2[0], 1);
}

atualizarTela();

function atualizarTela() {

  tblPick = document.getElementById("picks");
  tblTime1 = document.getElementById("time1");
  tblTime2 = document.getElementById("time2");

  tblPick.innerHTML = '';
  tblTime1.innerHTML = '';
  tblTime2.innerHTML = '';

  headerRow = '<div class="player-profile" id="';
  headerRowCapitao = '<div class="player-profile capitao" id="';

  for (var i = 0; i < picks[key].length; i++) {
    imgLink = 'https://battlerite.club/_Assets/images/avatar/' + picks[key][i].idimg + '.png';

    perfil = headerRow + picks[key][i].id + '" onclick="pickar('+picks[key][i].id+')">';
    perfil += '<img class="img-profile" src="' + imgLink + '">'
    perfil += '<div class="profile-itens">';
    perfil += '<span class="item">'+picks[key][i].nome+'</span>';
    perfil += '<span class="item">Rank: '+picks[key][i].rank+'</span>';
    perfil += '</div>';
    perfil += '</div>'

    tblPick.innerHTML += perfil;
  }

  imgLink = 'https://battlerite.club/_Assets/images/avatar/' + time1[key2][0].idimg + '.png';

  perfil = headerRowCapitao + time1[key2][0].id + '">';
  perfil += '<img class="img-icon" src="../imgs/capitao_icon.png">';
  perfil += '<img class="img-profile" src="' + imgLink + '"></img>';
  perfil += '<div class="profile-itens">';
  perfil += '<span class="item">'+time1[key2][0].nome+'</span>';
  perfil += '<span class="item">Rank: '+time1[key2][0].rank+'</span>';
  perfil += '</div>';
  perfil += '</div>';

  tblTime1.innerHTML += perfil;

  for (var i = 0; i < time1[key].length; i++) {
    imgLink = 'https://battlerite.club/_Assets/images/avatar/' + time1[key][i].idimg + '.png';

    perfil = headerRow + time1[key][i].id + '">';
    perfil += '<img class="img-profile" src="' + imgLink + '"></img>';
    perfil += '<div class="profile-itens">';
    perfil += '<span class="item">'+time1[key][i].nome+'</span>';
    perfil += '<span class="item">Rank: '+time1[key][i].rank+'</span>';
    perfil += '</div>';
    perfil += '</div>';


    tblTime1.innerHTML += perfil;
  }

  imgLink = 'https://battlerite.club/_Assets/images/avatar/' + time2[key2][0].idimg + '.png';

  perfil = headerRowCapitao + time2[key2][0].id + '">';
  perfil += '<img class="img-icon" src="../imgs/capitao_icon.png">';
  perfil += '<img class="img-profile" src="' + imgLink + '"></img>';
  perfil += '<div class="profile-itens">';
  perfil += '<span class="item">'+time2[key2][0].nome+'</span>';
  perfil += '<span class="item">Rank: '+time2[key2][0].rank+'</span>';
  perfil += '</div>';
  perfil += '</div>';

  tblTime2.innerHTML += perfil;

  for (var i = 0; i < time2[key].length; i++) {
    imgLink = 'https://battlerite.club/_Assets/images/avatar/' + time2[key][i].idimg + '.png';

    perfil = headerRow + time2[key][i].id + '">';
    perfil += '<img class="img-profile" src="' + imgLink + '"></img>';
    perfil += '<div class="profile-itens">';
    perfil += '<span class="item">'+time2[key][i].nome+'</span>';
    perfil += '<span class="item">Rank: '+time2[key][i].rank+'</span>';
    perfil += '</div>';
    perfil += '</div>';

    tblTime2.innerHTML += perfil;
  }

}

function pickar(btrid) {
  for (var i = 0; i < picks[key].length; i++) {
    if (picks[key][i].id == btrid) {
      console.log(btrid);
      if (config[0] == 1) {
        if (config[1] == 0) {
          time1[key].push(picks[key][i]);
        } else {
          time2[key].push(picks[key][i]);
        }
        picks[key].splice(i, 1);
        atualizarTela();
        if (config[1] == 0)
          config[1] = 1;
        else {
          config[1] = 0;
        }
      }
    }
  }
}
