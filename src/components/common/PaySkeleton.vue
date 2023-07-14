<template lang="pug">
.flex
  template(v-if="skeletonLoading")
    .card.loading
      .image
      .content
        h4
        .description

  template(v-else)
    .card
      .image
        img(src="https://media.istockphoto.com/id/664373658/zh/%E7%85%A7%E7%89%87/%E5%A4%96%E6%98%9F%E4%BA%BA.jpg?s=612x612&w=0&k=20&c=d7smcHRpHNHT078BKmNRhHYh4DNbIOa9rT7CZ8Z6dg8=")
      .content
        h4 CodingStartup
        .description Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex quasi enim facere commodi omnis...

</template>

<script setup>
import { ref } from 'vue';

const skeletonLoading = ref(true);

setTimeout(() => {
  skeletonLoading.value = false;
}, 2000);
</script>

<style lang="scss" scoped>
$loading-grey: #ededed;

.card {
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, .12);
  overflow: hidden;
  width: 320px;
}

.image {
  height: 200px;
}

.image img {
  display: block;
  height: inherit;
  object-fit: cover;
  width: 100%;
}

.content {
  padding: 2rem 1.8rem;
}

h4 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  line-height: 1.5rem;
}

.description {
  font-size: 1rem;
  line-height: 1.4rem;
}

.loading .image,
.loading h4,
.loading .description {
  animation: 1s loading ease-in-out infinite;
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, .5) 50%,
    rgba(255, 255, 255, 0) 60%
  ) $loading-grey;
  background-size: 200% 100%;
  background-position-x: 180%;
}

@keyframes loading {
  to {
    background-position-x: -20%;
  }
}

.loading h4 {
  animation-delay: .05s;
  border-radius: 4px;
  min-height: 1.6rem;
}

.loading .description {
  animation-delay: .06s;
  border-radius: 4px;
  min-height: 4rem;
}
</style>
