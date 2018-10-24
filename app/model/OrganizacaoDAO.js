function OrganizacaoDAO(connection) {
  this._pool = connection;
}

OrganizacaoDAO.prototype.findAll = function (cb) {
  this._pool().connect((err,client,done)=>{
    client.query('SELECT * FROM TB_ORGANIZACAO',cb,done());
  });
};

OrganizacaoDAO.prototype.insert = function (nome,foto,pais,cb) {
  this._pool().connect((err,client,done)=>{
    var query = 'INSERT INTO TB_ORGANIZACAO(NM_ORGANIZACAO,FT_ORGANIZACAO,PAIS_ORGANIZACAO) ';
    query += 'VALUES($1,$2,$3)';
    client.query(query,[nome,foto,pais],cb,done());
  })
};

module.exports = function() {
  return OrganizacaoDAO;
}
