function salaDAO(pool){
  this._pool = pool;
}

salaDAO.prototype.insert = function (nome, estado, callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query('INSERT INTO TB_SALA(NOME, ESTADO, JOGADORES) VALUES($1, $2, 0) RETURNING id',[nome, estado],callback);
  })
}

salaDAO.prototype.findAll = function (callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query('SELECT * FROM TB_SALA',callback);
  })
}

salaDAO.prototype.findById = function (id, callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query('SELECT * FROM TB_SALA WHERE ID = $1',[id],callback);
  })
}

module.exports = function(){
  return salaDAO;
}
