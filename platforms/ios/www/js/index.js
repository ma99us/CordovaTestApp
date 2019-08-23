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
        this.authorizeCamera()
    },

    authorizeCamera: function () {
        cordova.plugins.diagnostic.isCameraAuthorized(
            function (authorized) {
                if (!authorized) {
                    cordova.plugins.diagnostic.requestCameraAuthorization(
                        function (status) {
                            if (status == cordova.plugins.diagnostic.permissionStatus.GRANTED) {
                                app.testCamera();
                            } else {
                                app.receivedCamera('Bad status: ' + status);
                            }
                        }, function (error) {
                            // fail
                            app.receivedCamera('Auth failed: ' + error);
                        }, false
                    );
                } else {
                    app.testCamera();
                }
            }, function (error) {
                app.receivedCamera('Error occurred: ' + error);
            }, false
        );
    },

    testCamera: function () {
        // let opts = {
        //     quality: 80,
        //     destinationType: Camera.DestinationType.FILE_URI,
        //     sourceType: Camera.PictureSourceType.CAMERA,
        //     mediaType: Camera.MediaType.PICTURE,
        //     encodingType: Camera.EncodingType.JPEG,
        //     cameraDirection: Camera.Direction.BACK,
        //     targetWidth: 300,
        //     targetHeight: 400
        // };
        try {
            // navigator.camera.getPicture(function (imgURI) {
            //     // success
            //     console.log('Camera success; imgURI=' + imgURI);
            //     app.receivedCamera("is Ready");
            //     app.testGeo();
            // }, function (msg) {
            //     // fail
            //     console.log('Camera fail; err=' + msg);
            //     app.receivedCamera(msg);
            //     app.testGeo();
            // }, opts);
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (result.cancelled || !result.text) {
                        app.receivedCamera('Scanning Failed');
                    }
                    else {
                        app.receivedCamera('Is Ready');
                    }
                },
                function (error) {
                    app.receivedCamera('Scanning Failed: ' + error);
                }
            );
        }
        catch (err) {
            app.receivedCamera('Camera exception: ' + err);
        }
    },

    receivedCamera: function (status) {
        console.error("Camera status: " + status);
        var parentElement = document.getElementById('deviceready');
        var cameraElement = parentElement.querySelector('.camera');

        cameraElement.innerHTML = 'Camera: ' + status;
        cameraElement.classList.remove('listening');
        cameraElement.classList.add('received');

        app.authorizeGeo();
    },

    authorizeGeo: function () {
        cordova.plugins.diagnostic.isLocationAuthorized(function (authorized) {
            if (!authorized) {
                cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
                    if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED
                        || status === cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
                        app.testGeo();
                    }
                    else {
                        app.receivedGeo('Bad status: ' + status);
                    }
                }, function (error) {
                    app.receivedGeo('Auth failed: ' + error);
                }/*, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS*/);
            } else {
                app.testGeo();
            }
        }, function (error) {
            app.receivedGeo('Error occurred: ' + error);
        });
    },

    testGeo: function () {
        try {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    // success
                    app.receivedGeo("Is Ready");
                },
                function (err) {
                    // fail
                    app.receivedGeo('Geo failed: ' + err);
                });
        }
        catch (err) {
            app.receivedGeo('Geo error: ' + err);
        }
    },

    receivedGeo: function (status) {
        console.log('Geo status: ' + status);
        var parentElement = document.getElementById('deviceready');
        var geoElement = parentElement.querySelector('.geo');

        geoElement.innerHTML = 'Geolocation: ' + status;
        geoElement.classList.remove('listening');
        geoElement.classList.add('received');
    }
};

app.initialize();