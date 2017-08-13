var express = require('express');
var router = express.Router();
var mdb = require('../modules/mdb');

//======================================主页=======================================//
router.get('/', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  };
  res.render('index');
});

router.get('/ask', function (req, res, next) {
  var user = req.session.user.userName;
  var blogModel = mdb.blogModel;
  blogModel.find({ userName: user }, function (err, result) {
    if (err) {
      console.log(err);
      return res.send(err);
    } else {
      res.send(result)
    }
  });
});

//======================================查看=======================================//
router.post('/view/:id',function(req,res,next){
  id=req.params.id;
  var blogModel = mdb.blogModel;
  blogModel.find({_id:id},function(err,result){
    if(err){
      res.send("查看失败");
    }else{
      res.send(result);
      // res.render('view',{result:result});
    }
  })
});

//======================================登陆=======================================//
router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', function (req, res) {
  console.log(req.body);
  var userModel = mdb.userModel;
  userModel.find({ userName: req.body.userName }, function (err, user) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log(user);
    if (user.length == 0) {
      console.log('用户不存在');
      // return res.redirect('/login');
      res.send('用户不存在');
    } else {
      if (req.body.password != user[0].password) {
        console.log('密码错误');
        // return res.redirect('/login');
        res.send('密码错误');
      } else {
        req.session.user = user[0];
        if (user[0].userType == 1) {
          res.send('用户登录成功')
          console.log('用户登录成功');
          // return res.redirect('/');
        } else {
          res.send('管理员登录成功');
          console.log('管理员登录成功');
          // res.redirect('/viewall');
        }
      }

    }


  })
});

//======================================注册=======================================//
router.get('/register', function (req, res) {
  res.render('register');
});

router.post('/register', function (req, res) {
  req.body.userType = 1;
  console.log(req.body);
  var userModel = mdb.userModel;
  userModel.find({ userName: req.body.userName }, function (err, user) {
    if (user.length > 0) {
      console.log('用户已存在');
      res.send('用户已存在');
      return 
      // return res.redirect('/register');
    }else{
      userModel.create(req.body, function (error) {
      if (error) {
        console.log('注册失败');
        res.send('注册失败');
        return
      }
      else {
        console.log('注册成功');
        res.send('注册成功');
        return 
        // res.redirect('/');
      }
    })
    }
  })
});

//======================================发表=======================================//
router.get('/posts', function (req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('posts');
});

router.post('/posts', function (req, res) {
  var blogModel = mdb.blogModel;
  req.body.userName = req.session.user.userName;
  req.body.status = '待回复';
  req.body.answer = '空';
  console.log(req.body);
  blogModel.create(req.body, function (error) {
    if (error) {
      console.log('发表失败');
      res.send("fail");
      // return res.redirect('/posts');
    } else {
      console.log('发表成功');
      res.send("success");
      // return res.redirect('/');
    }
  })
});

//======================================删除=======================================//
router.get('/delete/:id', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  var blogModel = mdb.blogModel;
  var id = req.params.id;
  blogModel.remove({ _id: id }, function (err, result) {
    if (err) {
      console.log(err);
      console.log('删除失败');
      return res.redirect('/');
    }
    console.log('删除成功');
    return res.redirect('/');
  })
});

//======================================改变状态=======================================//
router.get('/finish/:id', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  var blogModel = mdb.blogModel;
  var id = req.params.id;
  blogModel.where({ _id: id }).update({ $set: { status: '已完结' } }, function (err, result) {
    if (err) {
      console.log(err);
      console.log('finish失败');
      res.redirect('/');
    };
    console.log('finish成功');
    res.redirect('/');
  })
});

//***************************************管理员界面控制***************************************** */

//=======================================所有查看==============================================//
router.get('/viewall', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('viewall');
})

//=======================================someType==============================================//
router.post('/type', function (req, res){
  if (!req.session.user) {
    return res.redirect('/login');
  }
  var blogModel = mdb.blogModel;
  var productType = req.body.productType;
  blogModel.find({ productType:productType }, function (err, result) {
    if (err) {
      console.log(err);
      return res.send('查找失败');
    }
    console.log(result);
    res.send(result);
    //    res.redirect('/viewall');
  })
});

router.get('/all',function(req,res){
  var blogModel = mdb.blogModel;
  blogModel.find({}, function (err, result) {
    if (err) {
      console.log(err);
      return res.send('查找失败');
    }
    console.log(result);
    res.send(result);
    //    res.redirect('/viewall');
  })
})


//=======================================reply==============================================//
router.get('/reply/:id', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  var id = req.params.id;
  var blogModel = mdb.blogModel;
  blogModel.find({ _id: id }, function (err, result) {
    if (err) {
      console.log(err);
      return req.redirect('/viewall');
    }
    console.log('开始回复');
    console.log(result);
    res.render('reply', { result: result });
  })
});

router.post('/reply/:id', function (req, res, next) {
  var id = req.params.id;
  var answer = req.body.answer;
  var blogModel = mdb.blogModel;
  blogModel.find({ _id: id }, function (err, result) {
    if (err) {
      console.log(err);
      return req.redirect('/viewall');
    }
    blogModel.where({ _id: id }).update({ $set: { answer: answer, status: "已回复" } }, function (err, result) {
      if (err) {
        console.log(err);
        return req.redirect('/viewall');
      }
      console.log('回复成功');
      res.send('回复成功');
      // res.redirect('/viewall');
    })

  })
});

//=======================================退出登陆==============================================//
router.post('/logout',function(req,res,next){
  req.session.user=null;
  res.send('success');
})

module.exports = router;
