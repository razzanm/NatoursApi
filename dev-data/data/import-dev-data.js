const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModules');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(err.message));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const updatedb = async () => {
  try{
        await Tour.create(tours);
        console.log("data updated");
  }catch(err){
      console.log(err.message);
  }
  process.exit();
};

const deletedata = async () => {
    try{
        await Tour.deleteMany();
        console.log("data deleted successfully");
  }catch(err){
      console.log(err.message);
  }
  process.exit();
}

if(process.argv[2] === '--delete'){
    deletedata();
}
if(process.argv[2] === '--update'){
    updatedb();
}
