var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var dateFormat = require('dateformat');
 
router.get('/', function(req, res, next) {
    	res.redirect('mainPage');
	//res.redirect('boardList');
});
 
  // Initialize Firebase
  var firebaseConfig = {
    apiKey: "{apiKey}",
    authDomain: "fir-example-9b8df.firebaseapp.com",
    databaseURL: "https://fir-example-9b8df.firebaseio.com",
    projectId: "fir-example-9b8df",
    storageBucket: "fir-example-9b8df.appspot.com",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

router.get('/mainPage', function(req,res,next){
	res.render('board1/mainPage');
});

//글 리스트
router.get('/boardList', function(req, res, next) {  
    firebase.database().ref('board').orderByKey().once('value', function(snapshot) {  //데이터를 모두 가져와라
        var rows = [];
        snapshot.forEach(function(childSnapshot) {  //snapshot(키, 데이터로 구성된 변수)의 개수만큼 반복
            var childData = childSnapshot.val();  //키는 제외하고 데이터만 추출
         
            childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
            rows.push(childData); //row에 추가 
        });
        res.render('board1/boardList', {rows: rows});  //views\board1\boardList.ejs에 rows를 파라미터로 지정하여 호출
    });
});
 
//글 읽기
router.get('/boardRead', function(req, res, next) {  
    firebase.database().ref('board/'+req.query.brdno).once('value', function(snapshot) {
        var childData = snapshot.val();
         
        childData.brdno = snapshot.key;
        childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
        res.render('board1/boardRead', {row: childData});
    });
});

//퀴즈
router.get('/quiz', function(req,res,next){
   firebase.database().ref('quiz/'+req.query.num).once('value', function(snapshot) {
        var childData = snapshot.val();
         
        childData.brdno = snapshot.key;
        childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
        res.render('board1/quiz', {row: childData});
    });		
});



//글 쓰기
router.get('/boardForm', function(req,res,next){
    //글번호 값이 없으면 글쓰기로 별 다른 처리 없이 진행
    //신규일 경우 boardForm.ejs파일을 호출하고 끝 
    if (!req.query.brdno) {  
        res.render('board1/boardForm', {row: ""});
        return;
    }
 
    //값이 있으면 글 수정을 위해 글번호에 해당하는 데이터를 가지고와서 화면에 출력	
    firebase.database().ref('board/'+req.query.brdno).once('value', function(snapshot) {
        var childData = snapshot.val();
         
        childData.brdno = snapshot.key;
        res.render('board1/boardForm', {row: childData});
    });
});
 

//글 저장
router.post('/boardSave', function(req,res,next){
    var postData = req.body;  //사용자가 입력한 값을 Json으로 넘겨준다
    if (!postData.brdno) {  //글 번호가 없으면 새 글 작성
        postData.brdno = firebase.database().ref().child('posts').push().key;  //키 값 생성
        postData.brddate = Date.now();  //작성 일자 생성
    } else {  //글 수정일 때 입력화면에서 받은 값을 그대로 저장
        postData.brddate = Number(postData.brddate);   //문자로 넘어온 작성일자 값 숫자로 변환
    }
    firebase.database().ref('board/' + req.body.brdno).set(req.body);  //작성한 값을 저장(set)
    //var updates = {};
    //updates['/board/' + postData.brdno] = postData;
    //firebase.database().ref().update(updates);
     
    res.redirect('boardList');
});
 

//글 삭제
router.get('/boardDelete', function(req,res,next){
    	firebase.database().ref('board/' + req.query.brdno).remove();
    	res.redirect('boardList');   
});




router.get('/loginForm', function(req, res, next) {
	if(!firebase.auth().currentUser){
    		var loginvalue = 0;
		res.render('board1/loginForm', {row: loginvalue});
	}else{
		var loginvalue =1;
		var user = firebase.auth().currentUser;
		res.render('board1/loginForm', {row: user.email});
	}
});

router.post('/loginChk', function(req, res, next) {
    firebase.auth().signInWithEmailAndPassword(req.body.id, req.body.passwd)
       .then(function(firebaseUser) {
           res.redirect('loginForm');
       })
      .catch(function(error) {
          res.redirect('loginForm');
      });   
});

router.post('/logout', function(req, res, next) {
    firebase.auth().signOut().then(function() {
 	res.redirect('loginForm');
	}).catch(function(error) {

	});

});




router.get('/naturalDisaster', function(req,res,next){	res.render('board1/naturalDisaster');	});
router.get('/naturalDisaster/typhoon', function(req,res,next){	res.render('board1/naturalDisaster/typhoon');	});
router.get('/naturalDisaster/gale', function(req,res,next){	res.render('board1/naturalDisaster/gale');	});
router.get('/naturalDisaster/heavyrain', function(req,res,next){	res.render('board1/naturalDisaster/heavyrain');	});
router.get('/naturalDisaster/thunderbolt', function(req,res,next){	res.render('board1/naturalDisaster/thunderbolt');	});
router.get('/naturalDisaster/windwave', function(req,res,next){	res.render('board1/naturalDisaster/windwave');	});

router.get('/socialDisaster', function(req,res,next){	res.render('board1/socialDisaster');	});
router.get('/socialDisaster/collapse', function(req,res,next){		res.render('board1/socialDisaster/collapse');	});
router.get('/socialDisaster/explosion', function(req,res,next){		res.render('board1/socialDisaster/explosion');	});
router.get('/socialDisaster/fire', function(req,res,next){		res.render('board1/socialDisaster/fire');	});
router.get('/socialDisaster/forestfire', function(req,res,next){		res.render('board1/socialDisaster/forestfire');	});
router.get('/socialDisaster/trafficAccident', function(req,res,next){		res.render('board1/socialDisaster/trafficAccident');	});


module.exports = router;
