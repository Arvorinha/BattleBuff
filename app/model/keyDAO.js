function keyDAO(pool){
  this._pool = pool;
}

keyDAO.prototype.findByKey = function (key,callback) {
  this._pool().connect((err,client,done) => {
    if (err) throw (err);
    client.query('SELECT * FROM TB_KEY WHERE KEY=$1',[key],callback);
  });
}

keyDAO.prototype.insert = function (key,callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query('INSERT INTO TB_KEY(KEY) VALUES($1)',[key],callback);
  })
};

keyDAO.prototype.findByUserNull = function (callback) {
  this._pool().connect((err,client,done)=>{
    if (err) {
      throw err;
    }
    client.query('SELECT * FROM TB_KEY WHERE ID_JOGADOR IS NULL',callback);
  })
};

keyDAO.prototype.findByUserNotNull = function (callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    var sql = "SELECT a.KEY, b.STEAM64 ";
    sql += "FROM TB_KEY a "
    sql += "INNER JOIN TB_JOGADOR b ON a.ID_JOGADOR = b.ID_JOGADOR ";
    sql += "WHERE a.ID_JOGADOR IS NOT NULL";
    client.query(sql,callback);
  })
};

keyDAO.prototype.registerKey = function (id_jogador,key,callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query("UPDATE TB_KEY SET ID_JOGADOR = $1 WHERE KEY=$2 AND ID_JOGADOR IS NULL",[id_jogador,key],callback);
  })
};

keyDAO.prototype.findByIdJogador = function (id_jogador,callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query("SELECT ID_JOGADOR FROM TB_KEY WHERE ID_JOGADOR=$1 AND ID_JOGADOR IS NOT NULL",[id_jogador],callback);
  })

};

module.exports = function(){
  return keyDAO;
}
