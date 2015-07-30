var models = require('../models/model.js');

// Autoload :id para factorizar el código
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('Hey, no existe quiz con Id=' + quizId))}
    }
  ).catch(function(error){next(error)});
};

// Get /quizes
exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index.ejs', {quizes: quizes});
  }).catch(function(error) {next(error);})
};

// Get /quizes/:id
exports.show = function(req, res){
    res.render('quizes/show', {quiz: req.quiz});
};

// Get /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
