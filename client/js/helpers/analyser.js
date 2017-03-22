//Heavily modified from https://github.com/caseif/vis.js/blob/gh-pages/js/analysis/spectrum_algorithms.js


var barWidth = (SpectrumBarCount + Bar1080pSeperation) / SpectrumBarCount - Bar1080pSeperation;
var spectrumDimensionScalar = 4.5
var spectrumMaxExponent = 5
var spectrumMinExponent = 3
var spectrumExponentScale = 2

var SpectrumStart = 4
var SpectrumEnd = 1200
var SpectrumLogScale = 2.55

spectrumSize = 63

var resRatio = (window.innerWidth / window.innerHeight)
var spectrumWidth = 1568 * resRatio;
spectrumSpacing = 7 * resRatio;
spectrumWidth = (Bar1080pWidth + Bar1080pSeperation) * SpectrumBarCount - Bar1080pSeperation;

var spectrumHeight = 255

function SpectrumEase(Value) {
	return Math.pow(Value, SpectrumLogScale)
}
/*
function GetVisualBins(Array) {
  var SamplePoints = []
  var NewArray = []
  var LastSpot = 0
  for (var i = 0; i < SpectrumBarCount; i++) {
    var Bin = Math.round(SpectrumEase(i / SpectrumBarCount) * (SpectrumEnd - SpectrumStart) + SpectrumStart)
    if (Bin <= LastSpot) {
      Bin = LastSpot + 1
    }
    LastSpot = Bin
    SamplePoints[i] = Bin
  }

  for (var i = 0; i < SpectrumBarCount; i++) {
    var CurSpot = SamplePoints[i]
    var NextSpot = SamplePoints[i + 1]
    if (NextSpot == null) {
      NextSpot = SpectrumEnd
    }

    var CurMax = Array[CurSpot]
    var Dif = NextSpot - CurSpot
    for (var j = 1; j < Dif; j++) {
      CurMax = Math.max(Array[CurSpot + j],CurMax)
    }
    NewArray[i] = CurMax
  }

  UpdateParticleAttributes(NewArray)
  return NewArray
}*/

function normalizeAmplitude(array) {
	var values = [];
	for (var i = 0; i < spectrumSize; i++) {
		if (Playing) {
			values[i] = array[i] / 255 * spectrumHeight;
		} else {
			value = 1;
		}
	}
	return values;
}

function GetVisualBins(Array) {
	var SamplePoints = []
	var NewArray = []
	var LastSpot = 0
	for (var i = 0; i < SpectrumBarCount; i++) {
		var Bin = Math.round(SpectrumEase(i / SpectrumBarCount) * (SpectrumEnd - SpectrumStart) + SpectrumStart)
		if (Bin <= LastSpot) {
			Bin = LastSpot + 1
		}
		LastSpot = Bin
		SamplePoints[i] = Bin
	}

	var MaxSamplePoints = []
	for (var i = 0; i < SpectrumBarCount; i++) {
		var CurSpot = SamplePoints[i]
		var NextSpot = SamplePoints[i + 1]
		if (NextSpot == null) {
			NextSpot = SpectrumEnd
		}

		var CurMax = Array[CurSpot]
		var MaxSpot = CurSpot
		var Dif = NextSpot - CurSpot
		for (var j = 1; j < Dif; j++) {
			var NewSpot = CurSpot + j
			if (Array[NewSpot] > CurMax) {
				CurMax = Array[NewSpot]
				MaxSpot = NewSpot
			}
		}
		MaxSamplePoints[i] = MaxSpot
	}

	for (var i = 0; i < SpectrumBarCount; i++) {
		var CurSpot = SamplePoints[i]
		var NextMaxSpot = MaxSamplePoints[i]
		var LastMaxSpot = MaxSamplePoints[i - 1]
		if (LastMaxSpot == null) {
			LastMaxSpot = SpectrumStart
		}
		var LastMax = Array[LastMaxSpot]
		var NextMax = Array[NextMaxSpot]

		NewArray[i] = (LastMax + NextMax) / 2
	}

	UpdateParticleAttributes(NewArray)
	return NewArray
}

function TransformToVisualBins(Array) {
	Array = normalizeAmplitude(Array);
	Array = averageTransform(Array)
	Array = exponentialTransform(Array)
	Array = powTransform(Array)
	Array = experimentalTransform(Array);
	Array = normalizeAmplitude(Array);
	return Array;
}

function averageTransform(array) {
	var values = [];
	var length = array.length;

	for (var i = 0; i < length; i++) {
		var value = 0;
		if (i == 0) {
			value = array[i];
		} else if (i == length - 1) {
			value = (array[i - 1] + array[i]) / 2;
		} else {
			var prevValue = array[i - 1];
			var curValue = array[i];
			var nextValue = array[i + 1];

			if (curValue >= prevValue && curValue >= nextValue) {
				value = curValue;
			} else {
				value = (curValue + Math.max(nextValue, prevValue)) / 2;
			}
		}
		value = Math.min(value + 1, spectrumHeight);

		values[i] = value;
	}

	var newValues = [];
	for (var i = 0; i < length; i++) {
		var value = 0;
		if (i == 0) {
			value = values[i];
		} else if (i == length - 1) {
			value = (values[i - 1] + values[i]) / 2;
		} else {
			var prevValue = values[i - 1];
			var curValue = values[i];
			var nextValue = values[i + 1];

			if (curValue >= prevValue && curValue >= nextValue) {
				value = curValue;
			} else {
				value = ((curValue / 2) + (Math.max(nextValue, prevValue) / 3) + (Math.min(nextValue, prevValue) / 6));
			}
		}
		value = Math.min(value + 1, spectrumHeight);

		newValues[i] = value;
	}
	return newValues;
}

