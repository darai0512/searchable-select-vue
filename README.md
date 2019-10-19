# How to Use

```
<searchable-select :options="arr"
                   v-model="value"
                   class="original-style"
</searchable-select>
```

in `<script>`

```
import SearchableSelect from 'searchable-select-vue';
// Note that it is the runtime-only build of Vue.

// if you use raw SFC, import the following one.
// import SearchableSelect from 'searchable-select-vue/SearchableSelect.vue';
```

## Props

|name|type|default|desc|
|---|---|---|---|
|options|Array|[]|(必須) 選択肢の配列. 要素はStringまたはObject|
|allowDirectValue|Boolean|false|選択肢にない、入力された値をvalueとして受け入れるか否か|
|caseInsensitive|Boolean| true|大文字小文字を区別するか否か|
|disabled|Boolean| false|inputフィールドをdisabledにするか否か|
|optionText|[String, Function]| 'text'|optionsの要素がObjectの場合の表示文字列のkey, または生成用Function|
|optionValue|String| 'value'|optionsの要素がObjectの場合のvalueのkey|
|placeholder|String| ''|inputフィールドのプレイスホルダー|
|styles|Object|{}|styleを上書きする。key=selector,value=CSSのオブジェクト(ex, `{input: {width:'100%'}}`)。nullを渡すとデフォルトのstyleを全て削除|
|value|[String, Number, Boolean, Date]|null|初期値(表示文字列に自動変換)|
