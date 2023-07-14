<template lang="pug">
.pay-table
  .pagination(v-if="meta")
    .left “共搜尋到 {{ meta.totalSize }} 筆資料“
      slot(name="prefix")
    .right
      span 每頁顯示
      PaySelect(
        placeholder="測試"
        style="display:inline-block"
        v-model="meta.pageSize"
        :options="options"
        :settings="settingsSize"
        :custom-style=`{
          'width': '72px',
          'margin': '0 8px'
        }`
        @changeValue="changePageSize"
      )
      span 筆資料
      slot(name="suffix")
  table
    thead(:class="{ 'scroll-thead': hasScroll }")
      tr
        th(
          v-for="col in thead"
          :style="col.style"
          :class="{ 'money': col.money }"
        )
          slot(
            v-if="col.slotName"
            :name="col.slotName"
          )
          | {{ col.name }}
    tbody(
      :style="{ 'max-height': scrollMaxHeightValue }"
      :class="{ 'scroll-tbody': hasScroll }"
    )
      tr(v-if="!tbody.length")
        td.table-no-result(:colspan="thead.length")
          small 查無資料
      template(v-else)
        template(v-for="(row, index) in tbody")
          tr(:class=`[{
              'bg-white': index % 2 === 0,
              'bg-[#f2f2f2]': index % 2 === 1,
              'pointer': hasTrClick || hasToggle
            }]`
            @click.prevent="trClickFn(row, index)"
          )
            td(
              v-for="col in thead"
              :class="{ 'money': col.money }"
              style="background-color: inherit;"
            )
              slot(
                v-if="col.slotBodyName",
                :name="col.slotBodyName",
                :text="row[col.key]",
                :row-data="row",
                :index="index"
              )
              a(v-else-if="col.isArrow" href="#")
                PayIcon(
                  class="w-[14px] h-[14px]"
                  icon-name="ic-next"
                  :class="{ 'rotate-arrow': active === index }"
                )
              p(v-else) {{ showData(row, col) }}
          tr.detail(
            v-if="hasToggle && active === index"
            :class=`[{
              'bg-white': index % 2 === 0,
              'bg-[#f2f2f2]': index % 2 === 1,
              'pointer': hasToggle
            }]`
          )
            td(:colspan="thead.length")
              slot(
                name="detail"
                :row-data="row"
              )
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import PaySelect from '@/components/common/PaySelect.vue';

/**
   * @param {Object} meta 頁碼資料
   * {
   *   @param {Number} totalSize 總筆數
   *   @param {Number} pageSize 一頁顯示筆數
   * }
   * @param {Array} options 一頁顯示筆數選項
   * {
   *   @param {Number} code 選項值
   *   @param {String} label 選項顯示
   * }
   * @param {Object} thead table thead欄位定義
   * {
   *   @param {String} name 欄位顯示
   *   @param {String} key 欄位參數
   *   @param {Object} style 客製style
   *   @param {Object} slotName 客製thead slot名稱
   *   @param {Object} slotBodyName 客製tbody slot名稱
   *   @param {Boolean} money 是否轉換成金錢顯示格式
   * }
   * @param {Object} tbody table tbody資料列
   * @param {Object} hasToggle 點擊是否可展開
   * @param {Object} hasScroll 是否顯示y卷軸
   * @param {Object} scrollMaxHeight tbody顯示最大高度
   */
const props = defineProps({
  meta: {
    type: Object,
    required: false
  },
  options: Array,
  thead: {
    type: Array,
    required: true
  },
  tbody: {
    type: Array,
    required: true
  },
  hasTrClick: {
    type: Boolean,
    required: false,
    default: false
  },
  hasToggle: {
    type: Boolean,
    required: false,
    default: false
  },
  hasScroll: {
    type: Boolean,
    required: false,
    default: false
  },
  scrollMaxHeight: {
    type: String,
    required: false,
    default: ''
  }
});

const emit = defineEmits(['toggle']);

const settingsSize = {
  size: 'sm',
  searchable: false,
  clearable: false
};

const active = ref(null);

/**
   * 判斷tbody最大高度百分比
   * @returns {String} 最大高度百分比
   */
const scrollMaxHeightValue = computed(() => (props.hasScroll ? props.scrollMaxHeight : '100%'));

/**
   * @param {String} value 要轉換成金錢顯示格式的數值
   */
const setMoney = (value) => {
  const reg = /^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/;

  return String(value).replace(reg, (all, pre, groupOf3Digital) => pre + groupOf3Digital.replace(/\d{3}/g, ',$&'));
};

/** 資料顯示
 * @param {Object} item tbody資料列
 * @param {Object} col thead欄位
 */
const showData = (item, col) => {
  if (!col.money) return item[col.key] ? item[col.key] : '-';

  return item[col.key] ? `$${setMoney(item[col.key])}` : '-';
};

/** 展開tr
   * @param {Object} row tbody資料列
   * @param {Object} index tbody資料列索引
   */
const trClickFn = (row, index) => {
  if (!props.hasTrClick && !props.hasToggle) return;
  if (props.hasTrClick) {
    emit('trClick', row, index);
  }
  if (props.hasToggle) {
    if (active.value === index) {
      active.value = null;
      return;
    }
    active.value = index;
    emit('toggle', row, index);
  }
};

const changePageSize = ($event) => {
  emit('changePageSize', $event);
};
</script>

  <style lang="scss" scoped>
  .pay-table {
    box-shadow:0 3px 3px 0 rgba(0, 0, 0, 0.04);
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    background-color: #d4dfe7;
    padding: 6px 32px;
    .left {
      color: #363636;
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4b4b4b;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    thead {
      background-color: #7097b3;
      color: #fff;
      &.scroll-thead {
        display: table;
        width: 100%;
      }
      tr {
        box-shadow: inset 0 0 1px #4f718a;
        th {
          padding: 10px;
          text-align: center;
          font-size: 12px;
          &.money {
            text-align: right;
          }
        }
      }
    }
    tbody {
      letter-spacing: 0.75px;
      &.scroll-tbody {
        overflow-y: auto;
        display: block;
        width:100%;
        tr {
          display: table;
          width:100%;
        }
      }
      tr {
        &:not(.detail) {
          box-shadow: inset  0px 1px 0px #dbdbdb;
        }
        &:first-child {
          box-shadow: none;
        }
        &:hover {
          box-shadow: inset 0 0 0 1px #5789b1;
          background-color: #ebf5fc;
          color: #5789b1;
        }
        &.pointer {
          cursor: pointer;
        }
        td {
          color: #363636;
          height: 44px;
          padding: 0 10px;
          text-align: center;
          font-size: 14px;
          &.money {
            text-align: right;
          }
          &.table-no-result {
            padding: 13px;
            color: #8c8c8c;
            background-color: #fff;
          }
        }
      }
    }
  }

  .bg-white{
    background-color: #fff;
  }

  .bg-f2f2f2{
    background-color:#f2f2f2
  }

  .rotate-arrow{
    transform: rotate(90deg);
  }
  </style>
