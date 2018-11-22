module.exports.rank = function (app,req,res) {
  var dbConnection = app.config.dbConnection;
  var battlerite = app.config.battlerite;
  var rDAO = new app.app.model.RankDAO(dbConnection);
  var sDAO = new app.app.model.SeasonDAO(dbConnection);
  var jDAO = new app.app.model.JogadorDAO(dbConnection);
  var keys = [];
  var rank = [];
  var pagina = req.query.pagina;
  var season = req.query.season;
  var min = 1;
  var numPagina = 0;
  if (!pagina || pagina == 1) {
    pagina = 1;
    min = 0;
  }
  if (pagina > 1) {
    min = (pagina - 1)*7//7 porque é o maximo por pagina
  }

  console.log(req.query);

  if (!season) {
    console.log('caiu aqui');
    getSeasonRankNotNull().then(function (lista) {
      console.log(req.query);
      res.render('rank',{
        session:req.session,
        listaSeasons: lista
      })
    })
  }
  if (season == 0) {
    getSeasonAtualByPage(min).then(function (results) {
      // console.log(results);
      let tempMmr = [];
      let tempKeys = []
      for (var i = 0; i < results.length; i++) {
        tempKeys.push(results[i].BTRID)
        tempMmr.push(results[i].MMR_JOGADOR)
      }
      // console.log(tempKeys);
      // console.log(tempMmr);
      keys.push({keys:tempKeys,mmr:tempMmr})
      return {keys:keys,results:results};
    }).then(function (data) {
        battlerite().getPlayersByIds(data.keys[0].keys).then((response) => {
          for (var i = 0; i < response.data.length; i++) {
            for (var ikeys = 0; ikeys < keys[0].keys.length; ikeys++) {
              if (keys[0].keys[ikeys] == response.data[i].id) {
                rank.push({
                  FOTO:response.data[ikeys].attributes.stats.picture,
                  NICK:response.data[ikeys].attributes.name,
                  MMR:data.keys[0].mmr[i],
                  ID:response.data[ikeys].id
                });
                ikeys = keys.length;
              }
            }
          }
          return rank;
        }).catch((error) => {
          // console.log(error);
        }).then(function (rank) {
          console.log('caiu aqui');
          findAllJogadores().then(function (allJogadores) {
            var paginas = (Math.ceil(allJogadores.length/7));//7 porque é o maximo por pagina
            res.send({rank:rank,paginas:paginas})
          })
        })
    })
  }
  else {
    getRankBySeason(season,min).then(function (results) {
      let tempMmr = [];
      let tempKeys = []
      for (var i = 0; i < results.length; i++) {
        tempKeys.push(results[i].BTRID)
        tempMmr.push(results[i].MMR_RANKING)
      }
      keys.push({keys:tempKeys,mmr:tempMmr})
      return {keys:keys,results:results};
    }).then(function (data) {
      console.log(data.keys);
      battlerite().getPlayersByIds(data.keys[0].keys).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          for (var ikeys = 0; ikeys < keys[0].keys.length; ikeys++) {
            if (keys[0].keys[ikeys] == response.data[i].id) {
              rank.push({
                FOTO:response.data[ikeys].attributes.stats.picture,
                NICK:response.data[ikeys].attributes.name,
                MMR:data.keys[0].mmr[i],
                ID:response.data[ikeys].id
              });
              ikeys = keys.length;
            }
          }
        }
        return rank;
      }).catch((error) => {
        // console.log(error);
      }).then(function (rank) {
        getAllBySeason(season).then(function (allJogadores) {
          var paginas = (Math.ceil(allJogadores.length/7));//7 porque é o maximo por pagina
          res.send({rank:rank,paginas:paginas})
        })
      })
    })
  }

  async function lastSeasonId() {
    return new Promise(function (resolve, reject) {
      sDAO.lastSeasonId(function (error, results, fields) {
        if (error) {
          throw error
        }
        resolve(results)
      })
    });
  }

//Pegar o rank limitando pela paginação de uma season especifica
  async function getRankBySeason(id_season,min) {
    return new Promise(function (resolve,reject) {
      rDAO.findRankByPageAndSeason(id_season,min,function (error,results,fields) {
        if (error) {
          throw error;
        }
        resolve(results);
      })
    })
  }

//Pega o total de rank de uma season especifica
  async function getAllBySeason(id_season) {
    return new Promise(function (resolve,reject) {
      rDAO.findAllRankBySeason(id_season,function (error,results,fields) {
        if (error) {
          throw error;
        }
        resolve(results);
      })
    })
  }

//Pega o rank da season atual
  async function getSeasonAtualByPage() {
    return new Promise(function (resolve,reject) {
      jDAO.findByRank(min,function (error,results,fields) {
        if (error) {
          throw error
        }
        resolve(results)
      })
    })
  }

//Pegar os jogadores
  async function findAllJogadores() {
    return new Promise(function (resolve,reject) {
      jDAO.findAll(function (error,results,fields) {
        if (error) {
          throw error
        }
        resolve(results);
      })
    })
  }

//Pegar a lista de quantas season tem rank
  async function getSeasonRankNotNull() {
    return new Promise(function (resolve,reject) {
      sDAO.findByRankNotNull(function (error,results,fields) {
        if (error) {
          throw error
        }
        resolve(results);
      })
    })
  }
};
