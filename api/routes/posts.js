var express=require('express');
var router=express.Router();
var Post=require('../../model/Post');
var checkAuth=require('../middleware/check-auth');
router.get('/',function(req,res){
  res.status(200).json({
    message:'Post home'
  });
});
router.get('/list',checkAuth,function(req,res){
  Post.find({}).populate('author').exec(function(err,rtn){
    if(err){
      res.status(500).json({
        message:'Server Error',
        error: err
      })
    }
    if(rtn.length<1){
      res.status(204).json({
        message:'No data found!'
      })
    }else{
      res.status(200).json({
        posts:rtn
      })
    }
  })
})
router.get('/detail/:id',checkAuth,function(req,res){
  Post.findById(req.params.id,function(err,rtn){
    if(err){
      res.status(500).json({
        message:'Server Error!',
        error:err
      })
    }else{
      if(rtn==null){
        res.status(204).json({
          message:'Data Not found!'
        })
      }else{
        res.status(200).json({
          PostData:rtn
        })
      }
    }
  })
})
router.delete('/:id',checkAuth,function(req,res){
  Post.findByIdAndRemove(req.params.id,function(err,rtn){
    if(err){
      res.status(500).json({
        message:'Server Error!',
        error:err
      })
    }else{
      res.status(200).json({
        message:'Post Deleted'
      })
    }
  })
})
router.post('/add',checkAuth,function (req,res,next){
  var post=new Post();
  post.title=req.body.title;
  post.content=req.body.content;
  post.author=req.body.author;

  post.save(function (err,rtn){
    if(err){
    res.status(500).json({
      message:'Server Error!',
      error:err
    })
  }
  else {
    res.status(201).json({
      message:"Post Created Successful",
      data: rtn
    })
  }
  })
})
router.patch('/:id',checkAuth,function(req,res){
  var updateP={}
  for(var ops of req.body){
    updateP[ops.proName]=ops.value;
  }
  console.log(updateP);
  Post.findByIdAndUpdate(req.params.id,{$set:updateP},function(err,rtn){
    if(err){
      res.status(500).json({
        message:'Server Error!!',
        error:err
      })
    }
    res.status(200).json({
      message:"Update Successful"
    })
  })
})
module.exports=router;
