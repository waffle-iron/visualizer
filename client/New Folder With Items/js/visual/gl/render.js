window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

(function animloop() {
	stats.begin();
	updateParticles();
	requestAnimFrame(animloop);
	renderer.render(scene, camera);
	stats.end();
})();