function AverageTransform(Array) {
	var Length = Array.length


	var Values = []
	for (var i = 0; i < Length; i++) {
		var Value = 0
		if (i == 0) {
			Value = Array[i];
		} else {
			var PrevValue = Array[i - 1]
			var NextValue = Array[i + 1]
			var CurValue = Array[i]

			Value = ((CurValue * 4) + ((NextValue + PrevValue) / 2 * 2)) / 6
		}
		Value = Math.min(Value + 1, spectrumHeight)

		Values[i] = Value;
	}

	return Values
	/*
	    var SamplePoints = []
	    for (var i = 0; i < Length; i = i + 2) {
	      SamplePoints[SamplePoints.length] = i
	    }

	    function Interpolate(S,E,A) {
	      return S + (E-S)*A
	    }

	    for (var i = 0; i < SamplePoints.length; i++) {
	      var CurSamplePoint = SamplePoints[i]
	      var NextSamplePoint = SamplePoints[i + 1]
	      if (NextSamplePoint) {
	        var Dif = NextSamplePoint - CurSamplePoint
	        for (var j = 1; j < Dif; j++) {
	          Array[CurSamplePoint + j] = Interpolate(Array[CurSamplePoint],Array[NextSamplePoint],j/Dif)
	        }
	      }
	    }

	    return Array*/
}

// function exponentialTransform(array) {
// 	var newArr = [];
// 	for (var i = 0; i < array.length; i++) {
// 		var exp = spectrumMaxExponent + (spectrumMinExponent - spectrumMaxExponent) * (i / array.length)
// 		newArr[i] = Math.max(Math.pow(array[i] / spectrumHeight, exp) * spectrumHeight, 1);
// 	}
// 	return newArr;
// }

function exponentialTransform(array) {
	var newArr = [];
	for (var i = 0; i < array.length; i++) {
		var exp = (spectrumMaxExponent - spectrumMinExponent) * (1 - Math.pow(i / spectrumSize, spectrumExponentScale)) + spectrumMinExponent;
		newArr[i] = Math.max(Math.pow(array[i] / spectrumHeight, exp) * spectrumHeight, 1);
	}
	return newArr;
}

// top secret bleeding-edge shit in here
function experimentalTransform(array) {
	var resistance = 3; // magic constant
	var newArr = [];
	for (var i = 0; i < array.length; i++) {
		var sum = 0;
		var divisor = 0;
		for (var j = 0; j < array.length; j++) {
			var dist = Math.abs(i - j);
			var weight = 1 / Math.pow(2, dist);
			if (weight == 1) weight = resistance;
			sum += array[j] * weight;
			divisor += weight;
		}
		newArr[i] = sum / divisor;
	}
	return newArr;
}

// function powTransform(array) {
// 	var newArr = array.map(function(v) {
// 		var dv = v / 255
// 		return Math.pow(dv, (1 - dv) * normalize(v, math.max(array), 0, 1, 2)) * 255
// 	});
//
// 	return newArr;
// }

function powTransform(array) {
	var newArr = array.map(function(v) {
		var dv = v / 255
		return Math.pow(dv, (1 - dv) * normalize(math.mean(array), math.max(array), 0, 1, 3)) * 255
	});

	return newArr;
}

function normalize(value, max, min, dmax, dmin) {
	return (dmax - dmin) / (max - min) * (value - max) + dmax
}


//ADDITIONS

// mostly for debugging purposes
function smooth(array) {
	return savitskyGolaySmooth(array);
}

/**
 * Applies a Savitsky-Golay smoothing algorithm to the given array.
 *
 * See {@link http://www.wire.tu-bs.de/OLDWEB/mameyer/cmr/savgol.pdf} for more
 * info.
 *
 * @param array The array to apply the algorithm to
 *
 * @return The smoothed array
 */
function savitskyGolaySmooth(array) {
	var lastArray = array;
	for (var pass = 0; pass < smoothingPasses; pass++) {
		var sidePoints = Math.floor(smoothingPoints / 2); // our window is centered so this is both nL and nR
		var cn = 1 / (2 * sidePoints + 1); // constant
		var newArr = [];
		for (var i = 0; i < sidePoints; i++) {
			newArr[i] = lastArray[i];
			newArr[lastArray.length - i - 1] = lastArray[lastArray.length - i - 1];
		}
		for (var i = sidePoints; i < lastArray.length - sidePoints; i++) {
			var sum = 0;
			for (var n = -sidePoints; n <= sidePoints; n++) {
				sum += cn * lastArray[i + n] + n;
			}
			newArr[i] = sum;
		}
		lastArray = newArr;
	}
	return newArr;
}
