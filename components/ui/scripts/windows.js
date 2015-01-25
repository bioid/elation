elation.require(['ui.base'], function() {
  elation.requireCSS('ui.window2');
	elation.component.add("ui.window2", function() {
    this.defaultcontainer = { tag: 'div', classname: 'ui_window' };
		this.defaults = {
			content: '',				// (String|Component|HTMLElement) 
			parent: false,				// (Component|Element)
			append: false,				// (Component|Element) append.appendChild(window)
			before: false,				// (Component|Element) append.insertBefore(window, before)
			title: false,					// (String) Window title, requires titlebar, defaults to window name
			titlebar: false,			// (Boolean)
			btnClose: false, 			// (Boolean)
			btnMaximize: false,		// (Boolean)
			btnMinimize: false,		// (Boolean)
			btnResize: false,			// (Boolean)
			rendering: 'center',	// (String) auto, absolute, fixed, center, css
			bounds: false,				// (String|Component|HTMLElement) none, window, object
			resizable: false,			// (Boolean)
			moveable: false, 			// (Boolean)
			lightbox: false,			// (Boolean)
			animation: 'expand',	// (String) slide, sweep, roll, explode, fade, none
			transition: false,		// (String) Overwrite css transition with a js one
			align: 'center',			// (String) top, left, right, bottom, center, auto
			margin: 20,						// (Integer) pixels to pad alignment
			tail: false,					// (Boolean)
			tail_anchor: false,		// (Component|Element) default = parent
			show_callback: false, // (Function) Executes on .show()
			hide_callback: false,	// (Function) Executes on .hide()
			event: 'click'				// (String) If set, <event> on <parent> will .toggle() window
		};

		this.init = function() {
			var args = this.args;

			console.log('!!! Instantiate Window', name, container, this);

			if (args.parent)
				this.parent = elation.utils.getContainerElement(args.parent);

			if (args.moveable)
				this.moveable = elation.ui.moveable(name, this, { parent: this, handle: this.elements.titlebar });

			if (args.resizable)
				this.resizable = elation.ui.resizable(name, null, { parent: this });

			if (args.lightbox)
				this.lightbox = elation.ui.lightbox(name, null, { parent: this });

			if (args.tail)
				this.tail = elation.ui._window.tail(name, null, { parent: this });

			if (elation.utils.isString(args.title) || 
					elation.utils.isTrue(args.btnClose) || 
					elation.utils.isTrue(args.btnMaximize) || 
					elation.utils.isTrue(args.btnMinimize) || 
					elation.utils.isTrue(args.btnResize))
				args.titlebar = true;

			if (args.titlebar)
				this.titlebar = elation.ui._window.titlebar(name, null, { parent: this });

			if (args.align != 'none')
				this.alignment = elation.ui._window.alignment(name, this.container, this.args);
			
			this.rendering = elation.ui._window[args.rendering](name, this.container, this.args);

			elation.events.add(this.container, 'mousedown', this);
      this.focus();
		}

		this.setContent = function(content) {
			var content = content || this.args.content;

			this.container.innerHTML = '';
			elation.html.setContent(this, this.titlebar, true);
			elation.html.setContent(this, this.tail, true);
			this.content_container = elation.html.create({
				tag:'div',
				classname:'ui_window_content',
				append:this.container
			});
			elation.html.setContent(this.content_container, content, true);
		}

		this.open = function(content) {
			console.log('!!! window open', content, this);
			this.setContent(content);

			this.show();
      this.visible = true;
      this.refresh();

			elation.events.fire('window_show', this);
		}

		this.close = function() {
			console.log('!!! window close', this);
			this.hide();
      this.visible = false;

			elation.events.fire('window_hide', this);
		}

    this.focus = function() {
      if (!this.active) {
        this.active = true;
        elation.html.addclass(this.container, 'state_active');
        elation.events.fire({type: 'focus', element: this});
      }
    }

    this.blur = function() {
      if (this.active) {
        this.active = false;
        elation.html.removeclass(this.container, 'state_active');
        elation.events.fire({type: 'blur', element: this});
      }
    }

    this.mousedown = function(ev) {
      this.focus();
    }

		this.render = function() {
			var dc = elation.html.dimensions(this.container),
					dp = elation.html.dimensions(this.args.parent),
					dw = elation.html.dimensions(window);

			dc = this.rendering.position(dc, dp, dw);

			if (this.args.align != 'none')
				this.alignment.position(dc, dp, dw);
		}
	}, elation.ui.base);

	elation.component.add("ui._window.titlebar", function() {
    this.defaultcontainer = { tag: 'div', classname: 'ui_window_titlebar' };
    this.init = function() {
			console.log('!!! Window Titlebar', name, container, this);
			this.labels = {
        minimize: '_',
        maximize: '□',
        restore: '₪',
        close: 'x'
      };

    	var args = this.args.parent.args, 
    			create = elation.html.create,
      		buttons = {};

    	if (elation.utils.isString(args.title))
    		create({ tag: 'span', classname: 'ui_window_titlebar_span', append: this, content: args.title });

    	for (var key in this.labels) {
    		var button = key[0].toUpperCase() + key.slice(1, key.length);

    		if (elation.utils.isTrue(args['btn'+button]) && key != 'restore') {
    			buttons[key] = {
    				label: this.labels[key],
    				classname: 'ui_window_controls_'+key,
    				events: { click: elation.bind(this, this[key]) }
    			};
    		}
    	}

      this.controls = elation.ui.buttonbar(null, elation.html.create({classname: 'ui_window_controls'}), {
        buttons: buttons,
        append: this
      });

      elation.html.addclass(this.container, 'ui_window_withcontrols');

      if (this.args.resizable !== false) {
        this.resizer = elation.html.create({tag: 'div', classname: 'ui_window_resizer', append: this.args.parent});
      }
    }

    this.maximize = function(event) {};
    this.minimize = function(event) {};
    this.close = function(event) { console.log('close', event, this); this.args.parent.close(); };
	});

	elation.component.add("ui.lightbox", function() {
		this.init = function() { console.log('ui._window.lightbox', this); }
	});

	elation.component.add("ui._window.absolute", function() {
		this.position = function(dc, dp, dw) {
			dc.y = this.args.parent ? dp.y : dw.h >> 1;
			dc.x = this.args.parent ? dp.x : dw.w >> 1;

      elation.html.css(this.container, {
      	position: 'absolute',
	      top: dc.y + 'px',
	      left: dc.x + 'px'
	    });

	    return dc;
		}
	});

	elation.component.add("ui._window.relative", function() {
		this.init = function() { console.log('ui._window.relative', this); }
	});

	elation.component.add("ui._window.fixed", function() {
		this.init = function() { console.log('ui._window.fixed', this); }
	});

	elation.component.add("ui._window.center", function() {
		this.position = function(dc) {
      elation.html.css(this.container, {
      	position: 'fixed',
	      top: '50%',
	      left: '50%'
	    });

	    return dc;
		}
	});

	elation.component.add("ui._window.css", function() {
		this.init = function() { console.log('ui._window.css', this); }
	});

	elation.component.add("ui._window.alignment", function() {
		this.position = function(dc, dp, dw) {
			var top = 0, left = 0;

			switch (this.args.align) {
				case 'top':
					top = -dc.h - this.args.margin;
					left = (dp.w >> 1) - (dc.w >> 1);
					break;
				case 'bottom':
					top = dp.h + this.args.margin ;
					left = (dp.w >> 1) - (dc.w >> 1);
					break;
				case 'left':
					top = (dp.h >> 1) + -(dc.h >> 1);
					left = -dc.w - this.args.margin;
					break;
				case 'right':
					top = (dp.h >> 1) + -(dc.h >> 1);
					left = dp.w + this.args.margin;
					break;
				default:
					top = -(dc.h >> 1);
					left = -(dc.w >> 1);
			}

      elation.html.css(this.container, {
	      marginTop: top + 'px',
	      marginLeft: left + 'px'
	    });
		}
	});

	elation.component.add("ui.dialog", function() {
		this.defaults = {
			rendering: 'center',
			align: 'center',
			btnClose: true,
			lightbox: true
		};
		this.init = function() {
			console.log('!!! dialog', name, [container], this);
      elation.ui.dialog.extendclass.init.call(this);
		}
	}, elation.ui.window2);

	elation.component.add("ui.example_dialog", function() {
    this.defaultcontainer = { tag: 'div', classname: 'ui_example_dialog' };

		this.init = function() {
			var parent = elation.utils.arrayget(this.args, 'parent.args.container');
			var args = elation.utils.arrayget(this.args, 'parent.args.args');

			this.container.innerHTML = 'This is a test';

			this.window = elation.ui.dialog(args.name, null, {
				append: document.body,
				parent: parent,
				content: this.container,
				title: args.name
			})

			console.log('!!! example_dialog', name, parent, args, this.args);
		}
	}, elation.ui.base);

	elation.component.add("ui.infobox", function() {
		this.defaults = {
			rendering: 'absolute',
			title: false
		};
		this.init = function() {
			console.log('!!! infobox', name, [container], this);
      elation.ui.dialog.extendclass.init.call(this);
		}
	}, elation.ui.window2);

	elation.component.add("ui.example_infobox", function() {
    this.defaultcontainer = { tag: 'div', classname: 'ui_example_infobox' };

		this.init = function() {
			var parent = elation.utils.arrayget(this.args, 'parent.args.container');
			var args = elation.utils.arrayget(this.args, 'parent.args.args');
			
			this.container.innerHTML = 'This is a test<br><br>of an infobox!';

			this.window = elation.ui.infobox(args.name, null, {
				append: document.body,
				parent: parent,
				content: this.container,
				align: 'right'
			})

			console.log('!!! example_infobox', name, parent, args, this.args);
		}
	}, elation.ui.base);
});