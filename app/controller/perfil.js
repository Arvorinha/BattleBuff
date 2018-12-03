var moment = require('moment');

module.exports.perfil = function (app,req,res) {
  console.log(req.session);
  var connection = app.config.dbConnection;
  var sDAO = new app.app.model.salaDAO(connection);
  var seasonDAO = new app.app.model.SeasonDAO(connection);
  var battlerite = app.config.battlerite;
  var seasonUtils = app.app.utils.SeasonUtils;

  function getAllSalasByJogador() {
    return new Promise(function (resolve,reject) {
      sDAO.findAll(function (error,results,fields) {
        if (error) {
          throw error;
        }
        console.log(results);
        resolve(results);
      })
    })
  }

  async function lastSeasonId() {
    return new Promise(function (resolve, reject) {
      seasonDAO.lastSeasonId(function (error, results, fields) {
        if (error) {
          throw error
        }
        resolve(results)
      })
    });
  }

  function render(partidas,jogador) {
    console.log(jogador);
    res.render('perfil',{
      session:req.session,
      moment:moment,
      partidas:'',
      jogador:jogador
    })
  }
  var foto;
  var nick;
  var id;
  var title;
  var leagueName;
  var seasonID;
  lastSeasonId().then(function (resultado) {
    seasonID = resultado[0].ID_SEASON;
  }).then(function () {
    battlerite().getPlayerById(String(req.params.btrid)).then((response) => {
      foto = response.data.attributes.stats.picture;
      nick = response.data.attributes.name;
      id = response.data.id;

      titleid = response.data.attributes.stats.title;
      var titles = require('./../utils/Titles.json');
      for (var i in titles.Titles) {
        if (titles.Titles[i].StackableID == titleid) {
          title = titles.Titles[i].Text;
        }
      }

      battlerite().getTeamsByPlayerId(req.params.btrid, seasonID).then((response) => {
          var ligaID = response.data[0].attributes.stats.league;
          leagueName = seasonUtils.getLeagueName(ligaID);
          return true
        }).catch((error) => {
          console.log(error.response.status);
          if (error.response.status == 404) {
              leagueName = seasonUtils.getLeagueName(0);
            }
        }).then(function () {
          getAllSalasByJogador().then(function (results) {
            render(results,[foto,nick,title,leagueName]);
          })
        })

    }).catch((error) => {
      // console.log(error);
    })
  })

};
