var Service;
var Characteristic;
const Raspistill = require('node-raspistill').Raspistill;
var bmp = require("bmp-js");
var pollingtoevent = require('polling-to-event');

const camera = new Raspistill({
    width: 64,
    height: 40,
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

        that.log("take photo");
        camera.takePhoto().then((photo) => {
            var bmpData = bmp.decode(photo);

            var s = 0;
            var c = 0;
            for(var i = 0;i < bmpData.data.length; i+=4) {
                s += bmpData.data[i+1];
                c += 1;
            }


            that.lightlevel = (s/c)/255*2000;
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