var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/blogg');

//数据库连接失败
db.on('error',function(error){
    console.log(error);
    console.log('数据库连接失败');
})

//数据库连接成功
db.on('open',function(error){
    console.log('数据库连接成功');
})

//blog模型
var blogSchema = new mongoose.Schema({
    userName:{type:'String'},
    title:{type:'String'},
    productType:{type:'String'},
    feedContext:{type:'String'},
//    photo:{type:'String'},
    tel:{type:'String'},
    status:{type:'String',unum:['待回复','已回复','已完结']},//待回复，已回复，已完结
    answer:{type:'String'}
});

//userSchema模型
var userSchema =new mongoose.Schema({
    userName:{type:'String'},
    password:{type:'String'},
    userType:{type:'number'}//1为普通用户 0为管理员
});


var blogModel = db.model('blog',blogSchema);
var userModel = db.model('user',userSchema);

exports.blogModel = blogModel;
exports.userModel = userModel;
exports.db = db;
