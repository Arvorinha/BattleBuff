rm -f ./app/views/public/imgs/btr-images/*
rm -f ./app/utils/AccountVanity.json

cp ~/.steam/steam/steamapps/common/Battlerite/Battlerite/AccountVanity/cache/* ./app/views/public/imgs/btr-images/
cp ~/.steam/steam/steamapps/common/Battlerite/Battlerite/AccountVanity/AccountVanity.sjson ./app/utils/
mv ./app/utils/AccountVanity.sjson ./app/utils/AccountVanity.json