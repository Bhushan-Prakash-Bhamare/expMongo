require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const helmet=require('helmet');
const morgan=require('morgan');
const fs=require('fs');
const mongoose=require('mongoose');

const userRoute=require('./routes/user');
const expenseRoute=require('./routes/expense');
const purchaseRoute=require('./routes/purchase');
const premiumRoute=require('./routes/premium');
const passwordRoute=require('./routes/password');

const app = express();  

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

app.use(helmet({contentSecurityPolicy: false}));  
app.use(morgan('combined',{stream:accessLogStream}));
 
app.use(cors());
  
app.use(bodyParser.json({ extended: false }));

app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/purchase',purchaseRoute);
app.use('/premium',premiumRoute);
app.use('/password',passwordRoute); 

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,`public/${req.url}`));
});

app.use(errorController.get404);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PWD}@cluster0.qcghe17.mongodb.net/expense?retryWrites=true&w=majority`)
.then(result => {
  app.listen(3000);
  console.log('Connected!');
})
.catch(err=>console.log(err));