function seasonUtils(){}

seasonUtils.getLeagueName = function (id) {
  var LeagueName = 'Uncalibrated League';
  switch(id){
      case 1:
      LeagueName = 'Bronze League'
      break;
      case 2:
      LeagueName = 'Silver League'
      break;
      case 3:
      LeagueName = 'Gold League'
      break;
      case 4:
      LeagueName = 'Platinum League'
      break;
      case 5:
      LeagueName = 'Diamond League'
      break;
      case 6:
      LeagueName = 'Champion League'
      break;
      case 7:
      LeagueName = 'Grand Champion League'
      break;
  }
  return LeagueName;
}

module.exports = function(){
  return seasonUtils;
}
