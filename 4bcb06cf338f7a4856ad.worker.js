!function(e){function t(a){if(r[a])return r[a].exports;var o=r[a]={exports:{},id:a,loaded:!1};return e[a].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}var o=r(1),n=a(o),s=r(2),i=a(s);self.imageParser=new n.default,self.posGenerator=new i.default,self.unprocessedStatesAmount=1,self.pointsCount=1,self.result={geometries:[]},self.exit=function(){for(var e=new Array(self.result.geometries.length),t=0;t<self.result.geometries.length;t++)e[t]=self.result.geometries[t].buffer;self.postMessage(self.result,e)},self.makeImageRequest=function(e,t){var r=new XMLHttpRequest;r.open("GET",e.imageUrl,!0),r.responseType="arraybuffer",r.onreadystatechange=function(){if(4===r.readyState&&200===r.status){var a=self.imageParser.parsePBMBinaryImage(r.response);a.sectors=[];for(var o=0;o<a.data.length;o++)a.data[o]&&a.sectors.push(o);var n=self.posGenerator.generateMaskedBoxVertices(self.pointsCount,e,a);self.result.geometries[t]=n,self.unprocessedStatesAmount-=1,self.unprocessedStatesAmount<1&&self.exit()}},r.send()},self.startCreation=function(e,t){self.pointsCount=t,self.unprocessedStatesAmount=0;for(var r=void 0,a=0;a<e.length;a++)switch(e[a].type){case"rawData":self.result.geometries[a]=new Float32Array(e[a].data);break;case"box":r=self.posGenerator.generateBoxVertices(self.pointsCount,e[a]),self.result.geometries[a]=r;break;case"maskedBoxFromImage":if(!e[a].imageUrl)throw new Error("Masked Points Transition: State with 'maskedBoxFromImage' type should have 'imageUrl' field");self.unprocessedStatesAmount+=1,self.makeImageRequest(e[a],a);break;case"maskedBoxFromMatrix":for(var o={data:e[a].matrix||[],width:e[a].matrixWidth||1,height:e[a].matrixHeight||1,sectors:[]},n=0;n<o.data.length;n++)o.data[n]&&o.sectors.push(n);r=self.posGenerator.generateMaskedBoxVertices(self.pointsCount,e[a],o),self.result.geometries[a]=r;break;default:throw new Error("Masked Points Transition: Unknown points state type. Should be box / maskedBoxFromImage / maskedBoxFromMatrix / rawData.")}self.unprocessedStatesAmount<1&&self.exit()},self.addEventListener("message",function(e){e.data.states&&e.data.pointsCount&&self.startCreation(e.data.states,e.data.pointsCount)},!1),self.addEventListener("error",function(e){self.postMessage(e,"error in webworker")},!1)},function(e,t){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),o=function(){function e(){r(this,e)}return a(e,[{key:"parsePBMBinaryImage",value:function(e){var t=new Uint8Array(e),r=t.toString(),a=r.split(","),o=!1,n=!1,s=!1,i=!1,f=void 0,l=void 0;for(f=0;f<a.length;f++)if("10"===a[f])i=!1;else if(!i)if("35"===a[f])i=!0;else if(o){if(n)break;n=0,s=0;var u=void 0;for(l=0;"32"!==a[f];){if(u=parseInt(String.fromCharCode(a[f]),10),l>4||isNaN(u))throw new Error("Corrupted PBM image (image width / height data).");n=10*n+u,f++,l++}for("32"===a[f]&&f++,l=0;"10"!==a[f];){if(u=parseInt(String.fromCharCode(a[f]),10),l>4||isNaN(u))throw new Error("Corrupted PBM image (image width / height data).");s=10*s+u,f++,l++}}else{if("80"!==a[f]||"52"!==a[f+1])throw new Error("Wrong image format. Should be PBM binary (with P4 header).");o=!0,f++}var d=f,c=a.length-d,h=new Array(n*s),m=void 0,g=0,p=0;for(f=0;f<c;f++){g+=8;var w=parseInt(a[f+d],10);if(g<n)for(l=0;l<8;l++)h[p*n+g-l-1]=w%2,w=Math.floor(w/2);else{for(g-=8,m=n-g,l=0;l<8;l++)l>=8-m&&(h[p*n+g+8-l-1]=w%2),w=Math.floor(w/2);g=0,p++}}return{data:h,width:n,height:s}}}]),e}();t.default=o},function(e,t){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),o=function(){function e(){r(this,e)}return a(e,[{key:"generateBoxVertices",value:function(e,t){for(var r=t.width||10,a=t.height||10,o=t.depth||10,n=t.zDistance||5,s=new Array(3*e),i=0;i<3*e;i+=3)s[i]=Math.random()*r-r/2,s[i+1]=Math.random()*a-a/2,s[i+2]=-Math.random()*o-1+(5-n);return new Float32Array(s)}},{key:"generateMaskedBoxVertices",value:function(e,t,r){for(var a=t.width||10,o=t.height||10,n=t.depth||10,s=t.zDistance||5,i=r.width,f=r.height,l=r.sectors,u=void 0,d=void 0,c=new Array(3*e),h=void 0,m=0;m<3*e;m+=3)h=m/3%l.length,d=1-(Math.floor(l[h]/i)+Math.random())/f,u=(l[h]%i+Math.random())/i,c[m]=u*a-a/2,c[m+1]=d*o-o/2,c[m+2]=-Math.random()*n-1+(5-s);return new Float32Array(c)}}]),e}();t.default=o}]);