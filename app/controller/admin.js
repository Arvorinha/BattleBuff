var fs = require('fs')
var moment = require('moment')
module.exports.admin = function(app,req,res){
  res.render('admin',{
    erros:'',
    sucesso: '',
    pagina:'',
    session: req.session
  })
}

module.exports.pagina = function(app,req,res){
  var connection = app.config.dbConnection;
  var sDAO = new app.app.model.SeasonDAO(connection);
  var oDAO = new app.app.model.OrganizacaoDAO(connection)
  async function render(pagina,result) {
    res.render('admin',{
      erros:'',
      sucesso: '',
      pagina:pagina,
      session: req.session,
      result: result,
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
    sDAO.findAll(function(err,result) {
      if (err) {
        throw err;
      }
      render(req.params.pagina,result);
    })
  }

  async function getAllOrganizacao() {
    oDAO.findAll(function(err,result){
      if (err) {
        throw err;
      }
      render(req.params.pagina,result);
    })
  }

  switch (req.params.pagina) {
    case 'season':getAllSeason();
      break;
    case 'organizacao':getAllOrganizacao();
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
      sDAO.findAll((err,result)=>{
        if (err) {
          throw err;
        }
        resolve(result)
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
        result:value,
        moment:moment
      });
    })
	}

	function renderErro(erro,result) {
		var erros =[
			{msg:erro}
		]
		res.render('admin',{
			session:req.session,
			erros: erros,
			sucesso: '',
      pagina : 'season',
      result:result,
      moment:moment
		});
	}

	function renderSucesso(sucesso,result) {
		res.render('admin',{
			session:req.session,
			erros: '',
			sucesso: [{msg:sucesso}],
      pagina: 'season',
      result:result,
      moment:moment
		});
	}

	sDAO.findBySeason(seasonNova,function(err,result){
		if (err) {
			throw err;
		}
		if (result.rowCount > 0) {
      return getAllSeason().then(function (value) {
        renderErro('Já existe uma season com esse nome',value);
      })
		}
    sDAO.updateDtFim((err,result)=>{
      if (err) {
        throw err;
      }
      sDAO.insert(seasonNova,function(err,result){
  			if (err) {
  				throw err;
  			}
  			if (result.rowCount > 0) {
          // result.rows[0].id_season
          rDAO.insert((err,result)=>{
            if (err) {
              throw err;
            }
            jDAO.updateMmr((err,result)=>{
              if (err) {
                throw err;
              }
              return getAllSeason().then(function (value) {
                renderSucesso('Nova season registrada com sucesso',value);
              })
            })
          })
  			}else {
          return getAllSeason().then(function (value) {
            renderErro('Ocorreu algum erro, verifique o log do servidor ou contade algum adm',value);
          })
  			}
  		})
    })
	})
}
