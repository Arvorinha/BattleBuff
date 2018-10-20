function salaDAO(pool){
  this._pool = pool;
}

// criando sala:
// apenas o nome porque o resto ja tem um default no banco
// INSERT INTO TB_SALA(NM_SALA) VALUES(NOME);
//
// atualizando quantidade de jogadores
// UPDATE TB_SALA(QTD_JOGADORES) VALUES(QTD_JOGADORES)
// WHERE ID_SALA = ID_SALA
// me informa depois se vc vai querer deixar o default da quantidade do jogador=0 ou =1
//
// atualizando o status:
// UPDATE TB_SALA(ID_STATUS) VALUES(ID_STATUS)
// 1=AGUARDANDO
// 2=EM JOGO
// 3=FINALIZADO
// se deseja modificar os status so me falar
//
// tabela pick onde todos jogadores da sala ficaram:
// INSERT INTO TB_PICK(ID_SALA,ID_JOGADOR) VALUES(ID_SALA,ID_JOGADOR);
//
// para mais de um insert:
// INSERT INTO TB_PICK(ID_SALA,ID_JOGADOR)
//             VALUES(ID_SALA,ID_JOGADOR),
//                   (ID_SALA,ID_JOGADOR);
//
// deletando sala e os pick:
// DELETE FROM TB_SALA WHERE ID_SALA = ID_SALA
// DELETE FROM TB_PICK WHERE ID_SALA = ID_SALA
//
// se precisar de outro comando so falar


salaDAO.prototype.insert = function (nome, callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query('INSERT INTO TB_SALA(NM_SALA) VALUES($1) RETURNING ID_SALA',[nome],callback);
  })
}

salaDAO.prototype.updateJogadoresByIdSala = function (id, jogadores, callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query('UPDATE TB_SALA SET QTD_JOGADORES = $1 WHERE ID_SALA = $2',[jogadores, id],callback);
  })
}

salaDAO.prototype.deleteSalaById = function (id, callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query('DELETE FROM TB_SALA WHERE ID_SALA = $1',[id],callback);
  })
}

salaDAO.prototype.findAll = function (callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    var query = "SELECT a.ID_SALA, a.NM_SALA , a.QTD_JOGADORES, b.NM_STATUS ";
    query += "FROM TB_SALA a ";
    query += "INNER JOIN TB_STATUS b ON a.ID_STATUS = b.ID_STATUS"
    client.query(query,callback);
  })
}

salaDAO.prototype.findById = function (id, callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query('SELECT * FROM TB_SALA WHERE ID_SALA = $1',[id],callback);
  })
}

module.exports = function(){
  return salaDAO;
}
