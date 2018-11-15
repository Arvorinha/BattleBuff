module.exports.key =function(app, req ,res, paginaNome){
  var pool = app.config.dbConnection;
  var KeyDAO = new app.app.model.KeyDAO(pool);
  var AdminDAO = new app.app.model.AdminDAO(pool);
  var battlerite = app.config.battlerite;
  var finalJson = [];
  var keys = {BTRID:[],TX_KEY:[]};
  var maxItemsPerPage = 10;
  var minItemsPerPage = 1;
  var pagina = req.query.pagina;
  if (!pagina) {
    pagina = 1;
  }
  if(pagina > 1) {
    console.log('caiu aqui para minitems');
    minItemsPerPage = maxItemsPerPage * (pagina - 1);
  }
  async function findAll() {
    return new Promise((resolve,reject)=>{
      KeyDAO.findAll((error,results,fields)=>{
        if (error) {
          throw error
        }
        resolve(results)
      })
    })
  }

  async function getKeys() {
    return new Promise(function(resolve, reject) {
      KeyDAO.getKeys(pagina,minItemsPerPage,maxItemsPerPage,function(error,results,fields){
        if (error) {
          throw error
        }
        console.log(pagina,minItemsPerPage,maxItemsPerPage);
        // console.log(results[0][0].TB_KEY.BTRID);
        resolve(results[0])
      })
    });
  }
  getKeys().then(function (results) {
    if (results.length) {
      for (var i = 0; i < results.length; i++) {
        if (results[i].TB_KEY.BTRID) {
          keys.BTRID[i] = results[i].TB_KEY.BTRID;
        }
        keys.TX_KEY[i] = results[i].TB_KEY.TX_KEY;
      }
    }
    return {keys:keys,results:results};
  }).then(function (value) {
    console.log(value.keys.BTRID);
    if (value.keys.BTRID.length > 0) {
      battlerite().getPlayersByIds(value.keys.BTRID).then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          finalJson.push({
            TX_KEY: value.keys.TX_KEY[i],
            BTRID: value.keys.BTRID[i],
            NICK: response.data[i].attributes.name
          })
        }
        for (var i = finalJson.length; i < value.results.length; i++) {
          if(!value.results[i].TB_KEY.BTRID){
            finalJson.push({
              TX_KEY: value.results[i].TB_KEY.TX_KEY,
              NICK: ''
            })
          }
        }
        return finalJson;
      }).catch((error) => {
        console.log(error);
      }).then(function (value) {
        findAll().then(function (findAll) {
          var numPaginas = Math.ceil(findAll.length / maxItemsPerPage);
          res.render('admin', {
              erros:"",
              session:req.session,
              numPaginas: numPaginas,
              results:value,
              pagina:paginaNome,
              sucesso: ''
            });
        })
      });
    }
    else {
      findAll().then(function (findAll) {
        for (var i = 0; i < value.results.length; i++) {
          if(!value.results[i].BTRID){
            finalJson.push({
              TX_KEY: value.results[i].TB_KEY.TX_KEY,
              NICK: null
            })
          }
        }
        console.log(finalJson);
        var numPaginas = Math.ceil(findAll.length / maxItemsPerPage);
        res.render('admin', {
            erros:"",
            session:req.session,
            numPaginas: numPaginas,
            results:finalJson,
            pagina:paginaNome,
            sucesso: ''
          });
      })
    }
  })
  // KeyDAO.getKeys(function(error,results,fields){
  //   if (error) {
  //     throw error
  //   }
  //   // console.log(finalJson);
  //   res.render('admin', {
  //     erros:"",
  //     session:req.session,
  //     queryPaginacao: pagina,
  //     maximoItem: maxItemsPerPage,
  //     numPaginas: numPaginas,
  //     findByUserNull: findByUserNull,
  //     findByUserNotNull: finalJson,
  //     pagina:paginaNome,
  //     sucesso: ''
  //   });
  //   if (results.length > 0) {
  //     for (var i = 0; i < results.length; i++) {
  //       keys.push(results[i].BTRID)
  //     }
  //     console.log(keys.length);
  //     if (keys.length > 0) {
  //
  //     }
  //   }
  // })
  //       var numPaginas = Math.ceil((findByUserNull.rowCount + result.rowCount) / maxItemsPerPage);
  //
  //       res.render('admin', {
  //         erros:"",
  //         session:req.session,
  //         queryPaginacao: pagina,
  //         maximoItem: maxItemsPerPage,
  //         numPaginas: numPaginas,
  //         findByUserNull: findByUserNull,
  //         findByUserNotNull: '',
  //         pagina:paginaNome,
  //         sucesso: ''
  //       });
  //     }
  //     startPage();
  //   })
  // })
}

module.exports.postKey = function(app,req,res){
    var key = "";
    var finalKey = [];
    var qtdKey = 1;
    var repetido = false;
    var quantidade = req.body.quantidade;
    var pool = app.config.dbConnection;
    var KeyDAO = new app.app.model.KeyDAO(pool);
    /*Forçando Erro Pra teste*/
    // var teste = 3;
    var caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if(quantidade == 1 || quantidade == 5 || quantidade == 10 || quantidade == 15 || quantidade == 20){
      while (quantidade > 0) {
        for(var i=0; i < 15; i++){
          if (i == 3 || i == 6 || i == 9 || i == 12) {
            key += "-";
          }
          key += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
          if (i == 14) {
            /*Forçando Erro Pra teste*/
            // if (teste > 1) {
            //   key = "bvS-cXL-CbO-3Ie-1ZI";
            //   teste--;
            //   console.log(teste);
            // }
            for (var c = 0; c < finalKey.length; c++) {
              if (key == finalKey[c]) {
                console.log(key);
                key = "";
                // console.log(key);
                // console.log("Caiu no for para verificar key iguais");
                repetido = true;
              }
            }
            if (repetido) {
              // console.log("caiu no if pra zerar o i");
              // console.log("Valor de I antes= "+i);
              i = -1;
              // console.log("Valor de I depois = "+i);
              //qtdKey--;
              repetido = false;
            }
            else {
              finalKey[qtdKey] = key;
              console.log(finalKey);
            }
          }
        }
        key = "";
        quantidade--;
        qtdKey++;
      }
    }
    else {
      console.log("Quantidade de keys Invalida");
    }

    finalKey.forEach(function(data){
      KeyDAO.findByKey(data,function(error,results,fields){
        if(error){
          console.log(error);
          return
        }
        if (!results.rowCount) {
          KeyDAO.insert(data,function(error,results,fields){
            if(error){
              console.log(error);
              return
            }
          })
        }
      })
    });
    KeyDAO.findAll(function(error,results,fields){
      if(error){
        console.log(error);
        return
      }
      res.redirect('/admin/key');
    });
}

// module.exports.validarKey =async function(app,req,res){
//   var allKeys = req.query.key;
//   var keys = allKeys.split(",");
//   console.log(keys.length);
//   var pool = app.config.dbConnection;
//   var validKey = [];
//   var KeyDAO = new app.app.model.KeyDAO(pool);
//   for (var i = 1; i < keys.length; i++) {
//       KeyDAO.findByKey(keys[i],function(err, result){
//         if (err) {
//           throw err;
//         }
//       });
//   }
// }
