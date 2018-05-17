[![npm](https://img.shields.io/npm/v/homebridge-picamera-lightsensor.svg?style=plastic)](https://www.npmjs.com/package/homebridge-picamera-lightsensor)
[![npm](https://img.shields.io/npm/dt/homebridge-picamera-lightsensor.svg?style=plastic)](https://www.npmjs.com/package/homebridge-picamera-lightsensor)
[![GitHub last commit](https://img.shields.io/github/last-commit/skrollme/homebridge-picamera-lightsensor.svg?style=plastic)](https://github.com/skrollme/homebridge-picamera-lightsensor)

# homebridge-picamera-lightsensor

This is a [homebridge](https://github.com/nfarina/homebridge) plugin which uses the raspberry-pi camera to emulate a ambientlight sensor

## Configuration

 ```
"accessories": [
	{
		"accessory": "PiCameraLightsensor",
		"name": "LightSensor",
		"poll_interval": 300
	}
]
 ```

## History

### 0.1.0
- First working version

## ToDo
- remove logging
- configurable measurement area (e.g. whole image, top/left, ...)
- add optional correction-factor for lux-value

## What else

Like this? Please buy me a beer :beers: ...

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.me/skroll)



