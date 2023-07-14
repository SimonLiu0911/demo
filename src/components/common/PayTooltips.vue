<template lang="pug">
.tooltip.pay-tooltips(
  ref="tooltip"
  class="tooltip rounded p-2 text-xs"
)
  //- .arrow(data-popper-arrow)
  slot(name="content")

.popcorn.flex.items-center(ref="popcorn")
  slot(name="toggle")

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { createPopper } from '@popperjs/core';
import { useEventListener } from '@vueuse/core';

const popperInstance = ref(null);
const popcorn = ref(null);
const tooltip = ref(null);

const show = () => {
  tooltip.value.setAttribute('data-show', '');
  popperInstance.value.update();
};

const hide = () => {
  tooltip.value.removeAttribute('data-show');
};

onMounted(() => {
  useEventListener(popcorn.value, 'mouseenter', show);
  useEventListener(popcorn.value, 'mouseleave', hide);

  popperInstance.value = createPopper(popcorn.value, tooltip.value, {
    placement: 'right-start', // top, right, bottom, left & start, end組合
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8]
        }
      }
    ]
  });
});
</script>

<style lang="scss" scoped>
  .pay-tooltips {
    background-color: rgba(236, 236, 236, 0.8);
    border-radius: 12px;
    border: solid 1px #fff;
    color: #333;
    display: inline-block;
    padding: 10px 16px;
    text-align: left;
  }
  .tooltip {
  display: none;
}

.tooltip[data-show] {
  display: block;
}

.popcorn {
  // display: inline-block;
}

.arrow,
.arrow::before {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
}

.arrow {
  visibility: hidden;
}

.arrow::before {
  visibility: visible;
  content: '';
  transform: rotate(45deg);
}

.tooltip[data-popper-placement^='top']>.arrow {
  bottom: -4px;
}

.tooltip[data-popper-placement^='bottom']>.arrow {
  top: -4px;
}

.tooltip[data-popper-placement^='left']>.arrow {
  right: -4px;
}

.tooltip[data-popper-placement^='right']>.arrow {
  left: -8px;
}
</style>
