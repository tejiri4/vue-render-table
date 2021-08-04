'use strict';

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  props: {
    data: {
      type: Array
    },
    headers: {
      type: Array
    },
    itemsPerRow: {
      type: Number,
      default: 5
    }
  },
  data: function data() {
    return {
      filteredData: [],
      totalItems: 0,
      noOfPageToDisplay: 0,
      totalNoOfPage: 0,
      paginationItemStartIndex: 0,
      currentPage: 1,
      maxNoOfPage: 6,
      iterablePage: 0
    };
  },
  created: function created() {
    this.filteredData = this.data;

    if (this.filteredData && this.filteredData.length) {
      var totalNoOfPage = Math.ceil(this.filteredData.length / this.itemsPerRow);
      this.totalNoOfPage = totalNoOfPage;
      this.noOfPageToDisplay = totalNoOfPage > this.maxNoOfPage ? this.maxNoOfPage : totalNoOfPage;
      this.totalItems = this.filteredData.length;
      this.iterablePage = totalNoOfPage > this.maxNoOfPage ? this.maxNoOfPage : totalNoOfPage;
    }
  },
  computed: {
    getData: function getData() {
      return this.filteredData.slice((this.currentPage - 1) * this.itemsPerRow, this.itemsPerRow * this.currentPage);
    }
  },
  watch: {
    filteredData: function filteredData(data) {
      if (data && data.length) {
        var totalNoOfPage = Math.ceil(data.length / this.itemsPerRow);
        this.iterablePage = totalNoOfPage > this.maxNoOfPage ? this.maxNoOfPage : totalNoOfPage;
      }
    }
  },
  methods: {
    handlePaginationClick: function handlePaginationClick(page) {
      if (page > this.currentPage && page == this.maxNoOfPage + this.paginationItemStartIndex && this.totalNoOfPage > page) {
        this.noOfPageToDisplay = this.totalNoOfPage > this.noOfPageToDisplay + 3 ? this.noOfPageToDisplay + 3 : this.totalNoOfPage;
        this.paginationItemStartIndex = this.paginationItemStartIndex + 2;
      }

      if (page < this.maxNoOfPage + this.paginationItemStartIndex && page === this.paginationItemStartIndex + 1 && this.paginationItemStartIndex - 1 >= 0) {
        this.paginationItemStartIndex = this.paginationItemStartIndex - 1;
      }

      this.currentPage = page;
    },
    handleSearch: function handleSearch(e) {
      var _this = this;

      this.debounce(e.target.value, function (keyword) {
        _this.filteredData = _this.data.filter(function (rowData) {
          var isFound = false;

          if (rowData) {
            Object.values(rowData).map(function (rowDataValues) {
              if (rowDataValues && "".concat(rowDataValues).toLowerCase().indexOf(keyword.toLowerCase()) !== -1) isFound = true;
            });
          }

          if (isFound) return rowData;
        });
        _this.currentPage = 1;
      });
    },
    debounce: function debounce(value, callback) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        callback(value);
      }, 300);
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.totalItems)?_c('div',{staticClass:"vue-table"},[_c('div',[_c('input',{staticClass:"input",attrs:{"placeholder":"Search..."},on:{"input":_vm.handleSearch}})]),_vm._v(" "),(_vm.filteredData.length)?_c('table',{staticClass:"fl-table"},[_c('tr',_vm._l((_vm.headers),function(header){return _c('th',{key:header.dataIndex},[_vm._v("\n        "+_vm._s(header.title || "")+"\n      ")])}),0),_vm._v(" "),_vm._l((_vm.getData),function(row){return _c('tr',{key:row.id},_vm._l((_vm.headers),function(header){return _c('td',{key:header.dataIndex},[_vm._v("\n        "+_vm._s(row[header.dataIndex] || "")+"\n      ")])}),0)})],2):_vm._e(),_vm._v(" "),(!_vm.filteredData.length)?_c('div',{staticClass:"no-data"},[_vm._v("No Data")]):_vm._e(),_vm._v(" "),(_vm.filteredData.length && _vm.itemsPerRow < _vm.totalItems && _vm.iterablePage > 1)?_c('div',{staticClass:"pagination"},_vm._l((_vm.iterablePage),function(i){return _c('div',{key:i},[(i + _vm.paginationItemStartIndex <= _vm.totalItems)?_c('button',{staticClass:"pagination_item",on:{"click":function () { return _vm.handlePaginationClick(i + _vm.paginationItemStartIndex); }}},[_vm._v("\n        "+_vm._s(i + _vm.paginationItemStartIndex)+"\n      ")]):_vm._e()])}),0):_vm._e()]):_vm._e()};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-c5ed476a_0", { source: ".vue-table[data-v-c5ed476a]{display:flex;justify-content:center;align-items:center;flex-direction:column;padding:10px 0}.no-data[data-v-c5ed476a]{margin:10px}.input[data-v-c5ed476a]{outline:0;padding:7px 15px;border-radius:5px;border:1px solid gray}.table-wrapper[data-v-c5ed476a]{margin:10px 70px 70px;box-shadow:0 35px 50px rgba(0,0,0,.2)}.fl-table[data-v-c5ed476a]{border-radius:5px;font-size:12px;font-weight:400;border:none;border-collapse:collapse;width:100%;max-width:100%;white-space:nowrap;background-color:#fff;margin:30px}.fl-table td[data-v-c5ed476a],.fl-table th[data-v-c5ed476a]{text-align:center;padding:8px}.fl-table td[data-v-c5ed476a]{border-right:1px solid #f8f8f8;font-size:12px}.fl-table thead th[data-v-c5ed476a]{color:#fff;background:#4fc3a1}.fl-table thead th[data-v-c5ed476a]:nth-child(odd){color:#fff;background:#324960}.fl-table tr[data-v-c5ed476a]:nth-child(even){background:#f8f8f8}.pagination[data-v-c5ed476a]{display:flex;justify-content:center;align-items:center}.pagination_item[data-v-c5ed476a]{margin:5px 3px}", map: undefined, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-c5ed476a";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var VueTable = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

var index = {
  install: function install(Vue, options) {
    Vue.component("vue-table", VueTable);
  }
};

module.exports = index;
