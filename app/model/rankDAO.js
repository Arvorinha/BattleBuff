function rankDAO(){
	this._pool;
}

rankDAO.prototype.findBySeason = function() {
	this._pool().connect((err,client,done) => {
		if (err) {
			thowr err;
		}
	})
};

module.exports = function(){
	return rankDAO;
}