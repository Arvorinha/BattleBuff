function SeasonDAO(pool){
	this._pool = pool;
}

SeasonDAO.prototype.findBySeason = function(nm_season, cb) {
	this._pool().connect((err,client,done) => {
		if (err) {
			throw err;
		}
		client.query('SELECT NM_SEASON FROM TB_SEASON WHERE NM_SEASON = $1',[nm_season],cb,done());
	})
};

SeasonDAO.prototype.insert = function (nm_season, cb) {
  this._pool().connect((err,client,done)=>{
    if (err) {
      throw err;
    }
    client.query("INSERT INTO TB_SEASON(NM_SEASON) VALUES($1) returning ID_SEASON",[nm_season], cb,done());
  })
};

SeasonDAO.prototype.findAll = function (cb) {
	this._pool().connect((err,client,done)=>{
		if (err) {
			throw err;
		}
		var query = "SELECT nm_season,date_part('month',dt_inicio) +'/'+ date_part('day',dt_inicio) + '/' + date_part('year',dt_inicio) as 'dataInicio " ;
		query += 'FROM TB_SEASON'
		client.query('SELECT * FROM TB_SEASON ORDER BY DT_INICIO DESC',cb,done());
	})
};

SeasonDAO.prototype.updateDtFim = function(cb){
	this._pool().connect((err,client,done)=>{
		if (err) {
			throw err;
		}
		var query = 'UPDATE TB_SEASON ';
		query += 'SET DT_FIM = CURRENT_TIMESTAMP ';
		query += 'WHERE DT_FIM IS NULL ';
		client.query(query,cb,done());
	})
}

module.exports = function(){
	return SeasonDAO;
}
