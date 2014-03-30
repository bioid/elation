/** 
 * Grid UI element
 *
 * @class grid
 * @augments elation.ui.list
 * @memberof elation.ui
 * @alias elation.ui.grid
 *
 * @param {object}    args
 * @param {string}    args.tag
 * @param {string}    args.classname
 * @param {string}    args.title
 * @param {boolean}   args.draggable
 * @param {boolean}   args.hidden
 * @param {string}    args.orientation
 * @param {string}    args.sortbydefault
 * @param {array}     args.items
 * @param {object}    args.attrs
 * @param {elation.container.simple} args.itemcontainer
 */
elation.component.add('ui.grid', function() {
  this.defaultcontainer = {tag: 'ul', classname: 'ui_grid'};
}, elation.ui.list);

