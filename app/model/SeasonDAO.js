function SeasonDAO(pool){
	this._pool = pool;
}

SeasonDAO.prototype.findBySeason = function(nm_season, cb) {
	this._pool().connect((err,client,done) => {
		if (err) {
			throw err;
		}
		client.query('SELECT NM_SEASON FROM TB_SEASON WHERE NM_SEASON = $1',[nm_season],cb);
	})
};

SeasonDAO.prototype.insert = function (nm_season, cb) {
  this._pool().connect((err,client,done)=>{
    if (err) {
      throw err;
    }
    client.query("INSERT INTO TB_SEASON(NM_SEASON) VALUES($1)",[nm_season], cb);
  })
};

SeasonDAO.prototype.findAll = function (cb) {
	this._pool().connect((err,client,done)=>{
		if (err) {
			throw err;
		}
		var query = "SELECT nm_season,date_part('month',dt_inicio) +'/'+ date_part('day',dt_inicio) + '/' + date_part('year',dt_inicio) as 'dataInicio " ;
		query += 'FROM TB_SEASON'
		client.query('SELECT * FROM TB_SEASON',cb);
	})
};

module.exports = function(){
	return SeasonDAO;
}
