<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  photos: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["photo-click"]);

const handlePhotoClick = (photo, index) => {
  emit("photo-click", photo, index);
};
</script>

<template>
  <div class="gallery">
    <div class="gallery-item" v-for="(photo, index) in photos" :key="photo.file" @click="handlePhotoClick(photo, index)">
      <img :src="`${photo.path}`" :alt="photo.title" />
    </div>
  </div>
</template>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 10px;
}

.gallery-item {
  width: 15rem;
  height: 15rem;
  border: 1px solid rgba(67, 77, 81, 0.53);
  border-radius: 0.5rem;
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: auto;
  display: block;
}
</style>