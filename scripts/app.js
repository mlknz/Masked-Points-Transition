!function(e){function t(a){if(r[a])return r[a].exports;var i=r[a]={exports:{},id:a,loaded:!1};return e[a].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){e.exports=r(1)},function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),o=r(2),s=a(o),u=r(6),l=r(7),f=null,c=void 0,d=void 0,h=void 0,p=0,m=void 0,g=window.devicePixelRatio||1,v={pointsCount:1500,pointSizeMin:5,pointSizeMax:10,backgroundColor:[0,0,0],pointsColor:[1,1,1],camera:{speed:.2,amplitude:.4,targetDistance:2,near:.7,far:100,fovy:1.1},states:[{type:"box",width:10,height:10,depth:7,zDistance:5},{type:"box",width:10,height:10,depth:9,zDistance:5},{type:"box",width:50,height:50,depth:1,zDistance:-1},{type:"maskedBoxFromImage",imageUrl:"https://mlknz.github.io/Masked-Points-Transition/assets/images/test4.pbm",width:10,height:10,depth:.1,zDistance:12},{type:"maskedBoxFromMatrix",matrix:[1,1,1,0,0,1,1,0,1],matrixWidth:3,matrixHeight:3,width:10,height:10,depth:.1,zDistance:12}]},w=function(){function e(){if(i(this,e),m=this,c=document.getElementById("canvas"),f=u(c),!f)return void(document.body.innerHTML="Unable to initialize WebGL. Your browser may not support it.");this.initGlState();var t=new l;t.addEventListener("error",function(e){console.warn("Error in webworker: ",e.data)},!1),t.addEventListener("message",function(e){e.data.geometries&&(m.points=new s.default(f,e.data.geometries,v))},!1),t.postMessage(v),this.animate()}return n(e,[{key:"initGlState",value:function(){var e=v.backgroundColor;f.clearColor(e[0],e[1],e[2],1),f.enable(f.BLEND),f.blendFunc(f.ONE,f.ONE)}},{key:"resize",value:function(){d=Math.floor(c.clientWidth*g),h=Math.floor(c.clientHeight*g),c.width===d&&c.height===h||(c.width=d,c.height=h,this.points&&this.points.resize()),f.viewport(0,0,f.canvas.width,f.canvas.height)}},{key:"animate",value:function(){m.resize(),f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT),p=(new Date).getTime(),p=(p-1e6*Math.floor(p/1e6))/1e3,m.points&&(f.useProgram(m.points.shaderProgram),m.points.updateProgress(p),m.points.updateCamera(p),m.points.render()),requestAnimationFrame(m.animate)}}]),e}();window.app=new w},function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),o=r(3),s=a(o),u=r(4),l=a(u),f=r(5),c=void 0,d=void 0,h=void 0,p=0,m=0,g=0,v=0,w=0,b=void 0,y=void 0,M=void 0,x=void 0,P=function(){function e(t,r,a){var n=this;i(this,e),this.gl=t,this.n=a.pointsCount||1,this.camSpeed=a.camera.speed||0,this.camAmplitude=a.camera.amplitude||0,this.camNear=a.camera.near||1,this.camFar=a.camera.far||80,this.camFovY=a.camera.fovy||1,this.positions=r,M=t.createBuffer(),x=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,M),t.bufferData(t.ARRAY_BUFFER,this.positions[0],t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,x),t.bufferData(t.ARRAY_BUFFER,this.positions[0],t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),this.shaderProgram=this.createShaderProgram(t);var o=t.getAttribLocation(this.shaderProgram,"position"),s=t.getAttribLocation(this.shaderProgram,"newPosition");t.bindBuffer(t.ARRAY_BUFFER,M),t.vertexAttribPointer(o,3,t.FLOAT,!1,0,0),t.enableVertexAttribArray(o),t.bindBuffer(t.ARRAY_BUFFER,x),t.vertexAttribPointer(s,3,t.FLOAT,!1,0,0),t.enableVertexAttribArray(s),this.viewMatrix=(0,f.createMatrix4)(),this.perpectiveMatrix=(0,f.createMatrix4)(),this.viewPerspectiveMatrix=(0,f.createMatrix4)(),this.eyePos=[0,0,0],this.eyeTargetPos=[0,0,-a.camera.targetDistance],this.up=[0,1,0],c=this.gl.getUniformLocation(this.shaderProgram,"viewPerspectiveMatrix"),d=this.gl.getUniformLocation(this.shaderProgram,"progress"),t.useProgram(this.shaderProgram);var u=this.gl.getUniformLocation(this.shaderProgram,"pointSizeMinMax");this.gl.uniform2f(u,a.pointSizeMin,a.pointSizeMax);var l=this.gl.getUniformLocation(this.shaderProgram,"color");this.gl.uniform3f(l,a.pointsColor[0],a.pointsColor[1],a.pointsColor[2]),this.resize(),a.camera.speed&&document.addEventListener("mousemove",function(e){m=(e.clientX/window.innerWidth-.5)*n.camAmplitude,g=-(e.clientY/window.innerHeight-.5)*n.camAmplitude})}return n(e,[{key:"setPositionIndices",value:function(e,t){var r=e,a=t,i=this.gl;this.positions[r]&&this.positions[a]||(r=0,a=0),i.bindBuffer(i.ARRAY_BUFFER,M),i.bufferData(i.ARRAY_BUFFER,this.positions[r],i.STATIC_DRAW),i.bindBuffer(i.ARRAY_BUFFER,x),i.bufferData(i.ARRAY_BUFFER,this.positions[a],i.STATIC_DRAW),i.bindBuffer(i.ARRAY_BUFFER,null)}},{key:"resize",value:function(){this.gl.useProgram(this.shaderProgram),(0,f.makePerspectiveMatrix)(this.perpectiveMatrix,this.camFovY,window.innerWidth/window.innerHeight,this.camNear,this.camFar)}},{key:"updateCamera",value:function(e){if(h=e-p,p=e,b=m-this.eyePos[0],y=g-this.eyePos[1],Math.abs(b)>.01||Math.abs(y)>.01){var t=Math.sqrt(b*b+y*y);b/=t,y/=t,v=this.eyePos[0]+b*h*this.camSpeed,w=this.eyePos[1]+y*h*this.camSpeed}this.eyePos[0]=v,this.eyePos[1]=w,(0,f.lookAt)(this.viewMatrix,this.eyePos,this.eyeTargetPos,this.up),(0,f.multiplyMatrices)(this.viewPerspectiveMatrix,this.viewMatrix,this.perpectiveMatrix),this.gl.uniformMatrix4fv(c,!1,this.viewPerspectiveMatrix)}},{key:"createShaderProgram",value:function(e){var t=e.createShader(e.VERTEX_SHADER);e.shaderSource(t,s.default),e.compileShader(t);var r=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(r,l.default),e.compileShader(r);var a=e.createProgram();return e.attachShader(a,t),e.attachShader(a,r),e.linkProgram(a),a}},{key:"updateProgress",value:function(e){this.gl.uniform1f(d,e)}},{key:"render",value:function(){this.gl.drawArrays(this.gl.POINTS,0,this.n)}}]),e}();t.default=P},function(e,t){e.exports="attribute vec3 position;\nattribute vec3 newPosition;\n\nuniform mat4 viewPerspectiveMatrix;\n\nuniform vec2 pointSizeMinMax;\nuniform float progress;\n\nvarying float dist;\n\nvoid main() {\n\n    vec3 pos = mix(position, newPosition, sin(progress)*0.5 + 0.5);\n    dist = 1. - (-pos.z - 1.) / 10.; // [0, 1]\n\n    gl_Position = viewPerspectiveMatrix * vec4(pos, 1.0);\n    gl_PointSize = mix(pointSizeMinMax.y, pointSizeMinMax.x, dist);\n}\n"},function(e,t){e.exports="precision highp float;\n\nuniform vec3 color;\nvarying float dist;\n\nvoid main() {\n\n    vec2 coord = gl_PointCoord - vec2(0.5);\n    float inCircle = 1. - smoothstep(0.495, 0.500, length(coord));\n    // if (length(coord) > 0.5) inCircle = 0.;\n    if (inCircle < 0.95) discard;\n    gl_FragColor = vec4(mix(0., 1. - dist, inCircle));\n\n    gl_FragColor.rgb *= color;\n    gl_FragColor.a = mix(1., 1. - dist, inCircle);\n}\n"},function(e,t){"use strict";function r(){var e=new Float32Array(16);return s(e),e}function a(e,t,r,a){var i=void 0,n=void 0,u=void 0,l=void 0,f=void 0,c=void 0,d=void 0,h=void 0,p=void 0,m=void 0,g=t[0],v=t[1],w=t[2],b=a[0],y=a[1],M=a[2],x=r[0],P=r[1],A=r[2];return Math.abs(g-x)<o&&Math.abs(v-P)<o&&Math.abs(w-A)<o?s(e):(d=g-x,h=v-P,p=w-A,m=1/Math.sqrt(d*d+h*h+p*p),d*=m,h*=m,p*=m,i=y*p-M*h,n=M*d-b*p,u=b*h-y*d,m=Math.sqrt(i*i+n*n+u*u),m?(m=1/m,i*=m,n*=m,u*=m):(i=0,n=0,u=0),l=h*u-p*n,f=p*i-d*u,c=d*n-h*i,m=Math.sqrt(l*l+f*f+c*c),m?(m=1/m,l*=m,f*=m,c*=m):(l=0,f=0,c=0),e[0]=i,e[1]=l,e[2]=d,e[3]=0,e[4]=n,e[5]=f,e[6]=h,e[7]=0,e[8]=u,e[9]=c,e[10]=p,e[11]=0,e[12]=-(i*g+n*v+u*w),e[13]=-(l*g+f*v+c*w),e[14]=-(d*g+h*v+p*w),e[15]=1,e)}function i(e,t,r,a,i){var n=1/Math.tan(t/2),o=1/(a-i);return e[0]=n/r,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=n,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=(i+a)*o,e[11]=-1,e[12]=0,e[13]=0,e[14]=2*i*a*o,e[15]=0,e}function n(e,t,r){var a=t[0],i=t[1],n=t[2],o=t[3],s=t[4],u=t[5],l=t[6],f=t[7],c=t[8],d=t[9],h=t[10],p=t[11],m=t[12],g=t[13],v=t[14],w=t[15],b=r[0],y=r[1],M=r[2],x=r[3];return e[0]=b*a+y*s+M*c+x*m,e[1]=b*i+y*u+M*d+x*g,e[2]=b*n+y*l+M*h+x*v,e[3]=b*o+y*f+M*p+x*w,b=r[4],y=r[5],M=r[6],x=r[7],e[4]=b*a+y*s+M*c+x*m,e[5]=b*i+y*u+M*d+x*g,e[6]=b*n+y*l+M*h+x*v,e[7]=b*o+y*f+M*p+x*w,b=r[8],y=r[9],M=r[10],x=r[11],e[8]=b*a+y*s+M*c+x*m,e[9]=b*i+y*u+M*d+x*g,e[10]=b*n+y*l+M*h+x*v,e[11]=b*o+y*f+M*p+x*w,b=r[12],y=r[13],M=r[14],x=r[15],e[12]=b*a+y*s+M*c+x*m,e[13]=b*i+y*u+M*d+x*g,e[14]=b*n+y*l+M*h+x*v,e[15]=b*o+y*f+M*p+x*w,e}Object.defineProperty(t,"__esModule",{value:!0}),t.createMatrix4=r,t.lookAt=a,t.makePerspectiveMatrix=i,t.multiplyMatrices=n;var o=1e-6,s=function(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}},function(e,t){"use strict";e.exports=function(e){if(window.WebGLRenderingContext){for(var t=["webgl","experimental-webgl","moz-webgl"],r=!1,a=0;a<t.length;a++)try{if(r=e.getContext(t[a]),r&&"function"==typeof r.getParameter)return r}catch(e){console.log("Unable to initialize WebGL. Your browser may not support it.")}return!1}return!1}},function(e,t,r){e.exports=function(){return r(8)('!function(e){function t(a){if(r[a])return r[a].exports;var o=r[a]={exports:{},id:a,loaded:!1};return e[a].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var o=r(1),n=a(o),s=r(2),i=a(s);self.imageParser=new n.default,self.posGenerator=new i.default,self.unprocessedStatesAmount=1,self.pointsCount=1,self.result={geometries:[]},self.exit=function(){for(var e=new Array(self.result.geometries.length),t=0;t<self.result.geometries.length;t++)e[t]=self.result.geometries[t].buffer;self.postMessage(self.result,e)},self.makeImageRequest=function(e,t){var r=new XMLHttpRequest;r.open("GET",e.imageUrl,!0),r.responseType="arraybuffer",r.onreadystatechange=function(){if(4===r.readyState&&200===r.status){var a=self.imageParser.parsePBMBinaryImage(r.response);a.sectors=[];for(var o=0;o<a.data.length;o++)a.data[o]&&a.sectors.push(o);var n=self.posGenerator.generateMaskedBoxVertices(self.pointsCount,e,a);self.result.geometries[t]=n,self.unprocessedStatesAmount-=1,self.unprocessedStatesAmount<1&&self.exit()}},r.send()},self.startCreation=function(e,t){self.pointsCount=t,self.unprocessedStatesAmount=0;for(var r=void 0,a=0;a<e.length;a++)switch(e[a].type){case"rawData":self.result.geometries[a]=new Float32Array(e[a].data);break;case"box":r=self.posGenerator.generateBoxVertices(self.pointsCount,e[a]),self.result.geometries[a]=r;break;case"maskedBoxFromImage":if(!e[a].imageUrl)throw new Error("Masked Points Transition: State with \'maskedBoxFromImage\' type should have \'imageUrl\' field");self.unprocessedStatesAmount+=1,self.makeImageRequest(e[a],a);break;case"maskedBoxFromMatrix":for(var o={data:e[a].matrix||[],width:e[a].matrixWidth||1,height:e[a].matrixHeight||1,sectors:[]},n=0;n<o.data.length;n++)o.data[n]&&o.sectors.push(n);r=self.posGenerator.generateMaskedBoxVertices(self.pointsCount,e[a],o),self.result.geometries[a]=r;break;default:throw new Error("Masked Points Transition: Unknown points state type. Should be box / maskedBoxFromImage / maskedBoxFromMatrix / rawData.")}self.unprocessedStatesAmount<1&&self.exit()},self.addEventListener("message",function(e){e.data.states&&e.data.pointsCount&&self.startCreation(e.data.states,e.data.pointsCount)},!1),self.addEventListener("error",function(e){self.postMessage(e,"error in webworker")},!1)},function(e,t){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),o=function(){function e(){r(this,e)}return a(e,[{key:"parsePBMBinaryImage",value:function(e){var t=new Uint8Array(e),r=t.toString(),a=r.split(","),o=!1,n=!1,s=!1,i=!1,f=void 0,l=void 0;for(f=0;f<a.length;f++)if("10"===a[f])i=!1;else if(!i)if("35"===a[f])i=!0;else if(o){if(n)break;n=0,s=0;var u=void 0;for(l=0;"32"!==a[f];){if(u=parseInt(String.fromCharCode(a[f]),10),l>4||isNaN(u))throw new Error("Corrupted PBM image (image width / height data).");n=10*n+u,f++,l++}for("32"===a[f]&&f++,l=0;"10"!==a[f];){if(u=parseInt(String.fromCharCode(a[f]),10),l>4||isNaN(u))throw new Error("Corrupted PBM image (image width / height data).");s=10*s+u,f++,l++}}else{if("80"!==a[f]||"52"!==a[f+1])throw new Error("Wrong image format. Should be PBM binary (with P4 header).");o=!0,f++}var d=f,c=a.length-d,h=new Array(n*s),m=void 0,g=0,p=0;for(f=0;f<c;f++){g+=8;var w=parseInt(a[f+d],10);if(g<n)for(l=0;l<8;l++)h[p*n+g-l-1]=w%2,w=Math.floor(w/2);else{for(g-=8,m=n-g,l=0;l<8;l++)l>=8-m&&(h[p*n+g+8-l-1]=w%2),w=Math.floor(w/2);g=0,p++}}return{data:h,width:n,height:s}}}]),e}();t.default=o},function(e,t){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),o=function(){function e(){r(this,e)}return a(e,[{key:"generateBoxVertices",value:function(e,t){for(var r=t.width||10,a=t.height||10,o=t.depth||10,n=t.zDistance||5,s=new Array(3*e),i=0;i<3*e;i+=3)s[i]=Math.random()*r-r/2,s[i+1]=Math.random()*a-a/2,s[i+2]=-Math.random()*o-1+(5-n);return new Float32Array(s)}},{key:"generateMaskedBoxVertices",value:function(e,t,r){for(var a=t.width||10,o=t.height||10,n=t.depth||10,s=t.zDistance||5,i=r.width,f=r.height,l=r.sectors,u=void 0,d=void 0,c=new Array(3*e),h=void 0,m=0;m<3*e;m+=3)h=m/3%l.length,d=1-(Math.floor(l[h]/i)+Math.random())/f,u=(l[h]%i+Math.random())/i,c[m]=u*a-a/2,c[m+1]=d*o-o/2,c[m+2]=-Math.random()*n-1+(5-s);return new Float32Array(c)}}]),e}();t.default=o}]);',r.p+"4bcb06cf338f7a4856ad.worker.js")}},function(e,t){var r=window.URL||window.webkitURL;e.exports=function(e,t){try{try{var a;try{var i=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder;a=new i,a.append(e),a=a.getBlob()}catch(t){a=new Blob([e])}return new Worker(r.createObjectURL(a))}catch(t){return new Worker("data:application/javascript,"+encodeURIComponent(e))}}catch(e){return new Worker(t)}}}]);