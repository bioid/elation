elation.component.add('ui.colorpicker', function() {
  this.init = function() {
    this.name = this.args.name;
    elation.html.addclass(this.container, 'ui_colorpicker');
    this.shown = false;
    this.label = this.container.innerHTML;
    this.color = this.args.color || '#ff0000';
    this.swatch = elation.html.create({tag: 'div', classname: 'ui_colorpicker_swatch'});
    this.swatch.style.backgroundColor = this.color;
    this.container.appendChild(this.swatch);
    this.input = elation.html.create({tag: 'input'});
    this.input.type = 'hidden';
    this.input.name = this.name;
    this.input.value = this.color;
    this.container.appendChild(this.input);
    elation.events.add(this.container, 'click', this);
  }
  this.initcanvas = function() {
    this.canvas = elation.html.create('canvas');
    this.canvas.width = 256;
    this.canvas.height = 128;
    var ctx = this.ctx = this.canvas.getContext('2d');
      
    // based on http://seesparkbox.com/foundry/how_i_built_a_canvas_color_picker
    var gradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
    // Create color gradient
    gradient.addColorStop(0,    "rgb(255,   0,   0)");
    gradient.addColorStop(0.15, "rgb(255,   0, 255)");
    gradient.addColorStop(0.33, "rgb(0,     0, 255)");
    gradient.addColorStop(0.49, "rgb(0,   255, 255)");
    gradient.addColorStop(0.67, "rgb(0,   255,   0)");
    gradient.addColorStop(0.84, "rgb(255, 255,   0)");
    gradient.addColorStop(1,    "rgb(255,   0,   0)");

    // Apply gradient to canvas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Create semi transparent gradient (white -> trans. -> black)
    gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
    gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");

    // Apply gradient to canvas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  this.showpicker = function() {
    if (!this.canvas) {
      this.initcanvas();
      elation.events.add(this.canvas, 'mousedown,mousemove,mouseup', this);
    }
    this.container.appendChild(this.canvas);
    this.shown = true;
  }
  this.hidepicker = function() {
    if (this.canvas.parentNode == this.container) {
      this.container.removeChild(this.canvas);
    }
    this.shown = false;
    this.swatch.style.backgroundColor = this.input.value;
  }
  this.getcolor = function(ev) {
    var canvaspos = elation.html.position(this.canvas);
    var pos = [ev.clientX - canvaspos[0], ev.clientY - canvaspos[1]];
    var imagedata = this.ctx.getImageData(pos[0], pos[1], 1, 1);
    var color = {
      r: imagedata.data[0],
      g: imagedata.data[1],
      b: imagedata.data[2]
    };
    color.hex = "#" + (color.r < 16 ? "0" : "") + color.r.toString(16) 
                    + (color.g < 16 ? "0" : "") + color.g.toString(16) 
                    + (color.b < 16 ? "0" : "") + color.b.toString(16);
    return color;
  }
  this.click = function(ev) {
    if (!this.shown) {
      this.showpicker();
    } else{
      this.hidepicker();
    }
  }
  this.mousedown = function(ev) {
    this.picking = true;
    var color = this.getcolor(ev);
    this.swatch.style.backgroundColor = color.hex;
    elation.events.fire({type: 'ui_colorpicker_preview', element: this, data: color});
    ev.preventDefault();
  }
  this.mousemove = function(ev) {
    if (this.picking) {
      var color = this.getcolor(ev);
      this.swatch.style.backgroundColor = color.hex;
      elation.events.fire({type: 'ui_colorpicker_preview', element: this, data: color});
      ev.preventDefault();
    }
  }
  this.mouseup = function(ev) {
    if (this.picking) {
      this.picking = false;
      var color = this.getcolor(ev);
      this.swatch.style.backgroundColor = color.hex;
      this.input.value = color.hex;
      elation.events.fire({type: 'ui_colorpicker_select', element: this, data: color});
    }
  }
});
