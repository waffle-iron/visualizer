var _0x9e7b=["\x4C\x69\x6E\x65\x61\x72\x46\x69\x6C\x74\x65\x72","\x52\x47\x42\x41\x46\x6F\x72\x6D\x61\x74","\x61\x64\x64","\x7A","\x70\x6F\x73\x69\x74\x69\x6F\x6E","\x75\x70\x64\x61\x74\x65\x4D\x61\x74\x72\x69\x78\x57\x6F\x72\x6C\x64","\x70\x72\x6F\x6A\x65\x63\x74\x69\x6F\x6E\x4D\x61\x74\x72\x69\x78","\x6D\x61\x74\x72\x69\x78\x57\x6F\x72\x6C\x64\x49\x6E\x76\x65\x72\x73\x65","\x6D\x75\x6C\x74\x69\x70\x6C\x79\x4D\x61\x74\x72\x69\x63\x65\x73","\x73\x65\x74\x46\x72\x6F\x6D\x4D\x61\x74\x72\x69\x78","\x73\x65\x74\x53\x69\x7A\x65","\x69\x64","\x64\x6F\x6D\x45\x6C\x65\x6D\x65\x6E\x74","\x70\x61\x72\x74\x69\x63\x6C\x65\x73","\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64","\x50\x61\x72\x74\x69\x63\x6C\x65\x42\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64"];var starWidth=ScreenWidth;var starHeight=ScreenHeight;var VIEW_ANGLE=45,ASPECT=starWidth/ starHeight,NEAR=0.1,FAR=10000;var renderer= new THREE.WebGLRenderer({alpha:true});var params={minFilter:THREE[_0x9e7b[0]],magFilter:THREE[_0x9e7b[0]],format:THREE[_0x9e7b[1]],stencilBuffer:false};var camera= new THREE.PerspectiveCamera(VIEW_ANGLE,ASPECT,NEAR,FAR);var scene= new THREE.Scene();scene[_0x9e7b[2]](camera);camera[_0x9e7b[4]][_0x9e7b[3]]= 300;var frustum= new THREE.Frustum();camera[_0x9e7b[5]]();frustum[_0x9e7b[9]]( new THREE.Matrix4()[_0x9e7b[8]](camera[_0x9e7b[6]],camera[_0x9e7b[7]]));renderer[_0x9e7b[10]](starWidth,starHeight);renderer[_0x9e7b[12]][_0x9e7b[11]]= _0x9e7b[13];document[_0x9e7b[16]](_0x9e7b[15])[_0x9e7b[14]](renderer[_0x9e7b[12]])