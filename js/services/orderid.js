/**
 * Created by Mark on 26/05/2015.
 */
var app = angular.module('scanner');
app.service('orderid', ['settingsconfig', function (settingsconfig) {

    //Set ORDERID
    this.setOrderId = function (orderid) {
        this.orderid = orderid;
    };
    //Get ORDERID
    this.getOrderId = function () {
        return this.orderid;
    };

    //Set stage status
    this.setStatus = function (_data, station) {
        if (_data == '') {
            return 'error';
        }
        for (i = 0; i < _data.stageInformation.length; i++) {
            if (station == _data.stageInformation[i].stageName) {
                if (_data.stageInformation[i].in === '') {
                    return 'in'
                } else if (_data.stageInformation[i].out === '') {
                    return 'out';
                } else {
                    return 'none'
                }
            }
            ;
        }
    };

    this.configDataCheck = function (currentStage) {
        if (settingsconfig.inoutstages.indexOf(currentStage) > -1) {
            return 'in'
        } else {
            return 'none'
        }
    };

    this.configQARejectCheck = function () {
        if (settingsconfig.commands.indexOf('qareject') > -1) {
            return 'true'
        } else {
            return 'false'
        }
    };

    this.setStageGraduation = function (_data) {
        if (_data) {
            var c = 0;
            for (i = 0; i < _data.stageInformation.length; i++) {
                if (_data.stageInformation[i].in !== '') {
                    c++;
                }
                if (_data.stageInformation[i].in !== '' && _data.stageInformation[i].out === '') {
                    _data.stageInformation[i].currentStage = true;
                }
            }

            for (i = 1; i < c + 1; i++) {
                _data.stageInformation[i - 1].opac = (i / c).toFixed(2)
            }
        }
        return _data;
    }

}])