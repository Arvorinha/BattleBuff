module.exports = function(app){
	app.get('/key',function(req,res){
		app.app.controller.key.key(app,req,res);
	})

	app.post('/postKey', function(req,res){
		app.app.controller.key.postKey(app, req, res);
	})

	app.get('/validarKey',function(req,res){
		app.app.controller.key.validarKey(app,req,res);
	})
}