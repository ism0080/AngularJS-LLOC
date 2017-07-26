var app = angular.module('myapp', []);
app.controller('main', function($scope) {
    "use strict";
    $scope.filenameArray = [];

    $scope.content = [];

    $scope.classes = [];
    $scope.method = [];
    $scope.logic = [];

    $scope.mean = 0;
    $scope.std = 0;


    $scope.parseVAR = function(string) {
        string = $scope.content[0];
        string.split(/\r?\n/).forEach(function(line) {
            var match;
            if (/^\s*(;.*)?$/.test(line)) {
                return;
            } else if (match = line.match(/(app).*(main).*\{|(\;)/)) {
                $scope.classes.push(match[1]);
                $scope.method.push(match[2]);
                $scope.logic.push(match[3]);
            }
        });
        console.log($scope.classes);
        console.log($scope.method);
        console.log($scope.logic);
    };

    $scope.parseCount = function() {
        var data = $scope.classes.filter(Boolean);
        $scope.classes = data;
        data = $scope.method.filter(Boolean);
        $scope.method = data;
        data = $scope.logic.filter(Boolean);
        $scope.logic = data;
        console.log($scope.classes);
        console.log($scope.method);
        console.log($scope.logic);
    };

    $scope.getMean = function() {
        var total = $scope.logic.length;
        $scope.mean = total / 1;
        console.log($scope.mean);
    };

    $scope.stanD = function() {
        var total = $scope.logic.length;
        var n = $scope.mean - 1;
        var xMinusMean = 0;
        xMinusMean = Math.pow((total - $scope.mean), 2);
        $scope.std = Math.sqrt(xMinusMean / n);
        console.log($scope.std);
    };

    $scope.doSave = function() {
        var outText, filename;
        outText =
            "[FILE]\n" +
            "FILENAME=" + ($scope.filenameArray[0]) + "\n" +
            "Class " + ($scope.classes[0]) + "=" + ($scope.logic.length) + "\n" +
            "Method " + ($scope.method[0]) + "=" + ($scope.logic.length) + "\n" +
            "[CLASS]\n" +
            "TOTAL=" + ($scope.logic.length) + "\n" +
            "AVERAGE=" + ($scope.mean) + "\n" +
            "STD_DEV=" + ($scope.std) + "\n" +
            "[METHOD]\n" +
            "TOTAL=" + ($scope.logic.length) + "\n" +
            "AVERAGE=" + ($scope.mean) + "\n" +
            "STD_DEV=" + ($scope.std) + "\n";
        filename = $scope.filenameArray[0] + "_LLOC.txt";
        saveTextAsFile(outText, filename);
    };


    $scope.filesUpload = function(event) {
        var files = event.target.files; //FileList object
        var filename;
        var checkJs = /.+\.js/i;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            if (checkJs.test(file.name)) {
                reader.onload = $scope.filesIsLoaded;
                reader.readAsText(file);
                filename = file.name;
                $scope.filenameArray.push(filename);
            }
        }
    };

    $scope.filesIsLoaded = function(e) {
        $scope.$apply(function() {
            $scope.content.push(e.target.result);
        });
    };

});

/* Saving To File */

saveTextAsFile = function(textToWrite, fileNameToSaveAs) {
    var textFileAsBlob = new Blob([textToWrite], {
        type: 'text/plain'
    });

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";

    var destroyClickedElement = function(event) {
        document.body.removeChild(event.target);
    };

    if (URL !== null) {
        //chrome
        downloadLink.href = URL.createObjectURL(textFileAsBlob);
    }
    downloadLink.click();
};
