module.exports.key =function(app, req ,res, paginaNome){
  var pool = app.config.dbConnection;
  var keyDAO = new app.app.model.keyDAO(pool);
  var AdminDAO = new app.app.model.AdminDAO(pool);
  var battlerite = app.config.battlerite;
  var finalJson = [];
  var keys = [];

  keyDAO.findByUserNull(function(err,result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    var findByUserNull = result;
    keyDAO.findByUserNotNull(function(err,result){
      if (err) {
        return console.log(err);
      }
      console.log(result);
      result.rows.forEach(function(data){
        keys.push(data.btrid)
      })
      var startPage =async function(){
        var pagina = req.query.pagina;
        if (!pagina) {
          pagina = 0;
        }
        var maxItemsPerPage = 10;
        var numPaginas = Math.ceil((findByUserNull.rowCount + result.rowCount) / maxItemsPerPage);
        if (result.rowCount > 0) {
          battlerite().getPlayersByIds(keys).then((response) => {
            for (var i = 0; i < response.data.length; i++) {
              finalJson.push({
                tx_key: result.rows[i].tx_key,
                btrid: result.rows[i].btrid,
                nick: response.data[i].attributes.name
              })
            }
            console.log(finalJson);
            res.render('admin', {
              erros:"",
              session:req.session,
              queryPaginacao: pagina,
              maximoItem: maxItemsPerPage,
              numPaginas: numPaginas,
              findByUserNull: findByUserNull,
              findByUserNotNull: finalJson,
              pagina:paginaNome,
              sucesso: ''
            });

          }).catch((error) => {
            console.log(error.response.status);
          });
          return;
        }
        res.render('admin', {
          erros:"",
          session:req.session,
          queryPaginacao: pagina,
          maximoItem: maxItemsPerPage,
          numPaginas: numPaginas,
          findByUserNull: findByUserNull,
          findByUserNotNull: '',
          pagina:paginaNome,
          sucesso: ''
        });
      }
      startPage();
    })
  })
}

module.exports.postKey = function(app,req,res){
    var key = "";
    var finalKey = [];
    var qtdKey = 1;
    var repetido = false;
    var quantidade = req.body.quantidade;
    var pool = app.config.dbConnection;
    var keyDAO = new app.app.model.keyDAO(pool);
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
                console.log(key);
                console.log("Caiu no for para verificar key iguais");
                repetido = true;
              }
            }
            if (repetido) {
              console.log("caiu no if pra zerar o i");
              console.log("Valor de I antes= "+i);
              i = -1;
              console.log("Valor de I depois = "+i);
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
      keyDAO.findByKey(data,function(err, result){
        if(err){
          console.log(err);
          return
        }
        if (!result.rowCount) {
          keyDAO.insert(data,function(err,result){
            if(err){
              console.log(err);
              return
            }
          })
        }
      })
    });

    res.redirect('key');
}

// module.exports.validarKey =async function(app,req,res){
//   var allKeys = req.query.key;
//   var keys = allKeys.split(",");
//   console.log(keys.length);
//   var pool = app.config.dbConnection;
//   var validKey = [];
//   var keyDAO = new app.app.model.keyDAO(pool);
//   for (var i = 1; i < keys.length; i++) {
//       keyDAO.findByKey(keys[i],function(err, result){
//         if (err) {
//           throw err;
//         }
//       });
//   }
// }
