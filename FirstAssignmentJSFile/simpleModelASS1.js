var app = angular.module('myapp', []);
app.controller('main', function ($scope) {
  "use strict";
  $scope.allMyNumbers = [];
  $scope.myNumbers = [];
  $scope.content = [];
  /*Setting Scope Variables*/
  $scope.sumX = 0;
  $scope.sumY = 0;
  $scope.meanX = 0;
  $scope.meanY = 0;
  $scope.stanX = 0;
  $scope.stanY = 0;
  $scope.XiYi = [];
  $scope.XiYiSum = 0;
  $scope.xSquared = [];
  $scope.xSquaredSum = 0;
  $scope.ySquared = [];
  $scope.ySquaredSum = 0;
  $scope.beta1 = 0;
  $scope.beta0 = 0;
  $scope.rBottom = 0;
  $scope.rTop = 0;
  $scope.r = 0;
  $scope.rSquared = 0;
  $scope.Yk = 0;
  $scope.showContent = function ($fileContent) {
    $scope.content += $fileContent;
  };
  /*Set Array Within Array*/
  $scope.getArray = function () {
    var c = $scope.content;
    $scope.myNumbers = c.split('\n');
    for (var i = 0; i < $scope.myNumbers.length; i++) {
      if ($scope.myNumbers[i] === "") {
        $scope.myNumbers.splice(i, 1);
      } else {
        $scope.myNumbers[i] = parseFloat($scope.myNumbers[i]);
      }
    }
    $scope.allMyNumbers.push($scope.myNumbers);
    $scope.content = [];
    $scope.myNumbers = [];
  };
  /*basic Functions*/
  $scope.getTotal = function (array) {
    var total = 0;
    for (var i = 0; i < array.length; i++) {
      total += array[i];
    }
    return total;
  };
  $scope.getMean = function (total, n) {
    var mean = total / n;
    return mean;
  };
  $scope.xMinMean = function (n, array, mean) {
    var xMinusMean = 0;
    var xMinusMeanTotal = 0;
    for (var i = 0; i < n; i++) {
      xMinusMean = Math.pow((array[i] - mean), 2);
      xMinusMeanTotal += xMinusMean;
    }
    return xMinusMeanTotal;
  };
  $scope.setEquationN = function (n) {
    var equationN = n - 1;
    return equationN;
  };
  $scope.stanDev = function (n, xMinusMeanTotal, equationN) {
    var standardDev = 0;
    for (var i = 0; i < n; i++) {
      standardDev = Math.sqrt(xMinusMeanTotal / equationN);
    }
    return standardDev;
  };
  /* x*y */
  $scope.timesed = function (arrayX, arrayY) {
    var XiYi = [];
    for (var i = 0; i < arrayX.length; i++) {
      XiYi.push(arrayX[i] * arrayY[i]);
    }
    return XiYi;
  };
  /* x*x (squared) */
  $scope.squared = function (array, square) {
    var hold = [];
    for (var i = 0; i < array.length; i++) {
      hold.push(Math.pow(square[i], 2));
    }
    return hold;
  };
  /* beta 1*/
  $scope.betaOne = function (xy, xMean, yMean, x, n) {
    var one = 0;
    one = (xy - n * xMean * yMean) / (x - n * xMean * xMean);
    return one;
  };
  /* beta 0 */
  $scope.betaZero = function (yMean, beta, xMean) {
    var zero = 0;
    zero = (yMean - beta * xMean);
    return zero;
  };
  /* rBottom */
  $scope.bottom = function (n, xSquare, sumX, ySquare, sumY) {
    var b = 0;
    b = Math.sqrt((n * xSquare - (sumX * sumX)) * (n * ySquare - (sumY * sumY)));
    return b;
  };
  /* rTop */
  $scope.top = function (n, sumXY, sumX, sumY) {
    var t = 0;
    t = (n * sumXY - sumX * sumY);
    return t;
  };
  /* r */
  $scope.rFunc = function (t, b) {
    var r = 0;
    r = (t / b);
    return r;
  };
  /* rSquared */
  $scope.squareR = function (r) {
    var rr = 0;
    rr = (r * r);
    return rr;
  };
  /* Yk */
  $scope.est = function (b0, b1) {
    var Xk = 386;
    var Yk = 0;
    Yk = (b0 + b1 * Xk);
    return Yk;
  };
  /*Calculate*/
  $scope.calculate = function () {
    var n = $scope.allMyNumbers[0].length;
    $scope.equationN = $scope.setEquationN(n);
    /*X*/
    $scope.sumX = $scope.getTotal($scope.allMyNumbers[0]);
    $scope.meanX = $scope.getMean($scope.sumX, n);
    $scope.xMinMeanX = $scope.xMinMean(n, $scope.allMyNumbers[0], $scope.meanX);
    $scope.stanX = $scope.stanDev(n, $scope.xMinMeanX, $scope.equationN);
    /*Y*/
    $scope.sumY = $scope.getTotal($scope.allMyNumbers[1]);
    $scope.meanY = $scope.getMean($scope.sumY, n);
    $scope.xMinMeanY = $scope.xMinMean(n, $scope.allMyNumbers[1], $scope.meanY);
    $scope.stanY = $scope.stanDev(n, $scope.xMinMeanY, $scope.equationN);
    /* Regression */
    $scope.XiYi = $scope.timesed($scope.allMyNumbers[0], $scope.allMyNumbers[1]);
    $scope.XiYiSum = $scope.getTotal($scope.XiYi);
    $scope.xSquared = $scope.squared($scope.allMyNumbers[0], $scope.allMyNumbers[0]);
    $scope.xSquaredSum = $scope.getTotal($scope.xSquared);
    $scope.ySquared = $scope.squared($scope.allMyNumbers[1], $scope.allMyNumbers[1]);
    $scope.ySquaredSum = $scope.getTotal($scope.ySquared);
    $scope.beta1 = $scope.betaOne($scope.XiYiSum, $scope.meanX, $scope.meanY, $scope.xSquaredSum, n);
    $scope.beta0 = $scope.betaZero($scope.meanY, $scope.beta1, $scope.meanX);
    /* Correlation */
    $scope.rBottom = $scope.bottom(n, $scope.xSquaredSum, $scope.sumX, $scope.ySquaredSum, $scope.sumY);
    $scope.rTop = $scope.top(n, $scope.XiYiSum, $scope.sumX, $scope.sumY);
    $scope.r = $scope.rFunc($scope.rTop, $scope.rBottom);
    $scope.rSquared = $scope.squareR($scope.r);
    /* est */
    $scope.Yk = $scope.est($scope.beta0, $scope.beta1);
  };
});
app.directive('onReadFile', function ($parse) {
  return {
    restrict: 'A',
    scope: false,
    link: function (scope, element, attrs) {
      var fn = $parse(attrs.onReadFile);
      element.on('change', function (onChangeEvent) {
        var reader = new FileReader();
        reader.onload = function (onLoadEvent) {
          scope.$apply(function () {
            fn(scope, {
              $fileContent: onLoadEvent.target.result
            });
          });
        };
        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
      });
    }
  };
});