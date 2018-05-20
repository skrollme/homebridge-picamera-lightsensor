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
 ### Parameter
 
 - **poll_interval:** seconds between measurements (default: 300)
 - **from_left_percent:** left edge from where the calculation should start (default: 0)
 - **to_right_percent:** right edge where the calculation should end (default: 100)
 - **from_top_percent:** top edge from where the calculation should start (default: 0)
 - **to_bottom_percent:** bottom edge where the calculation should stop (default: 100)
 
 The following configuration example uses the top/right quarter of the image for the brigthness-calculation
 
  ```
 "accessories": [
 	{
 		"accessory": "PiCameraLightsensor",
 		"name": "LightSensor",
 		"poll_interval": 300,
 		"from_left_percent": 50,
 		"to_right_percent": 100,
 		"from_top_percent": 0,
 		"to_bottom_percent": 50,
 	}
 ]
  ```

## History

### 0.2.0
- remove "take photo" logging
- ability to define the area of the image which should be used for brightness calculation

### 0.1.0
- First working version

## ToDo
- ~~remove logging~~
- ~~configurable measurement area (e.g. whole image, top/left, ...)~~
- add optional correction-factor for lux-value

## What else

Like this? Please buy me a beer :beers: ...

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.me/skroll)



