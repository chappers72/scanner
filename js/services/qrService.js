/**
 * Created by StevenChapman on 22/05/15.
 */
var app = angular.module('scanner');
app.service('QRService', function(){
    var gCtx = null;
    var gCanvas = null;
    var c = 0;
    var stype = 0;
    var gUM = false;
    var webkit = false;
    var moz = false;
    var v = null;
    var vidhtml = '<video id="v" autoplay></video>';
    this.res=null;
    this.qrservice = function(){
        load();
    }
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
                }
                catch (e) {
                    console.log(e);
                    setTimeout(captureToCanvas, 500);
                }
                ;
            }
            catch (e) {
                console.log(e);
                setTimeout(captureToCanvas, 500);
            }
            ;
        }
    }

    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function read(a) {
        var html = "<br>";
        if (a.indexOf("http://") === 0 || a.indexOf("https://") === 0)
            html += "<a target='_blank' href='" + a + "'>" + a + "</a><br>";
        html += "<b>" + htmlEntities(a) + "</b><br><br>";
        document.getElementById("result").innerHTML = html;
        this.res = html;
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
        document.getElementById("mainbody").style.display = "inline";
        setwebcam();
    }

    function setwebcam() {
        document.getElementById("result").innerHTML = "- scanning -";
        if (stype == 1) {
            setTimeout(captureToCanvas, 500);
            return;
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

});



