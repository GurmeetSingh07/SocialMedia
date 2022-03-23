const mongoose=require('mongoose')

mongoose.connect('mongodb+srv://ArjunSingh:122333@cluster0.ivttf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(()=>{
    console.log("connect");
})
.catch((e)=>{
  console.log(e);
})
module.exports=mongoose;