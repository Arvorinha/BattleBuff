module.exports = function(app) {
  app.get('/admin',function(req,res) {
    app.app.controller.admin.admin(app,req,res);
  })
  app.get('/admin/:pagina',function(req,res) {
    app.app.controller.admin.pagina(app,req,res);
  })

  app.post('/postOrganizacao',(req,res)=>{
    app.app.controller.admin.postOrganizacao(app,req,res);
  })

  app.post('/alterarRanking',function(req,res){
		app.app.controller.admin.alterarRanking(app,req,res);
	})
};
