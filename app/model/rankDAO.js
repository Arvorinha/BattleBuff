function RankDAO(pool){
	this._pool = pool;
}

RankDAO.prototype.insert = function (cb) {
	this._pool().connect((err,client,done)=>{
		if (err) {
			throw err
		}
		var query = 'INSERT INTO TB_RANK(MMR_RANK,ID_SEASON,ID_JOGADOR) ';
		query += 'SELECT a.MMR_JOGADOR, b.ID_SEASON, a.ID_JOGADOR ';
		query += 'FROM TB_JOGADOR a, TB_SEASON b '
		query += 'WHERE b.DT_FIM IS NULL '
		client.query(query,cb,done());
	})
};

module.exports = function(){
	return RankDAO;
}
