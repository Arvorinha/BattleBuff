module.exports.rankAdm = function(app,req,res){
	/*if (!req.session.autenticado) {
		return res.redirect('/');
	}*/
	console.log(req.session);
	res.render("rankAdm",{
		session:req.session,
		erros:''
	});
}

module.exports.alterarRanking = function (app,req,res){
	req.assert('season','O campo é obrigatorio').notEmpty();
	req.assert('season','O campo deve ter entre 8 e 20').len(8,20);

	var erros = req.validationErrors();
	if(erros){
		res.render('rankAdm',{
			session:req.session,
			erros:erros
		});
		return;
	}

	
}