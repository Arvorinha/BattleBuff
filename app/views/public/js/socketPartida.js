// se o primeiro valor for 1 o usuário tem permição para pickar
// se o segundo valor for 1 o usuário é do time 2 se 0 é do time 1
var pickar = 0;

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
//
// function gerarCapitaes() {
//
//   capitao1 = [0, picks[key][0].rank];
//   capitao2 = [0, picks[key][0].rank];
//
//   for (var i = 1; i < picks[key].length; i++) {
//     if (picks[key][i].rank < capitao1[1]) {
//       capitao1[0] = i;
//       capitao1[1] = picks[key][i].rank;
//     }
//   }
//
//   time1[key2].push(picks[key][capitao1[0]]);
//
//   picks[key].splice(capitao1[0], 1);
//
//   for (var i = 1; i < picks[key].length; i++) {
//     if (picks[key][i].rank < capitao2[1]) {
//       if (picks[key][i].rank != capitao1[1]) {
//         capitao2[0] = i;
//         capitao2[1] = picks[key][i].rank;
//       }
//     }
//   }
//
//   time2[key2].push(picks[key][capitao2[0]]);
//
//   picks[key].splice(capitao2[0], 1);
// }

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

  if (picks[key].length > 0) {
    for (var i = 0; i < picks[key].length; i++) {
      imgLink = 'https://battlerite.club/_Assets/images/avatar/' + picks[key][i].idimg + '.png';

      perfil = headerRow + picks[key][i].id + '" onclick="pick(' + picks[key][i].id + ')">';
      perfil += '<img class="img-profile" src="' + imgLink + '">'
      perfil += '<div class="profile-itens">';
      perfil += '<span class="item">' + picks[key][i].nome + '</span>';
      perfil += '<span class="item">Rank: ' + picks[key][i].rank + '</span>';
      perfil += '</div>';
      perfil += '</div>'

      tblPick.innerHTML += perfil;
    }
  }

  if (time1[key2].length > 0) {
    imgLink = 'https://battlerite.club/_Assets/images/avatar/' + time1[key2][0].idimg + '.png';

    perfil = headerRowCapitao + time1[key2][0].id + '">';
    perfil += '<img class="img-profile" src="' + imgLink + '"></img>';
    perfil += '<div class="profile-itens">';
    perfil += '<span class="item">' + time1[key2][0].nome + '</span>';
    perfil += '<span class="item">Rank: ' + time1[key2][0].rank + '</span>';
    perfil += '</div>';
    perfil += '</div>';

    tblTime1.innerHTML += perfil;
  }

  if (time1[key].length > 0) {
    for (var i = 0; i < time1[key].length; i++) {
      imgLink = 'https://battlerite.club/_Assets/images/avatar/' + time1[key][i].idimg + '.png';

      perfil = headerRow + time1[key][i].id + '">';
      perfil += '<img class="img-profile" src="' + imgLink + '"></img>';
      perfil += '<div class="profile-itens">';
      perfil += '<span class="item">' + time1[key][i].nome + '</span>';
      perfil += '<span class="item">Rank: ' + time1[key][i].rank + '</span>';
      perfil += '</div>';
      perfil += '</div>';


      tblTime1.innerHTML += perfil;
    }
  }

  if (time2[key2].length > 0) {
    imgLink = 'https://battlerite.club/_Assets/images/avatar/' + time2[key2][0].idimg + '.png';

    perfil = headerRowCapitao + time2[key2][0].id + '">';
    perfil += '<img class="img-profile" src="' + imgLink + '"></img>';
    perfil += '<div class="profile-itens">';
    perfil += '<span class="item">' + time2[key2][0].nome + '</span>';
    perfil += '<span class="item">Rank: ' + time2[key2][0].rank + '</span>';
    perfil += '</div>';
    perfil += '</div>';

    tblTime2.innerHTML += perfil;
  }

  if (time2[key].length > 0) {
    for (var i = 0; i < time2[key].length; i++) {
      imgLink = 'https://battlerite.club/_Assets/images/avatar/' + time2[key][i].idimg + '.png';

      perfil = headerRow + time2[key][i].id + '">';
      perfil += '<img class="img-profile" src="' + imgLink + '"></img>';
      perfil += '<div class="profile-itens">';
      perfil += '<span class="item">' + time2[key][i].nome + '</span>';
      perfil += '<span class="item">Rank: ' + time2[key][i].rank + '</span>';
      perfil += '</div>';
      perfil += '</div>';

      tblTime2.innerHTML += perfil;
    }
  }

}

// function pickar(btrid) {
//   for (var i = 0; i < picks[key].length; i++) {
//     if (picks[key][i].id == btrid) {
//       console.log(btrid);
//       if (config[0] == 1) {
//         if (config[1] == 0) {
//           time1[key].push(picks[key][i]);
//         } else {
//           time2[key].push(picks[key][i]);
//         }
//         picks[key].splice(i, 1);
//         atualizarTela();
//         if (config[1] == 0)
//           config[1] = 1;
//         else {
//           config[1] = 0;
//         }
//       }
//     }
//   }
// }

//SOCKETS FUNCTION

var socket = io.connect();

var url = window.location.href;
var salaID = url.split("/")[4];

socket.on('connect', function() {
  socket.emit('room', salaID);
});

socket.on('turno', function(seuturno) {
  if(seuturno == 1){
    document.getElementById("turno").innerHTML = 'Seu turno de escolha';
    document.getElementById("turno").style.color = "#1AB66E";
  }
  else if(seuturno == 0){
    document.getElementById("turno").innerHTML = 'Turno de escolha do time inimigo';
    document.getElementById("turno").style.color = "#F04747";
  } else {
    document.getElementById("turno").innerHTML = '';
  }
});

socket.on('form resultado', function() {
  document.getElementById("resultado").style.display = "block";
  document.getElementById("resultado").innerHTML = '<span>Reportar resultado:</span><br><div class="caixa"><button type="button" class="btn btn-success" onclick="resultado(true);">Partida Concluída</button></div><div class="caixa"><button type="button" class="btn btn-danger" onclick="resultado(false);">Partida Cancelada</button></div>';
});


socket.on('permicao pick', function() {
  pickar = 1;
  // alert('Sua vez de pickar');
});

function pick(btrid) {
  console.log('PICK');
  if (pickar == 1){
    socket.emit('pick', btrid);
    pickar = 0;
  }
}

socket.on('room users', function(userlist) {
  document.getElementById("nPessoas").innerHTML = userlist;
});

socket.on('list users', function(picksR, time1R, time2R) {
  picks = picksR;
  time1 = time1R;
  time2 = time2R;

  atualizarTela();
});

function credencial(btrid, nick, img, rank) {
  socket.emit('new user', btrid, nick, img, rank);
}


function resultado(finalizado) {
  socket.emit('report resultado', finalizado);
}

socket.on('resultado', function(matchid) {
  if (matchid == 0) {
    document.location.href = '/sala';
  } else {
    document.location.href = '/partida/' + matchid;
  }
});
