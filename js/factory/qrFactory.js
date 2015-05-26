/**
 * Created by StevenChapman on 26/05/15.
 */
var app = angular.module('scanner');
app.factory('qrfactory', function ($q, $timeout) {
    var scan = function () {
        var defered = $q.defer();
        var gCtx = null;
        var gCanvas = null;
        var c = 0;
        var stype = 0;
        var gUM = false;
        var webkit = false;
        var moz = false;
        var v = null;
        var vidhtml = '<video id="v" autoplay></video>';
        this.res = false;

        load();

        function initCanvas(w, h) {
            gCanvas = document.getElementById("qr-canvas");
            gCanvas.style.width = w + "px";
            gCanvas.style.height = h + "px";
            gCanvas.width = w;
            gCanvas.height = h;
            gCtx = gCanvas.getContext("2d");
            gCtx.clearRect(0, 0, w, h);
        }


        function captureToCanvas() {
            if (stype != 1)
                return;
            if (gUM) {
                try {
                    gCtx.drawImage(v, 0, 0);
                    try {
                        qrcode.decode();
                        document.getElementById("outdiv").style.display = "none";
                        this.res = true;
                        return;
                    }
                    catch (e) {
                        console.log(e);
                        if(this.res!==true)
                        setTimeout(captureToCanvas, 500);
                    }
                    ;
                }
                catch (e) {
                    console.log(e);
                    if(this.res!==true)
                    setTimeout(captureToCanvas, 500);
                }
                ;
            }
        }

        function htmlEntities(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        function read(a) {
            if (htmlEntities(a)) {
                defered.resolve(htmlEntities(a));
                return;
            }
        }

        function success(stream) {
            if (webkit)
                v.src = window.webkitURL.createObjectURL(stream);
            else if (moz) {
                v.mozSrcObject = stream;
                v.play();
            }
            else
                v.src = stream;
            gUM = true;
            setTimeout(captureToCanvas, 500);
        }

        function error(error) {
            gUM = false;
            return;
        }

        function load() {
            initCanvas(800, 600);
            qrcode.callback = read;
            setwebcam();
            return;
        }

        function setwebcam() {
            if (stype == 1) {
                setTimeout(captureToCanvas, 500);
            }
            var n = navigator;
            document.getElementById("outdiv").innerHTML = vidhtml;
            v = document.getElementById("v");

            if (n.getUserMedia)
                n.getUserMedia({video: true, audio: false}, success, error);
            else if (n.webkitGetUserMedia) {
                webkit = true;
                n.webkitGetUserMedia({video: true, audio: false}, success, error);
            }
            else if (n.mozGetUserMedia) {
                moz = true;
                n.mozGetUserMedia({video: true, audio: false}, success, error);
            }

            stype = 1;
            setTimeout(captureToCanvas, 500);
        }

        return defered.promise;

    };

    return {
        scan: scan
    };
})
