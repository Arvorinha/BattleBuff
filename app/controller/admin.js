var fs = require('fs')
var moment = require('moment')
module.exports.admin = function(app,req,res){
  if (!req.session.sessaoAdmin) {
    res.redirect('/');
    return;
  }
  res.render('admin',{
    erros:'',
    sucesso: '',
    pagina:'',
    session: req.session
  })
}

module.exports.pagina = function(app,req,res){
  if (!req.session.sessaoAdmin) {
    res.redirect('/');
    return;
  }
  var connection = app.config.dbConnection;
  var sDAO = new app.app.model.SeasonDAO(connection);
  var oDAO = new app.app.model.OrganizacaoDAO(connection)
  async function render(pagina,results) {
    console.log(results);
    res.render('admin',{
      erros:'',
      sucesso: '',
      pagina:pagina,
      session: req.session,
      results: results,
      moment:moment
    })
  }

  function renderErro(erro) {
    res.render('admin',{
      erros: [{msg:erro}],
      pagina: '',
      sucesso: '',
      session:req.session,
      result: '',
      moment:moment
    })
  }

  async function getAllSeason() {
    return new Promise(function(resolve, reject) {
      sDAO.findAll(function(error,results,fields){
        if (error) {
          throw error;
        }
        resolve(results);
      })
    });
  }

  async function getAllOrganizacao() {
    return new Promise(function(resolve, reject) {
      oDAO.findAll(function(error,results,fields){
        if (error) {
          throw error;
        }
        console.log(results);
        resolve(results);
      })
    });
  }

  switch (req.params.pagina) {
    case 'season':
        getAllSeason().then(function (value) {
          console.log(value);
          render(req.params.pagina,value);
        })
      break;
    case 'organizacao':
        getAllOrganizacao().then(function (value) {
          render(req.params.pagina,value);
        });
      break;
    case 'key':app.app.controller.key.key(app,req,res,req.params.pagina);
      break;
    default:render('inexistente');
      break;

  }
}

module.exports.postOrganizacao = function(app,req,res) {
  app.app.controller.postOrganizacao.post(app,req,res);
}

module.exports.postKey = function(app,req,res) {
  app.app.controller.key.postKey(app,req,res)
}

module.exports.alterarRanking = function (app,req,res){
	req.assert('season','O campo é obrigatorio').notEmpty();
	req.assert('season','O campo deve ter entre 8 e 20').len(8,20);

  var pool = app.config.dbConnection;
	var sDAO = new app.app.model.SeasonDAO(pool);
	var rDAO = new app.app.model.RankDAO(pool);
  var jDAO = new app.app.model.JogadorDAO(pool);
	var seasonNova = req.body.season;

  function getAllSeason() {
    return new Promise((resolve,reject)=>{
      sDAO.findAll((error,results,fields)=>{
        if (error) {
          throw error;
        }
        resolve(results)
      })
    })
  }

	var erros = req.validationErrors();
	var dadosForm = {
		form:req.body
	}
	if(erros){
    return getAllSeason().then(function (value) {
      res.render('admin',{
        session:req.session,
        erros:erros,
        sucesso: '',
        pagina: 'season',
        results:value,
        moment:moment
      });
    })
	}

	function renderErro(erro,results) {
		var erros =[
			{msg:erro}
		]
		res.render('admin',{
			session:req.session,
			erros: erros,
			sucesso: '',
      pagina : 'season',
      results:results,
      moment:moment
		});
	}

	function renderSucesso(sucesso,results) {
		res.render('admin',{
			session:req.session,
			erros: '',
			sucesso: [{msg:sucesso}],
      pagina: 'season',
      results:results,
      moment:moment
		});
	}

	sDAO.findBySeason(seasonNova,function(err,result){
		if (err) {
			throw err;
		}
		if (result.length > 0) {
      return getAllSeason().then(function (value) {
        renderErro('Já existe uma season com esse nome',value);
      })
		}
    sDAO.gerarRankingProcedure(seasonNova,function (error,results,fields) {
      if (error) {
        throw error
      }
      // console.log(results[0][0].TB_SEASON);
      return getAllSeason().then(function (value) {
        renderSucesso('Nova season registrada com sucesso',value);
      })
    })
    // sDAO.updateDtFim((err,result)=>{
    //   if (err) {
    //     throw err;
    //   }
    //   sDAO.insert(seasonNova,function(err,result){
  	// 		if (err) {
  	// 			throw err;
  	// 		}
  	// 		if (result.rowCount > 0) {
    //       // result.rows[0].id_season
    //       rDAO.insert((err,result)=>{
    //         if (err) {
    //           throw err;
    //         }
    //         jDAO.updateMmr((err,result)=>{
    //           if (err) {
    //             throw err;
    //           }
    //           return getAllSeason().then(function (value) {
    //             renderSucesso('Nova season registrada com sucesso',value);
    //           })
    //         })
    //       })
  	// 		}else {
    //       return getAllSeason().then(function (value) {
    //         renderErro('Ocorreu algum erro, verifique o log do servidor ou contade algum adm',value);
    //       })
  	// 		}
  	// 	})
    // })
	})
}
