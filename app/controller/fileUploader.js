var fs = require('fs');
module.exports.fileUploader = function(app,req,res){
  if (!fs.existsSync('app/views/organizacoes/'+req.body.nome+'/')) {
    if (!fs.existsSync('app/views/organizacoes/')) {
      fs.mkdir('app/views/organizacoes/',function(err){
        if (err) {
          throw err;
        }
        fs.mkdirSync('app/views/organizacoes/'+req.body.nome);
      });
    }
    else {
      fs.mkdirSync('app/views/organizacoes/'+req.body.nome);
    }
  }
  if (fs.existsSync('app/views/organizacoes/'+req.body.nome+'/')) {
    var nomeArquivo = "";
    switch (req.files.foto.mimetype) {
      case "image/png":
        nomeArquivo = req.files.foto.name;
      break;
    case "image/jpeg":
        nomeArquivo = req.files.foto.name;
      break;
    case "image/jpg":
        nomeArquivo = req.files.foto.name;
      break;
    case "image/gif":
        nomeArquivo = req.files.foto.name;
      break;
    default: nomeArquivo = ""; break;

    }
    if (nomeArquivo) {
      req.files.foto.mv('app/views/organizacoes/'+req.body.nome+'/'+nomeArquivo,function(err){
        if (err) {
          throw err;
        }
      })
      return true;
    }
  }
}
