module.exports.verify = function (app, req, res) {
  var pool = app.config.dbConnection;
  var steamDAO = new app.app.model.JogadorDAO(pool);
  var keyDAO = new app.app.model.KeyDAO(pool);
  var adminDAO = new app.app.model.AdminDAO(pool);
  var seasonDAO = new app.app.model.SeasonDAO(pool);
  var battlerite = app.config.battlerite;
  var steamID = req.user.steamid;
  var seasonUtils = app.app.utils.SeasonUtils;

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

  async function findBySteam64() {
    return new Promise(function (resolve, reject) {
      steamDAO.findBySteam64(steamID, function (error, results, fields) {
        if (error) {
          throw error
        }
        resolve(results)
      })
    });
  }

  async function findByBtrid() {
    return new Promise(function (resolve, reject) {
      keyDAO.findByBtrid(req.session.btrid, function (error, results, fields) {
        if (error) {
          throw error;
        }
        resolve(results)
      })
    });
  }

  async function findByIdAdmin(userid) {
    return new Promise(function (resolve, reject) {
      adminDAO.findById(userid, function (error, results, fields) {
        if (error) {
          throw error;
        }
        resolve(results)
      })
    });
  }

  findBySteam64().then(function (results) {
    //Remove sessao criada pelo pacote steam-login
    delete req.session.steamUser;
    req.user = null;
    /*********************************************/
    if (!results.length) {
      console.log('usuario nao registrado, efetuando cadastro');
      battlerite().getPlayerBySteamId(steamID).then((response) => {
        var btrID = response.data[0].id;
        nick = response.data[0].attributes.name;
        img = response.data[0].attributes.stats.picture;
        steamDAO.insert(steamID, btrID, function (error, results, fields) {
          if (error) {
            console.log(error);
          }
          req.session.nick = nick;
          req.session.img = img;
          findBySteam64().then(function (resultado) {
            if (resultado.length) {
              req.session.sessaoAutorizada = true;
              req.session.id_jogador = resultado[0].ID_JOGADOR;
              var userid = resultado[0].ID_JOGADOR;
              req.session.steamid = resultado[0].STEAM64;
              req.session.btrid = resultado[0].BTRID;
              req.session.verificarSessao = true;
              return userid;
            }
          }).then(function (userid) {
            findByBtrid().then(function (findByBtrid) {
              console.log(findByBtrid);
              if (findByBtrid.length) {
                if (findByBtrid[0].BTRID == req.session.btrid) {
                  req.session.autenticado = true;
                }
              }
              return userid;
            }).then(function (userid) {
              findByIdAdmin(userid).then(function (findByIdAdmin) {
                //PEGAR NOME DA LIGA ATUAL DO JOGADOR//
                lastSeasonId().then(function (lastSeasonId) {
                  seasonID = lastSeasonId[0].ID_SEASON;
                  return userid;
                }).then(function (userid) {
                  battlerite().getTeamsByPlayerId(req.session.btrid, seasonID).then((response) => {
                    var ligaID = response.data[0].attributes.stats.league;
                    var leagueName = seasonUtils.getLeagueName(ligaID);
                    req.session.league = leagueName;
                    if (findByIdAdmin.length) {
                      req.session.sessaoAdmin = true;
                      //console.log(req.session.sessaoAdmin + 'a');
                      res.redirect('/');
                    } else {
                      res.redirect('/');
                    }
                  }).catch((error) => {
                    console.log(error.response.status);
                    if (error.response.status == 404) {
                      var leagueName = seasonUtils.getLeagueName(0);
                      req.session.league = leagueName;
                    }
                    if (findByIdAdmin.length) {
                      req.session.sessaoAdmin = true;
                      //console.log(req.session.sessaoAdmin + 'a');
                      res.redirect('/');
                    } else {
                      res.redirect('/');
                    }
                  });
                });
              })
            })
          })
        })
      }).catch((error) => {
        req.session.erros = error;
        return res.redirect('/error')
      })
    } else {
      console.log('ja registrado, efetuando login');
      battlerite().getPlayerBySteamId(steamID).then((response) => {
        nick = response.data[0].attributes.name;
        img = response.data[0].attributes.stats.picture;
        titleid = response.data[0].attributes.stats.title;
        var titles = require('./test.json');
        for (var i in titles.Titles) {
          if (titles.Titles[i].StackableID == titleid) {
            req.session.title = titles.Titles[i].Text;
          }
        }
        req.session.nick = nick;
        req.session.img = img;
        req.session.sessaoAutorizada = true;
        req.session.id_jogador = results[0].ID_JOGADOR;
        var userid = results[0].ID_JOGADOR;
        req.session.steamid = results[0].STEAM64;
        req.session.btrid = results[0].BTRID;
        var btrID = response.data[0].id;
        req.session.verificarSessao = true;
        return userid;
      }).catch((error) => {
        console.log(error);
        req.session.erros = error;
        return res.redirect('/error')
      }).then(function (userid) {
        findByBtrid().then(function (findByBtrid) {
          if (findByBtrid.length) {
            if (findByBtrid[0].BTRID == req.session.btrid) {
              req.session.autenticado = true;
            }
          }
          return userid;
        }).then(function (userid) {
          findByIdAdmin(userid).then(function (findByIdAdmin) {
            //PEGAR NOME DA LIGA ATUAL DO JOGADOR//
            lastSeasonId().then(function (lastSeasonId) {
              seasonID = lastSeasonId[0].ID_SEASON;
              return userid;
            }).then(function (userid) {
              battlerite().getTeamsByPlayerId(req.session.btrid, seasonID).then((response) => {
                var ligaID = response.data[0].attributes.stats.league;
                var leagueName = seasonUtils.getLeagueName(ligaID);
                req.session.league = leagueName;
                if (findByIdAdmin.length) {
                  req.session.sessaoAdmin = true;
                  //console.log(req.session.sessaoAdmin + 'a');
                  res.redirect('/');
                } else {
                  res.redirect('/');
                }
              }).catch((error) => {
                console.log(error.response.status);
                if (error.response.status == 404) {
                  var leagueName = seasonUtils.getLeagueName(0);
                  req.session.league = leagueName;
                }
                if (findByIdAdmin.length) {
                  req.session.sessaoAdmin = true;
                  //console.log(req.session.sessaoAdmin + 'a');
                  res.redirect('/');
                } else {
                  res.redirect('/');
                }
              });
            });
          });
        });
      });
    }
  })
  //
  //   var sessoes = function(){
  //     steamDAO.findBySteam64(steamID,async function(error, results, fields){
  //       if (error) {
  //         throw error;
  //       }
  //       console.log(results[0].ID_JOGADOR);
  //       req.session.sessaoAutorizada = true;
  //       req.session.id_jogador = results[0].ID_JOGADOR;
  //       var userid = results[0].ID_JOGADOR;
  //       req.session.steamid = results[0].STEAM64;
  //       req.session.btrid = results[0].BTRID;
  //       req.session.verificarSessao = true;
  //       keyDAO.findByIdJogador(req.session.btrid,function(error, results, fields){
  //         if (error) {
  //           throw error;
  //         }
  //         if (results.length > 0) {
  //           if (results[0].BTRID == req.session.btrid) {
  //             req.session.autenticado = true;
  //           }
  //         }
  //       adminDAO.findById(userid ,function(error, results, fields){
  //         if (error) {
  //           throw error;
  //         }
  //         if (results.length > 0) {
  //           req.session.sessaoAdmin = true;
  //           //console.log(req.session.sessaoAdmin + 'a');
  //           res.redirect('/');
  //         }
  //         else{
  //           res.redirect('/');
  //         }
  //       });
  //     });
  //     });
  //   }
  //
  //
  //   steamDAO.findBySteam64(req.user.steamid, function(error, results, fields){
  //     if(error){
  //       console.log(error.stack);
  //     }
  //     else {
  //       console.log(results);
  //       //Remove sessao criada pelo pacote steam-login
  //       delete req.session.steamUser;
  //       req.user = null;
  //       /*********************************************/
  //       if (!results.length) {
  //         battlerite().getPlayerBySteamId(steamID).then((response) => {
  //           var btrID = response.data[0].id;
  //           nick = response.data[0].attributes.name;
  //           img = response.data[0].attributes.stats.picture;
  //           steamDAO.insert(steamID, btrID, function(error, results, fields){
  //             if (error) {
  //               console.log(error);
  //             }
  //             req.session.nick = nick;
  //             req.session.img = img;
  //             sessoes();
  //           })
  //         }).catch((error) => {
  //           req.session.erros = error;
  //           return res.redirect('/error')
  //         });
  //       }else {
  //         battlerite().getPlayerBySteamId(steamID).then((response) => {
  //           req.session.nick = response.data[0].attributes.name;
  //           req.session.img = response.data[0].attributes.stats.picture;
  //           sessoes();
  //         }).catch((error) => {
  //             console.log(error.response.status);
  //         });
  //       }
  //     }
  // });
  // setTimeout(function(){
  //   res.redirect('/');
  // },1500);
  //
}