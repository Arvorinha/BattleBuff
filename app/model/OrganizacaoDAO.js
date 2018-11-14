function OrganizacaoDAO(connection) {
  this._pool = connection;
}

OrganizacaoDAO.prototype.findAll = function (cb) {
  this._pool().getConnection(function (err,connection) {
    if (err) {
      throw err;
    }
    connection.query('SELECT * FROM TB_KEY',cb,connection.release());
  })
};

OrganizacaoDAO.prototype.insert = function (nome,foto,pais,cb) {
  this._pool().getConnection(function (err,connection) {
    if (err) {
      throw err;
    }
    var query = 'INSERT INTO TB_ORGANIZACAO(NM_ORGANIZACAO,FT_ORGANIZACAO,PAIS_ORGANIZACAO) ';
    query += 'VALUES(?,?,?)';
    connection.query(query,[nome,foto,pais],cb,connection.release());
  })
};

module.exports = function() {
  return OrganizacaoDAO;
}
