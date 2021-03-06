# Masked Points Transition.

WebGL animated points module (3d).

![alt tag](https://cloud.githubusercontent.com/assets/12106426/23064247/fd4d4856-f51f-11e6-94b2-ab3ce41d359d.gif)

**Features**

1. *Points State* is a fixed set of points positions.
2. Each *Points State* can be initialized with
 - Array of positions in 3d space (*rawData*).
 - Width, height, depth and zDistance of axis-aligned Box containing all points (*box*). Points are pseudo-randomly placed.
 - **Image mask in PBM binary format** + parameters of Box as in previous item (*maskedBoxFromImage*).
 - Image matrix + parameters of Box (*maskedBoxFromMatrix*).
3. Module can be initialized with arbitrary amount of *Points States*.
4. User can choose 2 arbitrary *Points States* and make a transition between them by setting *BlendProgress*.
5. Module has points amount / size, colors, camera settings.
6. Module uses webworker for computing points positions.

**Usage**

- Include [app.js](https://github.com/mlknz/Masked-Points-Transition/tree/master/dist/scripts/app.js) script from [dist/scripts](https://github.com/mlknz/Masked-Points-Transition/tree/master/dist/scripts).
- Call `window.maskedPoints.init(settings)` to initialize module.
- Settings example could be found in [src/index.html](https://github.com/mlknz/Masked-Points-Transition/blob/master/src/index.html).

**API**

```javascript
var maskedPoints = window.maskedPoints.init(settings);
document.addEventListener('maskedPointsReady', function() {
    // initialization completed.
});

maskedPoints.updateCamera(time); // if interactive camera is needed. time in seconds for inertia.
maskedPoints.updateBlendProgress(weight); // weight in [0, 1]
maskedPoints.render(); // draws current state

maskedPoints.setBlendStates(state1_index, state2_index); // params are integer indices as states go in settings.
maskedPoints.setBackgroundColor([r, g, b]); // in [0, 1]
maskedPoints.setPointsColor([r, g, b]); // in [0, 1]
```

**Development**

To launch the project locally:

1. Install Node.js v5 or higher.
2. Clone project to your hard drive.
3. Run "npm install" in project root directory.
4. Run "gulp watch" to start development webserver.
5. Look in terminal what port is used and navigate to http://localhost:${port}
6. To update build run "gulp build".
