var models = require('../models/model.js');

// Autoload :id para factorizar el código
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
      where: {id: Number(quizId)},
      include: [{model: models.Comment}]
    }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {next(new Error('Hey, no existe quiz con Id=' + quizId))}
    }
  ).catch(function(error){next(error)});
};

// Get /quizes
// si viene search en el query, filtra por él
exports.index = function(req, res) {
  if (req.query.search){
    var ponparen = function(cadin){
      var cadout = "%";
      for (var i = 0; i < cadin.length; i++)
        if (cadin[i] === " ") cadout += "%"; else cadout += cadin[i];
      cadout += "%";
      return cadout;
    };
    var filtro = ponparen (req.query.search);
    models.Quiz.findAll(
      {where: ["pregunta like ?", filtro]}
    ).then(function(quizes){
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }).catch(function(error) {next(error);});
  } else {
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }).catch(function(error) {next(error);});
  };
};

// Get /quizes/:id
exports.show = function(req, res){
    res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// Get /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// Get /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta", tema: "Otro"}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

//Post /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  quiz.validate().then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz:quiz, errors: err.errors});
      } else {
        quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then(function(){res.redirect('/quizes')})
      }
    }
  );
};

// Get /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz; //Autoload
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

//Put /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;
  req.quiz.validate().then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then(function(){res.redirect('/quizes')})
      }
    }
  );
};

//Delete /quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then( function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
