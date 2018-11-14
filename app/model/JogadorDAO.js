function JogadorDAO(pool){
  this._pool = pool;
}

JogadorDAO.prototype.findAll = function(cb){
  this._pool().getConnection((err, connection) => {
    if(err){
      console.log(err);
      return
    }
    connection.query('SELECT * FROM TB_JOGADOR', cb, connection.release());
  });
}

JogadorDAO.prototype.findBySteam64 = function(id,cb){
  this._pool().getConnection((err, connection) => {
    if(err){
      console.log(err);
      return
    }
    connection.query('SELECT * FROM TB_JOGADOR WHERE STEAM64= ?',[id], cb, connection.release());
  });
}

JogadorDAO.prototype.insert = function(STEAM64, BTRID, cb){
  this._pool().getConnection((err, connection) => {
    if(err){
      console.log(err);
      return
    }
    let command = 'INSERT INTO TB_JOGADOR(STEAM64, BTRID) VALUES(?, ?)';
    let values = [STEAM64, BTRID];
    connection.query(command,values, cb, connection.release());
  })
}

JogadorDAO.prototype.update = function(STEAM64,NM_JOGADOR,CAMINHO_IMG, cb){
  this._pool().getConnection((err, connection) => {
    if(err){
      console.log(err);
      return
    }
    let command = 'UPDATE TB_JOGADOR SET NM_JOGADOR=?,STEAM64=?,CAMINHO_IMG=? WHERE STEAM64=?';
    let values = [NM_JOGADOR,STEAM64,CAMINHO_IMG,STEAM64];
    connection.query(command,values, cb, connection.release());
  });
}

JogadorDAO.prototype.updateMmr = function(cb){
  this._pool().getConnection((err, connection) => {
    if (err) {
      throw err
    }
    connection.query('UPDATE TB_JOGADOR SET MMR_JOGADOR = 100', cb, connection.release());
  })
}

module.exports = function(){
  return JogadorDAO;
}
