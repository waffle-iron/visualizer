var _0x7c37=["\x69\x6E\x6E\x65\x72\x57\x69\x64\x74\x68","\x69\x6E\x6E\x65\x72\x48\x65\x69\x67\x68\x74","\x70\x6F\x77","\x72\x6F\x75\x6E\x64","\x6C\x65\x6E\x67\x74\x68","\x6D\x61\x78","\x6D\x69\x6E","\x61\x62\x73","\x6D\x65\x61\x6E","\x6D\x61\x70","\x66\x6C\x6F\x6F\x72"];var barWidth=(SpectrumBarCount+ Bar1080pSeperation)/ SpectrumBarCount- Bar1080pSeperation;var spectrumDimensionScalar=4.5;var spectrumMaxExponent=5;var spectrumMinExponent=3;var spectrumExponentScale=2;var SpectrumStart=4;var SpectrumEnd=1200;var SpectrumLogScale=2.55;spectrumSize= 63;var resRatio=(window[_0x7c37[0]]/ window[_0x7c37[1]]);var spectrumWidth=1568* resRatio;spectrumSpacing= 7* resRatio;spectrumWidth= (Bar1080pWidth+ Bar1080pSeperation)* SpectrumBarCount- Bar1080pSeperation;var spectrumHeight=255;function SpectrumEase(_0xf620xd){return Math[_0x7c37[2]](_0xf620xd,SpectrumLogScale)}function normalizeAmplitude(_0xf620xf){var _0xf620x10=[];for(var _0xf620x11=0;_0xf620x11< spectrumSize;_0xf620x11++){if(Playing){_0xf620x10[_0xf620x11]= _0xf620xf[_0xf620x11]/ 255* spectrumHeight}else {value= 1}};return _0xf620x10}function GetVisualBins(_0xf620x13){var _0xf620x14=[];var _0xf620x15=[];var _0xf620x16=0;for(var _0xf620x11=0;_0xf620x11< SpectrumBarCount;_0xf620x11++){var _0xf620x17=Math[_0x7c37[3]](SpectrumEase(_0xf620x11/ SpectrumBarCount)* (SpectrumEnd- SpectrumStart)+ SpectrumStart);if(_0xf620x17<= _0xf620x16){_0xf620x17= _0xf620x16+ 1};_0xf620x16= _0xf620x17;_0xf620x14[_0xf620x11]= _0xf620x17};var _0xf620x18=[];for(var _0xf620x11=0;_0xf620x11< SpectrumBarCount;_0xf620x11++){var _0xf620x19=_0xf620x14[_0xf620x11];var _0xf620x1a=_0xf620x14[_0xf620x11+ 1];if(_0xf620x1a== null){_0xf620x1a= SpectrumEnd};var _0xf620x1b=_0xf620x13[_0xf620x19];var _0xf620x1c=_0xf620x19;var _0xf620x1d=_0xf620x1a- _0xf620x19;for(var _0xf620x1e=1;_0xf620x1e< _0xf620x1d;_0xf620x1e++){var _0xf620x1f=_0xf620x19+ _0xf620x1e;if(_0xf620x13[_0xf620x1f]> _0xf620x1b){_0xf620x1b= _0xf620x13[_0xf620x1f];_0xf620x1c= _0xf620x1f}};_0xf620x18[_0xf620x11]= _0xf620x1c};for(var _0xf620x11=0;_0xf620x11< SpectrumBarCount;_0xf620x11++){var _0xf620x19=_0xf620x14[_0xf620x11];var _0xf620x20=_0xf620x18[_0xf620x11];var _0xf620x21=_0xf620x18[_0xf620x11- 1];if(_0xf620x21== null){_0xf620x21= SpectrumStart};var _0xf620x22=_0xf620x13[_0xf620x21];var _0xf620x23=_0xf620x13[_0xf620x20];_0xf620x15[_0xf620x11]= (_0xf620x22+ _0xf620x23)/ 2};UpdateParticleAttributes(_0xf620x15);return _0xf620x15}function TransformToVisualBins(_0xf620x13){_0xf620x13= normalizeAmplitude(_0xf620x13);_0xf620x13= averageTransform(_0xf620x13);_0xf620x13= exponentialTransform(_0xf620x13);_0xf620x13= powTransform(_0xf620x13);_0xf620x13= experimentalTransform(_0xf620x13);_0xf620x13= normalizeAmplitude(_0xf620x13);return _0xf620x13}function averageTransform(_0xf620xf){var _0xf620x10=[];var _0xf620x26=_0xf620xf[_0x7c37[4]];for(var _0xf620x11=0;_0xf620x11< _0xf620x26;_0xf620x11++){var _0xf620x27=0;if(_0xf620x11== 0){_0xf620x27= _0xf620xf[_0xf620x11]}else {if(_0xf620x11== _0xf620x26- 1){_0xf620x27= (_0xf620xf[_0xf620x11- 1]+ _0xf620xf[_0xf620x11])/ 2}else {var _0xf620x28=_0xf620xf[_0xf620x11- 1];var _0xf620x29=_0xf620xf[_0xf620x11];var _0xf620x2a=_0xf620xf[_0xf620x11+ 1];if(_0xf620x29>= _0xf620x28&& _0xf620x29>= _0xf620x2a){_0xf620x27= _0xf620x29}else {_0xf620x27= (_0xf620x29+ Math[_0x7c37[5]](_0xf620x2a,_0xf620x28))/ 2}}};_0xf620x27= Math[_0x7c37[6]](_0xf620x27+ 1,spectrumHeight);_0xf620x10[_0xf620x11]= _0xf620x27};var _0xf620x2b=[];for(var _0xf620x11=0;_0xf620x11< _0xf620x26;_0xf620x11++){var _0xf620x27=0;if(_0xf620x11== 0){_0xf620x27= _0xf620x10[_0xf620x11]}else {if(_0xf620x11== _0xf620x26- 1){_0xf620x27= (_0xf620x10[_0xf620x11- 1]+ _0xf620x10[_0xf620x11])/ 2}else {var _0xf620x28=_0xf620x10[_0xf620x11- 1];var _0xf620x29=_0xf620x10[_0xf620x11];var _0xf620x2a=_0xf620x10[_0xf620x11+ 1];if(_0xf620x29>= _0xf620x28&& _0xf620x29>= _0xf620x2a){_0xf620x27= _0xf620x29}else {_0xf620x27= ((_0xf620x29/ 2)+ (Math[_0x7c37[5]](_0xf620x2a,_0xf620x28)/ 3)+ (Math[_0x7c37[6]](_0xf620x2a,_0xf620x28)/ 6))}}};_0xf620x27= Math[_0x7c37[6]](_0xf620x27+ 1,spectrumHeight);_0xf620x2b[_0xf620x11]= _0xf620x27};return _0xf620x2b}function AverageTransform(_0xf620x13){var _0xf620x2d=_0xf620x13[_0x7c37[4]];var _0xf620x2e=[];for(var _0xf620x11=0;_0xf620x11< _0xf620x2d;_0xf620x11++){var _0xf620xd=0;if(_0xf620x11== 0){_0xf620xd= _0xf620x13[_0xf620x11]}else {var _0xf620x2f=_0xf620x13[_0xf620x11- 1];var _0xf620x30=_0xf620x13[_0xf620x11+ 1];var _0xf620x31=_0xf620x13[_0xf620x11];_0xf620xd= ((_0xf620x31* 4)+ ((_0xf620x30+ _0xf620x2f)/ 2* 2))/ 6};_0xf620xd= Math[_0x7c37[6]](_0xf620xd+ 1,spectrumHeight);_0xf620x2e[_0xf620x11]= _0xf620xd};return _0xf620x2e}function exponentialTransform(_0xf620xf){var _0xf620x33=[];for(var _0xf620x11=0;_0xf620x11< _0xf620xf[_0x7c37[4]];_0xf620x11++){var _0xf620x34=(spectrumMaxExponent- spectrumMinExponent)* (1- Math[_0x7c37[2]](_0xf620x11/ spectrumSize,spectrumExponentScale))+ spectrumMinExponent;_0xf620x33[_0xf620x11]= Math[_0x7c37[5]](Math[_0x7c37[2]](_0xf620xf[_0xf620x11]/ spectrumHeight,_0xf620x34)* spectrumHeight,1)};return _0xf620x33}function experimentalTransform(_0xf620xf){var _0xf620x36=3;var _0xf620x33=[];for(var _0xf620x11=0;_0xf620x11< _0xf620xf[_0x7c37[4]];_0xf620x11++){var _0xf620x37=0;var _0xf620x38=0;for(var _0xf620x1e=0;_0xf620x1e< _0xf620xf[_0x7c37[4]];_0xf620x1e++){var _0xf620x39=Math[_0x7c37[7]](_0xf620x11- _0xf620x1e);var _0xf620x3a=1/ Math[_0x7c37[2]](2,_0xf620x39);if(_0xf620x3a== 1){_0xf620x3a= _0xf620x36};_0xf620x37+= _0xf620xf[_0xf620x1e]* _0xf620x3a;_0xf620x38+= _0xf620x3a};_0xf620x33[_0xf620x11]= _0xf620x37/ _0xf620x38};return _0xf620x33}function powTransform(_0xf620xf){var _0xf620x33=_0xf620xf[_0x7c37[9]](function(_0xf620x3c){var _0xf620x3d=_0xf620x3c/ 255;var _0xf620x3e=normalize(_0xf620x3c,math[_0x7c37[5]](_0xf620xf),math[_0x7c37[8]](_0xf620xf),1,3);return Math[_0x7c37[2]](_0xf620x3d,(1- _0xf620x3d)* _0xf620x3e)* 255});return _0xf620x33}function normalize(_0xf620x27,_0xf620x40,_0xf620x41,_0xf620x42,_0xf620x43){return (_0xf620x42- _0xf620x43)/ (_0xf620x40- _0xf620x41)* (_0xf620x27- _0xf620x40)+ _0xf620x42}function smooth(_0xf620xf){return savitskyGolaySmooth(_0xf620xf)}function savitskyGolaySmooth(_0xf620xf){var _0xf620x46=_0xf620xf;for(var _0xf620x47=0;_0xf620x47< smoothingPasses;_0xf620x47++){var _0xf620x48=Math[_0x7c37[10]](smoothingPoints/ 2);var _0xf620x49=1/ (2* _0xf620x48+ 1);var _0xf620x33=[];for(var _0xf620x11=0;_0xf620x11< _0xf620x48;_0xf620x11++){_0xf620x33[_0xf620x11]= _0xf620x46[_0xf620x11];_0xf620x33[_0xf620x46[_0x7c37[4]]- _0xf620x11- 1]= _0xf620x46[_0xf620x46[_0x7c37[4]]- _0xf620x11- 1]};for(var _0xf620x11=_0xf620x48;_0xf620x11< _0xf620x46[_0x7c37[4]]- _0xf620x48;_0xf620x11++){var _0xf620x37=0;for(var _0xf620x4a=-_0xf620x48;_0xf620x4a<= _0xf620x48;_0xf620x4a++){_0xf620x37+= _0xf620x49* _0xf620x46[_0xf620x11+ _0xf620x4a]+ _0xf620x4a};_0xf620x33[_0xf620x11]= _0xf620x37};_0xf620x46= _0xf620x33};return _0xf620x33}