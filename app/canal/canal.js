angular.module('myApp.canal', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/canal', {
    templateUrl: 'canal/canal.html',
    controller: 'CanalCtrl'
  });
}])

//CONTROLLER
.controller('CanalCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.hours = [17, 18, 19, 20, 21, 22, 23, 0 ];
  const init = (res) =>{
    $scope.programas = res.data;
    $scope.canais = generateChannel(res.data);

    $scope.programas.map(programa => {
      programa.style = getStyle(programa);
      programa.hrInicio = hora(programa.dh_inicio);
      programa.hrFim = hora(programa.dh_fim);
    })

    $scope.grade = { style: { width: calcWidth($scope.canais)}};
  }
  //CARREGA GRADE DE CANNAIS
  const loadGrade = () => {
  $http.get('public/json/grade-canais.json').then((res) => {
    init(res)
  });
  }

  const largura_canal = 200

  const calcY = (dtBegin) => {
    let hour = moment(dtBegin).utc().hours();
    let min = moment(dtBegin).utc().minutes();
    min = min / 60;

    let position = (hour + min - 17) * 60;

    return position > 0 ? `${position}px` : `0px`;
  }

  const getStyle = (ch) =>{
    return {
      'top': calcY(ch.dh_inicio),
      'height': Altura(ch.dh_inicio, ch.dh_fim),
      'left': calcX(ch.id_canal, $scope.canais)
    };
  }

  const Altura = (dtBegin, dataEnd) => {
    let inicio = moment(dtBegin).utc().format('YYYY-MM-DD') + 'T17:00Z';

    if(moment(dtBegin).utc().isBefore(moment(inicio).utc())) {
      dtBegin = inicio;
    }

    let mins = moment(dataEnd).diff(moment(dtBegin), 'minutes');


    if(moment(dataEnd, 'YYYY-MM-DD').utc().diff(moment(dtBegin, 'YYYY-MM-DD').utc(), 'days')) {
      let dtFim = moment(dataEnd).format('YYYY-MM-DD');
      mins = moment(dtFim + 'T01:00Z').utc().diff(moment(dtBegin).utc(), 'minutes');
    }

    let altura = (mins/60) * 60;

    return `${altura}px`;
  }

  const hora = (dtHora) => {
    return moment(dtHora).utc().format('HH:mm');
  }

  const calcX = (idCanal, canais) => {
    for(var i in canais) {
      let canal = canais[i];
      if(canal.id_canal == idCanal)
       return `${canal.esquerda}px`;
    }
  }

  const calcWidth = (canais) => {
    return `${canais[canais.length - 1].esquerda + largura_canal}px`;
  }

  const generateChannel = (programas) => {
    let canais = [];

    programas.map(programa => {
      canais[programa.id_canal] = {
        titulo: `Canal ${programa.id_canal}`,
        id_canal: programa.id_canal
      }
    })

    canais = canais.filter(() => true);

    canais.map( canal => canal.esquerda = canal.index )

    canais.map((canal, index) => canal.esquerda = index * largura_canal )

    return canais;
  }

  loadGrade();
}]);


