var Service;
var Characteristic;
const Raspistill = require('node-raspistill').Raspistill;
var bmp = require("bmp-js");
var pollingtoevent = require('polling-to-event');

const CAPTURE_W = 64;
const CAPTURE_H = 40;

const camera = new Raspistill({
    width: CAPTURE_W,
    height: CAPTURE_H,
    encoding: 'bmp',
    noFileSave: true
});

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-picamera-lightsensor", "PiCameraLightsensor", PiCameraLightsensor);
}

function PiCameraLightsensor(log, config) {
    this.log = log;
    var that = this;

    this.lightlevel = 0.0;
    this.name = config["name"];
    this.poll_interval = parseInt(config["poll_interval"] || 5*60);

    this.fromLeft = CAPTURE_W * (parseInt(config["from_left_percent"] || 0) / 100);
    this.toRight = CAPTURE_W * (parseInt(config["to_right_percent"] || 100) / 100);
    this.fromTop = CAPTURE_H * (parseInt(config["from_top_percent"] || 0) / 100);
    this.toBottom = CAPTURE_H * (parseInt(config["to_bottom_percent"] || 100) / 100);

    var statusemitter = pollingtoevent(function(done) {
        that.getLightlevel(function(error, response) {
            done(error, response, 0);
        }, "statuspoll");
    }, {
        longpolling: true,
        interval: that.poll_interval * 1000,
        longpollEventName: "statuspoll"
    });

    statusemitter.on("statuspoll", function(data) {
        that.lightlevel = data;
        if (that.lightsensorService) {
            that.lightsensorService.getCharacteristic(Characteristic.CurrentAmbientLightLevel).setValue(that.lightlevel, null, "statuspoll");
        }
    });
}

PiCameraLightsensor.prototype = {
    getLightlevel: function(callback, context) {
        var that = this;

        if (!context || context != "statuspoll") {
            that.log("respond from cache: "+that.lightlevel);
            callback(null, this.lightlevel);
            return;
        }

        camera.takePhoto().then((photo) => {
            var bmpData = bmp.decode(photo);

            var s = 0; var sc = 0;

            var c = 0;
            var x = 0;
            var y = 0;

            for(var i = 0;i < bmpData.data.length; i+=4) {
                x = parseInt(c % CAPTURE_W);
                y = parseInt(c / CAPTURE_W);

                if(this.fromLeft <= x && x <= this.toRight) {
                    if(this.fromTop <= y && y <= this.toBottom) {
                        s += bmpData.data[i+1];
                        sc++;
                    }
                }

                c++;
            }


            that.lightlevel = (s/sc)/255*2000;
            that.log("new ligthlevel: "+that.lightlevel);
            callback(null, that.lightlevel);
        });
    },

    identify: function(callback) {
        this.log("Identify requested!");
        callback(); // success
    },

    getServices: function() {
        var informationService = new Service.AccessoryInformation();
        informationService
            .setCharacteristic(Characteristic.Name, this.name)
            .setCharacteristic(Characteristic.Manufacturer, 'RaspberryPi')
            .setCharacteristic(Characteristic.Model, "RaspberryPi Camera");

        this.lightsensorService = new Service.LightSensor()
        this.lightsensorService
            .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
            .on('get', this.getLightlevel.bind(this));

        return [informationService, this.lightsensorService];
    }
}