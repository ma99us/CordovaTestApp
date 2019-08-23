/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
        var parentElement = document.getElementById(id);
        var deviceElement = parentElement.querySelector('.device');

        deviceElement.innerHTML = 'Device is Ready';
        deviceElement.classList.remove('listening');
        deviceElement.classList.add('received');

        // test camera
        this.testCamera();
        this.testGeo();
    },

    testCamera: function () {
        let opts = {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            cameraDirection: Camera.Direction.BACK,
            targetWidth: 300,
            targetHeight: 400
        };
        try {
            navigator.camera.getPicture(function (imgURI) {
                // success
                console.log('Camera success; imgURI=' + imgURI);
                app.receivedCamera("is Ready");
                app.testGeo();
            }, function (msg) {
                // fail
                console.log('Camera fail; err=' + msg);
                app.receivedCamera(msg);
                app.testGeo();
            }, opts);
        }
        catch (err) {
            console.log('Camera exception; ex=' + err);
            app.receivedCamera(err);
            app.testGeo();
        }
    },

    receivedCamera: function (status) {
        var parentElement = document.getElementById('deviceready');
        var cameraElement = parentElement.querySelector('.camera');

        cameraElement.innerHTML = 'Camera: ' + status;
        cameraElement.classList.remove('listening');
        cameraElement.classList.add('received');
    },

    testGeo: function () {
        try {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    // success
                    console.log('Geo success; position=' + position);
                    app.receivedGeo("is Ready");
                },
                function (err) {
                    // fail
                    console.log('Geo fail; err=' + err);
                    app.receivedGeo(err);
                });
        }
        catch (err) {
            console.log('Geo exception; ex=' + err);
            app.receivedGeo(err);
        }
    },

    receivedGeo: function (status) {
        var parentElement = document.getElementById('deviceready');
        var geoElement = parentElement.querySelector('.geo');

        geoElement.innerHTML = 'Geolocation: ' + status;
        geoElement.classList.remove('listening');
        geoElement.classList.add('received');
    }
};

app.initialize();