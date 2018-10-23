function OrganizacaoDAO(connection) {
  this._pool = connection;
}

OrganizacaoDAO.prototype.findAll = function () {
  this._pool().connect((err,client,done)=>{
    client.query('SELECT * FROM TB_ORGANIZACAO');
  });
};

module.exports = function() {
  return OrganizacaoDAO;
}
