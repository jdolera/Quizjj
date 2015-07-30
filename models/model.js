var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
  {dialect: "sqlite", storage: "quiz.sqlite"}
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// exportar tablas
exports.Quiz = Quiz;

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().success(function() {
  Quiz.count().success(function (count) {
    if (count===0){
      Quiz.create({pregunta: 'Capital de Italia',
                    respuesta: 'Roma'
      })
    .success(function(){console.log('Base de datos inicializada')});
    };
  });
});
