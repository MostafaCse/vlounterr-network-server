const express = require('express');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileupload());
app.use(express.static('Images'));
const port = 500

const uri = `mongodb+srv://VolunterNetwork:volunteerPass@cluster0.bntby.mongodb.net/volunteerNetwork?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const collection = client.db('volunteerNetwork').collection('workInfo');
    console.log("inside collcetion");

    app.get('/serviceInfo', (req, res) => {
        collection.find({EventTitle,Images})
            .toArray((err, documents) => {
                res.send(documents);
            })
    
    });

  app.post('/registerInfo',(req,res)=>{
      const regData= req.body;
      if(regData!=null){
          console.log("yes");
          res.send("submitted sucessfully");
      }
      else{
          console.log("no");
          res.send("try again later")
      }
  })

    app.post('/addEvent', (req, res) => {
        const Images = req.files.file;
        const { EventTitle} = req.body;
        const filePath = `${__dirname}/Images/${Images.name}`;
        Images.mv(filePath, err => {
            if (err) {
                console.log("form error");
                return res.send("from error");
            }
            const newImg = fs.readFileSync(filePath);
            const enImg = newImg.toString('base64');
            var image = {
                contentType: req.files.file.mimetype,
                size: req.files.file.size,
                img: Buffer(enImg, 'base64')
            }
            collection.insertOne({ EventTitle: EventTitle,Images: Images })
                .then(result => {
                    console.log("Submit successfully");
                    res.send("Submit successfully")
                })

                .catch(err => {
                    console.log("Submit cannot be performed")
                    res.send("Submit cannot be performed")

                })
        });

    })
});


app.get('/', (req, res) => {
    res.send("hello hani nai");
})

app.listen(process.env.PORT || 50000)