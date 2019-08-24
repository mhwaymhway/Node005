var express = require('express');
var router = express.Router();
var User=require('../../model/user');
var multer=require('multer');
var upload=multer({dest:'public/images/uploads'});
var bcrypt=require('bcrypt');
var checkAuth=require('../middleware/check-auth');
router.get('/',function(req,res){
  res.status(200).json({
    message:'User home'
  })
})
router.get('/list',checkAuth,function(req,res){
  User.find({},function(err,rtn){
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
        users:rtn
      })
    }
  })
})
router.get('/detail/:id',checkAuth,function(req,res){
  User.findById(req.params.id,function(err,rtn){
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      })
    }else{
      if(rtn==null){
        res.status(204).json({
          message:'No data'
        })
      }
    else{
    res.status(200).json({
      userData:rtn
    })
  }
}
  })
})
router.delete('/:id',checkAuth,function(req,res){
  User.findByIdAndRemove(req.params.id,function(err,rtn){
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      })
    }else{
      res.status(200).json({
        message:'User deleted!!'
      })
    }
  })
})
router.post('/add',checkAuth,upload.single('photo'),function(req,res){
  var user=new User();
  user.name=req.body.name;
  user.email=req.body.email;
  user.password=req.body.password;
  if(req.file)user.imgUrl='/images/uploads/'+req.file.filename;
  User.findOne({email:req.body.email},function(err2,rtn2){
    if(err2){
      res.status(500).json({
        message:'Server Error!',
        error:err
      })
    }else{
      if(rtn2==null){
      user.save(function(err,rtn){
        if(err){
          res.status(500).json({
            message:'Server Error!',
            error:err
          })
        }else{
          res.status(201).json({
            message:'User Created!!'
          })
        }
      })
    }else{
      res.status(409).json({
        message:'Email is Already exist'
      })
    }
}
  })

})
// router.patch('/:id',checkAuth,function(req,res){
//   var updateOps={}
//   for(var ops of req.body){
//     updateOps[ops.proName]=(ops.proName != 'password')? ops.value:bcrypt.hashSync(ops.value,bcrypt.genSaltSync(8,null))
//   }
//   User.findByIdAndUpdate(req.params.id,{$set:updateOps},function(err,rtn){
//     if(err){
//       res.status(500).json({
//         message:"Server Error",
//         error:err
//       })
//     }else{
//       res.status(200).json({
//         message:"User Account MOdified!"
//       })
//     }
//   })
// })

router.patch('/:id',checkAuth,function(req,res){
  var updateP={}
  for(var ops of req.body){
    updateP[ops.proName]=(ops.proName != 'password')? ops.value:bcrypt.hashSync(ops.value,bcrypt.genSaltSync(8,null))
  }
  console.log(updateP);
  User.findByIdAndUpdate(req.params.id,{$set:updateP},function(err,rtn){
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
module.exports = router;
