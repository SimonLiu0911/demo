<template lang="pug">
.pay-table
  table
    thead
      tr
        th(
          v-for="(col, idx) in thead"
          :key="idx"
          :style="col.style"
          :class="{ 'money': col.money }"
        )
          slot(
            v-if="col.slotName"
            :name="col.slotName"
          )
          | {{ col.name }}
    tbody
      tr(
        v-for="(row, index) in tbody"
        :key="index"
      )
        td(
          v-for="(col, idx) in thead"
          :key="idx"
          :style="col.style"
          :class="{ 'money': col.money }"
        )
          slot(
            v-if="col.slotBodyName"
            :name="col.slotBodyName"
            :text="row[col.key]"
            :row-data="row"
            :index="index"
          )
          p(v-else) {{ showData(row, col) }}
</template>

<script>
export default {
  name: 'PayTransparentTable',
  props: {
    thead: {
      type: Array,
      required: true
    },
    tbody: {
      type: Array,
      required: true
    }
  },
  methods: {
    setMoney (value) {
      const reg = /^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/;

      return String(value).replace(reg, (all, pre, groupOf3Digital) => pre + groupOf3Digital.replace(/\d{3}/g, ',$&'));
    },
    showData (item, col) {
      if (!col.money) {
        return item[col.key] ? item[col.key] : '';
      }
      return item[col.key] ? `$${this.setMoney(item[col.key])}` : '-';
    }
  }
};
</script>

<style lang="scss" scoped>
.pay-table {
  box-shadow: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  thead {
    background-color: transparent;
    color: #363636;
    tr {
      border-bottom: 1px solid #dbdbdb;
      th {
        padding: 10px;
        text-align: center;
        font-weight: 500;
        &.money {
          text-align: right;
        }
      }
    }
  }
  tbody {
    color: #666666;
    letter-spacing: 0.75px;
    tr {
      box-shadow: inset  0px 1px 0px #dbdbdb;
      background-color: transparent;
      &:first-child {
        box-shadow: none;
      }
      td {
        height: 44px;
        padding: 0 10px;
        text-align: center;
        &.money {
          text-align: right;
        }
      }
    }
  }
}
</style>
