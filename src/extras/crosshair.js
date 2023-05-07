/**
 * @license
 * Copyright 2015 Petr Shevtsov (petr.shevtsov@gmail.com)
 * MIT-licenced: https://opensource.org/licenses/MIT
 */

/* loader wrapper to allow browser use and ES6 imports */
(function _extras_crosshair_wrapper() {
'use strict';
var Dygraph;
if (window.Dygraph) {
  Dygraph = window.Dygraph;
} else if (typeof(module) !== 'undefined') {
  Dygraph = require('../dygraph');
  if (typeof(Dygraph.NAME) === 'undefined' && typeof(Dygraph.default) !== 'undefined')
    Dygraph = Dygraph.default;
}
/* end of loader wrapper header */

Dygraph.Plugins.Crosshair = (function _extras_crosshair_closure() {
  "use strict";

  /**
   * Creates the crosshair
   *
   * @constructor
   */

  var crosshair = function crosshair(opt_options) {
    this.canvas_ = document.createElement("canvas");
    this.updateCanvasSize(0, 0)
    opt_options = opt_options || {};
    this.direction_ = opt_options.direction || null;
    this.strokeStyle_ = opt_options.strokeStyle || "rgba(0, 0, 0, 0.3)";
  };

  crosshair.prototype.updateCanvasSize = function updateCanvasSize(width, height) {
    this.canvas_.width = width
    this.canvas_.height = height
    this.canvas_.style.width = width.toString(10) + 'px'    // for IE
    this.canvas_.style.height = height.toString(10) + 'px'  // for IE
  }

  crosshair.prototype.toString = function toString() {
    return "Crosshair Plugin";
  };

  /**
   * @param {Dygraph} g Graph instance.
   * @return {object.<string, function(ev)>} Mapping of event names to callbacks.
   */
  crosshair.prototype.activate = function activate(g) {
    g.graphDiv.appendChild(this.canvas_);

    return {
      select: this.select,
      deselect: this.deselect
    };
  };

  crosshair.prototype.select = function select(e) {
    if (this.direction_ === null) {
      return;
    }

    var width = e.dygraph.width_;
    var height = e.dygraph.height_;
    this.updateCanvasSize(width, height)

    var ctx = this.canvas_.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = this.strokeStyle_;
    ctx.beginPath();

    var canvasx = Math.floor(e.dygraph.selPoints_[0].canvasx) + 0.5; // crisper rendering

    if (this.direction_ === "vertical" || this.direction_ === "both") {
      ctx.moveTo(canvasx, 0);
      ctx.lineTo(canvasx, height);
    }

    if (this.direction_ === "horizontal" || this.direction_ === "both") {
      for (var i = 0; i < e.dygraph.selPoints_.length; i++) {
        var canvasy = Math.floor(e.dygraph.selPoints_[i].canvasy) + 0.5; // crisper rendering
        ctx.moveTo(0, canvasy);
        ctx.lineTo(width, canvasy);
      }
    }

    ctx.stroke();
    ctx.closePath();
  };

  crosshair.prototype.deselect = function deselect(e) {
    var ctx = this.canvas_.getContext("2d");
    ctx.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
  };

  crosshair.prototype.destroy = function destroy() {
    this.canvas_ = null;
  };

  return crosshair;
})();

/* loader wrapper */
Dygraph._require.add('dygraphs/src/extras/crosshair.js', /* exports */ {});
})();
