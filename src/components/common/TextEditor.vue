<template lang="pug">
.flex.custom
  div(:class="{'error': error}")
    Editor(
      v-model="val"
      ref="editor"
      :init="init"
      :id="id"
      @input="emit('input', val)"
    )
</template>

<script setup>
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/models/dom/model.js';
import 'tinymce/themes/silver';
import 'tinymce/plugins/lists/plugin';
import { reactive, onMounted, ref, computed } from 'vue';

/**
 * @param { Boolean } error 是否顯示錯誤紅框
 * @param { String } id 編輯器id(多個時識別)
 * @param { String } modelValue 綁定的值
 * @param { String } placeholder 無資料時顯示的文字
 * @param { Number } maxChars 最大字數上限
 * @param { Boolean } isIntoView 是否要捲動到編輯器位置
 * @param { Boolean } canDrag 是否可調整大小
 */

const editor = ref(null);

const props = defineProps({
  error: {
    type: Boolean,
    default: false
  },
  id: String,
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  maxChars: {
    type: Number,
    default: 1000
  },
  isIntoView: {
    type: Boolean,
    default: false
  },
  canDrag: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'input']);

const val = computed({
  get () {
    return props.modelValue;
  },
  set (newVal) {
    emit('update:modelValue', newVal);
  }
});
const placeholderText = ref(props.placeholder);

const tinymceEditor = reactive(tinymce);

const countCharacters = (id) => {
  // 計算編輯器字數
  const body = tinymceEditor.get(id).getBody();
  const content = tinymceEditor.trim(body.innerText || body.textContent);

  return content.length;
};
const init = reactive({
  paste_preprocess: function (plugin, args) {
    // replace copied text with empty string
    // args.content = ''
  },
  paste_data_images: false, // 不能複製圖片貼上
  setup: function (editor) {
    editor.on('init', (e) => {
      editor.execCommand('FontSize', false, '16px');// 預設16px
      if (!props.isIntoView) {
        window.scrollTo(0, 0);
      }
    });
    editor.on('keydown', (args) => {
      if (editor.getContent() === '') {
        if (args.key === 'Backspace') {
          editor.execCommand('FontSize', false, '16px');
          args.preventDefault();
          return false;
        }
      }
      const body = tinymceEditor.get(props.id).getBody();// 沒有內容時顯示placeholder
      const content = tinymceEditor.trim(body.innerText || body.textContent);
      if (content) {
        placeholderText.value = '';
      } else {
        placeholderText.value = props.placeholder;
      }
      const tinymax = props.maxChars;
      const tinylen = countCharacters(props.id);
      const allowAction = [8, 46, 37, 38, 39, 40];
      if (tinylen >= tinymax && !allowAction.includes(args.keyCode) && !args.ctrlKey && !args.metaKey) {
        args.preventDefault();
        return false;
      }
    });
  },
  resize: !!props.canDrag,
  placeholder: placeholderText.value,
  base_url: './tinymce',
  language_url: './tinymce/langs/zh_TW.js', // 中文化語言包路徑
  language: 'zh_TW',
  line_height_formats: '1.0 1.15 1.5 2.0',
  height: 126, // 编辑器高度
  width: 1160,
  branding: false, // 是否禁用“Powered by TinyMCE”
  menubar: false, // 顶部菜单栏显示,
  advlist_bullet_styles: 'default,circle',
  advlist_number_styles: 'default,lower-roman,trad-chinese-informal',
  advlist_item_styles: 'default',
  font_size_formats: '10px 12px 14px 16px 18px',
  font_formats: '思源體=Noto Sans TC,sans-serif;',
  toolbar_sticky: true,
  paste_as_text: true,
  plugins: ['paste', 'link', 'lists', 'advlist'],
  toolbar: 'fontsize lineheight bullist numlist forecolor backcolor bold italic underline removeformat styles toggleitem',
  toolbar_mode: 'floating',
  style_formats_merge: false,
  style_formats: [
    { title: '置左對齊', format: 'alignleft' },
    { title: '置中對齊', format: 'aligncenter' },
    { title: '置右對齊', format: 'alignright' }
  ],
  content_style: `.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {font-size:14px;}
  .mce-content-body[data-mce-placeholder]{margin:12px;}`
});

onMounted(() => {
  tinymceEditor.init({
  });
});

</script>

<style lang="scss" scoped>
.error{
  border: 1px solid #eb5a2c;
}
</style>
