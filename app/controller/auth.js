module.exports.auth = function(app, req ,res){
	if (!req.session) {
		return res.render('/');
	}
	Console.log(req.session);
	res.render('rankAdm', {
  		session:req.session
  	})
}
