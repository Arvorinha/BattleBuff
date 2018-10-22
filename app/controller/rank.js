module.exports.rankAdm = function(app,req,res){
	/*if (!req.session.autenticado) {
		return res.redirect('/');
	}*/
	console.log(req.session);
	res.render("rankAdm",{
		session:req.session,
		erros:{},
		sucesso: {}
	});
}
