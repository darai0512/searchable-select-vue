const defaultStyle = {
  div: {
    display: 'inline-block',
    position: 'relative',
  },
  input: {
    background: 'white',
    border: '1px solid #dce4e9',
    'font-size': '1.4rem',
    padding: '12px 20px 12px 12px',
  },
  ul: {
    position: 'absolute',
    'z-index': 1,
    left: 0,
    width: '100%',
    border: '1px solid #aaa',
    background: 'white',
    'box-sizing': 'border-box',
    margin: 0,
    padding: 0,
    'max-height': '200px',
    'overflow-x': 'auto',
    'overflow-y': 'scroll',
    'list-style': 'none',
    'white-space': 'nowrap',
  },
  li: {
    padding: '6px',
    cursor: 'pointer',
    'font-size': '1.4rem',
  },
  'li.pointed': {
    'background-color': '#5897fb',
    color: 'white',
  },
};
export default {
  name: 'SearchableSelect',
  template: `
<div :style="styler.div">
  <input tabindex="0"
         type="text"
         :disabled="disabled"
         :value="searchString"
         :placeholder="placeholder"
         :style="styler.input"
         @input="input"
         @compositionstart="isComposing = true"
         @compositionend="compositionEnd"
         @click="show"
         @focus="show"
         @blur="blur"
         @keyup.esc="close"
         @keydown.enter.prevent="enter"
         @keydown.up="prev"
         @keydown.down="next"
  />
  <ul :style="styler.ul" ref="ssUl" v-if="!disabled && showOptionsState">
    <li v-for="(option, index) in filteredOptions"
        :style="pointer === index ? styler['li.pointed'] : styler.li"
        :key="'ss-option-'+index"
        :value="option[optionValue]"
        @click.stop.prevent="select(option)"
        @mousedown="select(option)"
        @mouseenter="pointer = index"
    >
      {{ getText(option) }}
    </li>
  </ul>
</div>`,
  data() {
    return {
      isComposing: false,
      pointer: 0,
      searchString: '',
      showOptionsState: false,
      selectedState: false,
    };
  },
  created () {
    this.value2Text(this.value);
  },
  props: {
    allowDirectValue: {type: Boolean, default: false, required: false},
    caseInsensitive: {type: Boolean, default: true, required: false},
    disabled: {type: Boolean, default: false, required: false},
    options: {type: Array, default: [], required: true},
    optionText: {type: [String, Function], default: 'text', required: false},
    optionValue: {type: String, default: 'value', required: false},
    placeholder: {type: String, default: '', required: false},
    style: {type: Object, default: {}, required: false},
    value: {type: [String, Number, Boolean, Date], default: null, required: false},
  },
  computed: {
    _options() {
      return this.options.map((v) => {
        if (typeof v === 'string') return {[this.optionText]: v, [this.optionValue]: v};
        return v;
      });
    },
    filteredOptions() {
      this.pointer = 0;
      if (!this.searchString) return this._options;
      const s = this.caseInsensitive ? this.searchString.toLowerCase() : this.searchString;
      return this._options.filter(v => this.getText(v).toLowerCase().indexOf(s) > -1);
    },
    getText() {
      return typeof this.optionText === 'function' ? this.optionText : (v) => v[this.optionText];
    },
    styler() {
      const style = Object.assign({}, defaultStyle, this.style);
      if (this.style === null) {
        for (const selector of Object.keys(style)) style[selector] = null;
      } else {
        style['li.pointed'] = Object.assign({}, style.li, style['li.pointed']);
      }
      return style;
    },
  },
  methods: {
    blur() {
      if (this.selectedState) return this.close();
      const objOrUndef = this.filteredOptions.find(v => this.getText(v) === this.searchString);
      this.$emit('input', objOrUndef ? objOrUndef[this.optionValue] :
        (this.allowDirectValue ? this.searchString : null)
      );
      this.selectedState = !!objOrUndef;
      this.close();
    },
    close() {
      this.showOptionsState = false;
    },
    compositionEnd(e) {
      this.searchString = e.target.value;
      this.isComposing = false;
    },
    enter() {
      if (this.isComposing) return;
      const option = this.filteredOptions[this.pointer];
      return option ? this.select(option) : this.showOptionsState = false;
    },
    input(e) {
      if (this.isComposing) return;
      this.searchString = e.target.value;
    },
    next() {
      if (this.pointer >= this.filteredOptions.length - 1) return false;
      this.pointer += 1;
      this.scrollNext();
    },
    prev() {
      if (this.pointer < 1) return false;
      this.pointer -= 1;
      this.scrollPrev();
    },
    // todo use intersection observer
    scrollNext() {
      const {offsetHeight, children, scrollTop} = this.$refs.ssUl;
      const childHeight = children[0].getBoundingClientRect().height;
      if (offsetHeight + scrollTop < childHeight * (this.pointer + 1)) {
        this.$refs.ssUl.scrollTop += Math.ceil(childHeight); // todo use `children[this.pointer].offsetHeight)`
      }
    },
    scrollPrev() {
      const {children: [child], scrollTop} = this.$refs.ssUl;
      const childHeight = child.getBoundingClientRect().height;
      if (scrollTop > childHeight * this.pointer) {
        this.$refs.ssUl.scrollTop -= childHeight;
      }
    },
    show() {
      this.showOptionsState = true;
    },
    select(option) {
      this.$emit('input', option[this.optionValue]); // todo .lazy (change evnet)
      this.searchString = this.getText(option);
      this.selectedState = true;
      const unwatch = this.$watch('searchString', () => {
        this.selectedState = false;
        this.showOptionsState = true;
        unwatch(); // The other watch keeps ref'd
      });
      this.close();
    },
    value2Text(value) {
      if (value === null) {
        return this.searchString = '';
      }
      const objOrUndef = this._options.find(x => x[this.optionValue] === value);
      if (objOrUndef) {
        return this.searchString = this.getText(objOrUndef);
      }
    },
  },
  watch: {
    value: function(val) {
      this.value2Text(val);
    }
  },
};
