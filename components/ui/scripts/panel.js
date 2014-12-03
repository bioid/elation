/** 
 * Panel layout UI element
 *
 * @class panel
 * @augments elation.ui.base
 * @memberof elation.ui
 *
 * @param {object} args
 * @param {string} args.classname
 * @param {string} args.orientation
 */
elation.require(["ui.base", "ui.content"], function() {
  elation.component.add("ui.panel", function() {
    this.defaultcontainer = {tag: 'div', classname: 'ui_panel'};

    this.init = function() {
      this.items = [];
      this.orientation = this.args.orientation || 'vertical';

      this.addclass('ui_panel');
      this.addclass('orientation_' + this.orientation);
      if (this.args.classname) {
        this.addclass(this.args.classname);
      }
    }
    /**
     * Append a new component to this panel
     * @function add
     * @memberof elation.ui.panel#
     * @param {elation.component.base} component
     */
    this.add = function(component) {
      if (component) {
        if (elation.utils.isString(component)) {
          var panel = elation.ui.content({content: component, append: this});
          component = panel;
        } else {
          this.container.appendChild(component.container);
        }
        this.items.push(component);
        return component;
      } else {
        console.log('Error: invalid component passed in to ui.panel.add');
      }
      return false;
    }
    this.remove = function(component) {
      if (component.container && component.container.parentNode == this.container) {
        this.container.removeChild(component.container);
        var idx = this.items.indexOf(component);
        if (idx != -1) this.items.splice(idx, 1);
      }
    }
    this.clear = function() {
      while (this.items.length > 0) {
        this.remove(this.items[0]);
      }
    }
  }, elation.ui.base);
});
