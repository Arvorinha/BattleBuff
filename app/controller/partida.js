function verificarPermicao(req, done) {
  //checar se o usuário está logado
  if (req.session.verificarSessao) {
    //destruir sessão
    if (typeof req.query.sair != "undefined" && req.query.sair == "sim") {
      req.session.destroy();
    }
    //checar se o usuário tem permição
    else {
      if (typeof req.session.autenticado == 'undefined')
        return done(Error('NAO-AUTENTICADO'));
      else
        return done(null);
    }
  } else
    return done(Error('NAO-LOGADO'));
}

module.exports.resultadoPartida = function(app, req, res) {
  var api = app.config.battlerite;
  var partidaUtils = app.app.utils.PartidaUtils;

  async function getPartida(matchID) {
    return new Promise(function(resolve, reject) {
      api().getMatch(matchID).then((response) => {

        contador = 0;

        var match = []
        var keyTime = 'times';
        var keyJogador = 'jogadores';
        match[keyTime] = []; // empty Array, which you can push() values into

        var roundsTotal = 0;
        var roundsTime1 = 0;
        var roundsTime2 = 0;

        for (var i = 0; i < response.included.length; i++) {
          const element = response.included[i];
          if (element.type == 'round') {
            roundsTotal += 1;
            if (element.attributes.stats.winningTeam == 2)
              roundsTime2 += 1;
            else
              roundsTime1 += 1;
          }
        }

        var data = {
          matchID: response.data.id,
          duracao: response.data.attributes.duration,
          roundsTotal: roundsTotal
        };

        match.push(data);

        //pegar ids dos times
        var timesIDs = [];
        timesIDs.push(response.data.relationships.rosters.data[0].id);
        timesIDs.push(response.data.relationships.rosters.data[1].id);

        for (let i = 0; i < response.included.length; i++) {
          const rosterElement = response.included[i];

          if (rosterElement.id == timesIDs[0] || rosterElement.id == timesIDs[1]) {

            if (rosterElement.id == timesIDs[0]) {
              var data = {
                timeWonStatus: rosterElement.attributes.won,
                roundsGanhos: roundsTime1
              };
            } else {
              var data = {
                timeWonStatus: rosterElement.attributes.won,
                roundsGanhos: roundsTime2
              };
            }
            match[keyTime].push(data);

            if (contador == 0) {
              timei = 0;
              match[keyTime][0][keyJogador] = [];
              contador += 1;
            } else {
              timei = 1;
              match[keyTime][1][keyJogador] = [];
            }

            for (let i = 0; i < rosterElement.relationships.participants.data.length; i++) {
              const participantElement = rosterElement.relationships.participants.data[i];

              for (let i = 0; i < response.included.length; i++) {
                const rosterElement = response.included[i];
                if (rosterElement.id == participantElement.id) {

                  var heroName = '';
                  var heroIcon = '';
                  //PEGAR NOME DO HERO
                  var heroID = rosterElement.attributes.actor;
                  var heros = require('./../utils/stackables.json');
                  for (let i = 0; i < heros.Mappings.length; i++) {
                    const element = heros.Mappings[i];
                    if (element.typeID == heroID && element.StackableRangeName == 'Characters') {
                      heroName = element.EnglishLocalizedName;
                      heroIcon = element.Icon;
                    }
                  }
                  ////////////////////

                  var data = {
                    jogadorID: rosterElement.relationships.player.data.id,
                    heroName: heroName,
                    heroIcon: heroIcon,
                    deaths: rosterElement.attributes.stats.deaths,
                    kills: rosterElement.attributes.stats.kills,
                    dano: rosterElement.attributes.stats.damageDone,
                    dadoR: rosterElement.attributes.stats.damageReceived,
                    cura: rosterElement.attributes.stats.healingDone,
                    curaR: rosterElement.attributes.stats.healingReceived,
                    controle: rosterElement.attributes.stats.disablesDone,
                    controleR: rosterElement.attributes.stats.disablesReceived,
                    energia: rosterElement.attributes.stats.energyGained,
                    energiaR: rosterElement.attributes.stats.energyUsed,
                    score: rosterElement.attributes.stats.score
                  };
                  match[keyTime][timei][keyJogador].push(data);
                }
              }
            }
          }
        }

        //pegar nome dos jogadores
        ids = [];

        for (let i = 0; i < match.times.length; i++) {
          time = match.times[i];
          for (let i = 0; i < time.jogadores.length; i++) {
            jogador = time.jogadores[i];
            ids.push(jogador.jogadorID);
          }
        }

        api().getPlayersByIds(ids).then((response) => {

          for (let i = 0; i < response.data.length; i++) {
            id = response.data[i].id;
            nome = response.data[i].attributes.name;

            for (let i = 0; i < match.times.length; i++) {
              time = match.times[i];
              for (let i = 0; i < time.jogadores.length; i++) {
                jogador = time.jogadores[i];

                if (jogador.jogadorID == id) {
                  jogador["jogadorNome"] = nome;
                }
              }
            }
          }

          resolve(match); //resultado

        }).catch((error) => {
          console.log(error.response.statusText);
          res.send(error.response.status + ': ' + error.response.statusText);
        });
      }).catch((error) => {
        console.log(error.response.statusText);
        res.send(error.response.status + ': ' + error.response.statusText);
      });
    });
  }

  // verificarPermicao(req, function(err) {
  //   if (err)
  //     res.redirect('/');
  //   else {
  getPartida(req.params.partidaID).then(function(result) {

    partidaUtils.sortJSON(result.times, 'timeWonStatus');

    res.render('resultadoPartida', {
      session: req.session,
      match: result
    });
  });
  //   }
  // });
}
