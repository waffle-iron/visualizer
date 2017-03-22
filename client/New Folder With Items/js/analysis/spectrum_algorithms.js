var opt = {
	resistance: 3,
	experimental: true,
	exponential: true,
	normalize: true,
	tail: true,
	average: true,
	smooth: false,
	peak: false,
	ms: false,
	pow: true,
	spike: false,
	i: 10,
	j: 20,
	allMax: true
}

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

function transformToVisualBins(array) {
	var newArray = new Uint8Array(spectrumSize);
	for (var i = 0; i < spectrumSize; i++) {
		var bin = Math.pow(i / spectrumSize, spectrumScale) * (spectrumEnd - spectrumStart) + spectrumStart;
		newArray[i] = array[Math.floor(bin) + spectrumStart] * (bin % 1) +
			array[Math.floor(bin + 1) + spectrumStart] * (1 - (bin % 1))
	}
	return newArray;
}

/*function getTransformedSpectrum(array) {
	var newArr = normalizeAmplitude(array);
	newArr = averageTransform(newArr);
	newArr = tailTransform(newArr);
	newArr = smooth(newArr);
	newArr = exponentialTransform(newArr);
	return newArr;
}*/


function getTransformedSpectrum(array) {
	var newArr = array;
	newArr = normalizeAmplitude(newArr);
	newArr = averageTransform(newArr);
	newArr = tailTransform(newArr);
	//smooth
	newArr = exponentialTransform(newArr);

	newArr = powTransform(newArr);


	newArr = experimentalTransform(newArr);

	newArr = normalizeAmplitude(newArr);
	if (midi) handlePad(newArr);
	return newArr;
}


function normalizeAmplitude(array) {
	var values = [];
	for (var i = 0; i < spectrumSize; i++) {
		if (begun) {
			values[i] = array[i] / 255 * spectrumHeight;
		} else {
			value = 1;
		}
	}
	return values;
}

/*function averageTransform(array) {
    var values = [];
    for (var i = 0; i < spectrumSize; i++) {
        if (i == 0) {
            var value = array[i];
        }
        else if (i == spectrumSize - 1) {
            var value = (array[i - 1] + array[i]) / 2;
        }
        else {
            var value = (array[i - 1] + array[i] + array[i + 1]) / 3;
        }
        value = Math.min(value + 1, spectrumHeight);

        values[i] = value;
    }

    return values;
}*/

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

function tailTransform(array) {
	var values = [];
	for (var i = 0; i < spectrumSize; i++) {
		var value = array[i];
		if (i < headMargin) {
			value *= headMarginSlope * Math.pow(i + 1, marginDecay) + minMarginWeight;
		} else if (spectrumSize - i <= tailMargin) {
			value *= tailMarginSlope * Math.pow(spectrumSize - i, marginDecay) + minMarginWeight;
		}
		values[i] = value;
	}
	return values;
}

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

function peak1(A, c, d) {
	var m = Math.floor((c + d) / 2);
	if (A[m - 1] <= A[m] && A[m] >= A[m + 1]) {
		return m;
	} else if (A[m - 1] > A[m]) {
		return peak1(A, c, m - 1);
	} else if (A[m] < A[m + 1]) {
		return peak1(A, m + 1, d);
	}
}

function doPeak(array) {
	var newArr = [];
	for (var i in array) {
		newArr[i] = peak1(array, opt.i, opt.j);
	}
	return newArr;
}

function ms(array) {
	var newArr = [];
	var m = math.mean(array);
	var s = math.std(array);
	for (var i in array) {
		if (array[i] - m > 2 * s) {
			newArr[i] = array[i];
		} else {
			newArr[i] = array[i] / 2;
		}
	}
	return newArr;
}

/*function powTransform(array) {
	var newArr = array.map(function(v) {
		return Math.pow(v = v / 255, 1 - v) * 255
	});

	return newArr;
}*/

function powTransform(array) {
	var newArr = array.map(function(v) {
		var dv = v / 255
		return Math.pow(dv, (1 - dv) * normalize(v, math.max(array), 0, 1, 2)) * 255
	});

	return newArr;
}

function normalize(value, max, min, dmax, dmin) {
	return (dmax - dmin) / (max - min) * (value - max) + dmax
}

var base = Math.pow(2, 1 / 3);

function spike(array) {
	var newArr = []
	newArr = array.map(function(v) {
		var _v = normalize(v, 255, 0, 1, 0);
		return getValFromX(_v, 30, 0);
	});
	return newArr;
}

function compute(x) {
	return Math.pow(base, x);
}

function getValFromX(x, max, min) {
	return compute(x * (max - min) + min);
}

var spiral = [11, 21, 31, 41, 51, 61, 71, 81, 82, 83, 84, 85, 86, 87, 88, 78, 68, 58, 48, 38, 28, 18, 17, 16, 15, 14, 13, 12, 22, 32, 42, 52, 62, 72, 73, 74, 75, 76, 77, 67, 57, 47, 37, 27, 26, 25, 24,
	23, 33, 43, 53, 63, 64, 65, 66, 56, 46, 36, 35, 34, 44, 54, 55, 45];


function clearPad() {
	for (var i = 0; i < 100; i++) {
		output.stopNote(i, "all");
	}
}

var l = [0, 0, 0, 17, 18, 19, 13, 14, 15, 9, 10, 11, 5, 6, 7]


function handlePad(array) {
	for (var i = 0; i < 63; i += 9) {
		var avg = math.max(Array.from(array.slice(i, i + 9)))
		var _i = normalize(avg, 255, 0, l.length - 1, 0);
		var li = l[Math.floor(_i)];
		var __i = normalize(li, 127, 0, 1, 0);
		for (var j = 0; j < 8; j++) {
			output.playNote(Math.floor(normalize(i, 63, 0, 18, 11)) + (j * 10), "all", {
				velocity: __i
			});
		}
	}
}

function allMax(array) {
	var newArr = array.map(v => {
		return math.max(array);

	});
	return newArr;
}

// function handlePad(array) {
// 	for (var i = 0; i < 63; i += 2) {
// 		var _i = normalize(array[i], 255, 0, l.length - 1, 0);
// 		var li = l[Math.floor(_i)];
// 		var __i = normalize(li, 127, 0, 1, 0);
// 		output.playNote(spiral[Math.floor(i)], "all", {
// 			velocity: __i
// 		});
// 	}
// }

// function handlePad(array) {
// 	for (var i = 0; i < 63; i += 6) {
// 		var avg = math.mean(Array.from(array.slice(i, i + 6)));
// 		var _i = normalize(avg, 255, 0, l.length - 1, 0);
// 		var li = l[Math.floor(_i)];
// 		var velColor = normalize(li, 127, 0, 1, 0);
// 		var a = normalize(avg, 255, 0, 8, 1);
// 		var n = normalize(i, 63, 0, 8, 1);
//
// 		output.playNote(parseInt(new String(Math.floor(n)) + new String(Math.floor(a)), 10), "all", {
// 			velocity: velColor
// 		});
// 	}
//
// }
