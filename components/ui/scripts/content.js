/** 
 * Simple content UI element
 *
 * @class content
 * @augments elation.ui.base
 * @memberof elation.ui
 *
 * @param {object} args
 * @param {string} args.content
 */
elation.require("ui.base", function() {
  elation.component.add("ui.content", function() {
    this.defaultcontainer = {tag: 'div', classname: 'ui_content'};

    this.content = '';

    this.init = function() {
      elation.ui.content.extendclass.init.call(this);
      if (this.args.content) {
        this.setcontent(this.args.content);
      }
    }

    this.setcontent = function(content) {
      this.content = content;
      this.refresh();
    }

    this.render = function() {
      elation.html.setContent(this, this.content);
    }
  }, elation.ui.base);
});

