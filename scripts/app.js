!function(e){function t(i){if(r[i])return r[i].exports;var n=r[i]={exports:{},id:i,loaded:!1};return e[i].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){e.exports=r(1)},function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),a=r(2),s=i(a),u=r(6),c=function(){function e(){function t(){var e=Math.floor(i.clientWidth*c),t=Math.floor(i.clientHeight*c);i.width===e&&i.height===t||(i.width=e,i.height=t,a.resize()),o.viewport(0,0,o.canvas.width,o.canvas.height)}function r(){t(),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),l=(new Date).getTime(),l=(l-1e6*Math.floor(l/1e6))/1e3,o.useProgram(a.shaderProgram),a.update(l),a.render(),requestAnimationFrame(r)}n(this,e);var i=document.getElementById("canvas"),o=u(i);if(!o)return void(document.body.innerHTML="Unable to initialize WebGL. Your browser may not support it.");this.initGlState(o);var a=new s.default(o),c=window.devicePixelRatio||1,l=0;r()}return o(e,[{key:"initGlState",value:function(e){e.clearColor(0,0,0,1),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE)}}]),e}();window.app=new c},function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),a=r(3),s=i(a),u=r(4),c=i(u),l=r(5),f=i(l),h=void 0,d=void 0,v=void 0,g=void 0,m=void 0,p=200,w=function(){function e(t){var r=this;n(this,e),this.gl=t,this.n=p;var i=new f.default,o=i.generateVerticesWithoutMask(this.n),a=i.generateVerticesWithoutMask(this.n),s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array(o.concat(a)),t.STATIC_DRAW),this.shaderProgram=this.createShaderProgram(t);var u=t.getAttribLocation(this.shaderProgram,"position"),c=t.getAttribLocation(this.shaderProgram,"newPosition");t.vertexAttribPointer(u,3,t.FLOAT,!1,0,0),t.vertexAttribPointer(c,3,t.FLOAT,!1,0,4*o.length),t.enableVertexAttribArray(u),t.enableVertexAttribArray(c),this.viewMatrix=mat4.create(),this.perpectiveMatrix=mat4.create(),this.eyePos=vec3.fromValues(0,0,0),this.eyeTargetPos=vec3.fromValues(0,0,-2),this.up=vec3.fromValues(0,1,0),g=this.gl.getUniformLocation(this.shaderProgram,"perspectiveMatrix"),v=this.gl.getUniformLocation(this.shaderProgram,"viewMatrix"),m=this.gl.getUniformLocation(this.shaderProgram,"time"),t.useProgram(this.shaderProgram),this.updateView({clientX:window.innerWidth/2,clientY:window.innerHeight/2}),this.resize(),document.addEventListener("mousemove",function(e){r.updateView(e)})}return o(e,[{key:"resize",value:function(){this.gl.useProgram(this.shaderProgram),mat4.perspective(this.perpectiveMatrix,1,window.innerWidth/window.innerHeight,.5,21.1),this.gl.uniformMatrix4fv(g,!1,this.perpectiveMatrix)}},{key:"updateView",value:function(e){h=e.clientX/window.innerWidth,d=e.clientY/window.innerHeight,this.eyePos[0]=.3*-(h-.5),this.eyePos[1]=.3*+(d-.5),mat4.lookAt(this.viewMatrix,this.eyePos,this.eyeTargetPos,this.up),this.gl.uniformMatrix4fv(v,!1,this.viewMatrix)}},{key:"createShaderProgram",value:function(e){var t=e.createShader(e.VERTEX_SHADER);e.shaderSource(t,s.default),e.compileShader(t);var r=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(r,c.default),e.compileShader(r);var i=e.createProgram();return e.attachShader(i,t),e.attachShader(i,r),e.linkProgram(i),i}},{key:"update",value:function(e){this.gl.uniform1f(m,e)}},{key:"render",value:function(){this.gl.drawArrays(this.gl.POINTS,0,this.n)}}]),e}();t.default=w},function(e,t){e.exports="attribute vec3 position;\nattribute vec3 newPosition;\n\nuniform mat4 viewMatrix;\nuniform mat4 perspectiveMatrix;\n\nuniform float time;\n\nvarying float dist;\n\nvoid main() {\n\n    vec3 pos = mix(position, newPosition, sin(time)*0.5 + 0.5);\n    dist = (-pos.z - 1.) / 10.; // [0, 1]\n\n    gl_Position = perspectiveMatrix * viewMatrix * vec4(pos, 1.0);\n    gl_PointSize = mix(10.0, 5.0, dist);\n}\n"},function(e,t){e.exports="precision highp float;\n\nvarying float dist;\n\nvoid main() {\n\n    vec2 coord = gl_PointCoord - vec2(0.5);\n    float inCircle = 1. - smoothstep(0.495, 0.500, length(coord));\n    // if (length(coord) > 0.5) inCircle = 0.;\n    if (inCircle < 0.95) discard;\n    gl_FragColor = vec4(mix(0., 1. - dist, inCircle));\n    gl_FragColor.a = mix(1., 1. - dist, inCircle);\n}\n"},function(e,t){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),n=function(){function e(){r(this,e)}return i(e,[{key:"generateVerticesWithoutMask",value:function(e){for(var t=new Array(3*e),r=0;r<3*e;r+=3)t[r]=10*Math.random()-5,t[r+1]=10*Math.random()-5,t[r+2]=10*-Math.random()-1;return t}}]),e}();t.default=n},function(e,t){"use strict";e.exports=function(e){if(window.WebGLRenderingContext){for(var t=["webgl","experimental-webgl","moz-webgl"],r=!1,i=0;i<t.length;i++)try{if(r=e.getContext(t[i]),r&&"function"==typeof r.getParameter)return r}catch(e){console.log("Unable to initialize WebGL. Your browser may not support it.")}return!1}return!1}}]);