var express = require('express');//加载EXPRESS模块
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie.js');
var bodyParser = require('body-parser');//bodyParser用于解析客户端请求的body中的内容,内部使用JSON编码处理,url编码处理以及对于文件的上传处理.
var port = process.env.PORT || 3000;//3000或者从命令行里设置环境变量  命令行:PORT=4000 node index.js
var app = express();
mongoose.connect('mongodb://127.0.0.1:27017/imooc');
app.locals.moment = require('moment');
app.set('views','./views/page');//设置根目录
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.listen(port);
console.log('mongodb 3033');
//index page
app.get('/',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            consolo.log(err)
        }
        res.render('index',{
            title:'imooc',
            movies:movies
        })
    })

});
//detail page
app.get('/movie/:id',function(req,res){
    var id = req.params.id;
    Movie.findById(id,function(err,movie){
        res.render('detail',{
            title:'imooc detail',
            movie:movie
        })
    })

});
//admin update
app.get('/admin/update/:id',function(req,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
            res.render('admin',{
                title:'immm',
                movie:movie
            })
        })
    }
});
//admin page
app.get('/admin/movie',function(req,res){

    res.render('admin',{
        title:'imooc admin',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''
        }
    })
});
//admin post movie
app.post('/admin/movie/new',function(req,res){
    console.log(req.body);
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if(id !== 'undefined'){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err)
            }

            _movie =_.extend(movie,movieObj);
            _movie.save(function(err,movie){
                if(err){
                    console.log(err)
                }

                res.redirect('/movie/'+movie._id)
            })
        })
    }
    else{
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        });
        _movie.save(function(err,movie){
            if(err){
                console.log(err)
            }
            console.log(movie);
            res.redirect('/movie/'+movie._id)
        })
    }
});
//list page
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            consolo.log(err)
        }
        res.render('list',{
            title:'imooc',
            movies:movies
        })
    })
});
//list delete movie
app.delete('/admin/list',function(req,res){
    console.log(req.query.id);
    var id = req.query.id;
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
                console.log(err)
            }
            else{
                res.json({success:1})
            }
        })
    }
});