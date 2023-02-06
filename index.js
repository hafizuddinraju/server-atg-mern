const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, CURSOR_FLAGS, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_KEY}@cluster0.cvtbcrw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, { connectTimeoutMS: 30000 }, { keepAlive: 1 });

async function dbConnect(){
    try {
        await client.connect()
        console.log('Database Connect')
    } catch (error) {
        console.log(error)
        
    }
}
dbConnect()
const allUser = client.db('atg-app').collection('users')
const allPost = client.db('atg-app').collection('posts')
const allComment = client.db('atg-app').collection('comments')

app.put('/signup', async(req, res)=>{
    try{
        const {username, email} = req.body;
        const filter = { email: email };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                username:username,
                email:email,
                
            }
        }
        const result = await allUser.updateOne(filter, updateDoc, options);
        if(result){
            res.send({
                success:true,
                message:'User Active Successfull'
            })
        }

    }catch (error){
        res.send({
            success:false,
            error:error.message
        })

    }
})
app.post('/addPost', async(req,res)=>{
    try{
        const data = req.body;
        const result = await allPost.insertOne(data)
        if(result){
            res.send({
                success:true,
                message: "Post Add Successful"
            })
        }

    }catch(error){
        res.send({
            success:false,
            error:error.message
        })
    }
})
app.patch('/updatedata/:id', async(req, res)=>{
    try{
        const id = req.params.id
        const {postContent} = req.body;
        const result = await allPost.updateOne ({_id: new ObjectId(id)}, {$set: {
            postContent:postContent,
          }})
        if(result){
            res.send({
                success:true,
                message:'Update Post  Successful'
            })
        }

    }catch (error){
        res.send({
            success:false,
            error:error.message
        })

    }
})
app.get('/allPost', async(req,res)=>{
    try{
        const cursor = allPost.find({}).sort({_id:-1})
        const result = await cursor.toArray()
        if(result){
            res.send({
                success:true,
                data:result
            })
        }

    }catch(error){
        res.send({
            success:false,
            error:error.message
        })
    }
})
app.post('/addComment', async(req,res)=>{
    try{
        const data = req.body;
        const result = await allComment.insertOne(data)
        if(result){
            res.send({
                success:true,
                message: "Comment Add Successful"
            })
        }

    }catch(error){
        res.send({
            success:false,
            error:error.message
        })
    }
})
app.get('/addComment/:id', async(req,res)=>{
    try{
        const {id} = req.params
        const filter = allComment.find({post_Id:id})
        const result = await filter.toArray();
        if(result){
            res.send({
                success:true,
                data:result
            })

        }

    }catch(error){
        res.send({
            success:false,
            error:error.message
        })
    }
})
app.delete('/allPost/:id', async (req, res) => {
    try{
        const id = req.params.id;
       
    const filter =  {_id: new ObjectId(id)};
   
    const result = await allPost.deleteOne(filter);
    
    if(result){
        res.send({
            success:true,
            message:'Post Delete Successful'
        })
    }
    

    }
    catch(error){
        res.send({
            success:false,
            error:error.message
        })
    }
    
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})