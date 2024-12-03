<script setup>
import 'leaflet/dist/leaflet.css';
import { ref, nextTick, computed } from 'vue';
import photosData from '../assets/meta.json';
import Gallery from "@/components/Gallery.vue";
import Lightbox from '@/components/Lightbox.vue';

const photos = ref(photosData);
const isFocused = ref(false);
const filterText = ref('');
const selectedPhoto = ref(null);
let currentIndex = ref(null);


const filteredPhotos = computed(() => {
  const text = filterText.value.toLowerCase();
  return photos.value.filter(photo =>
      photo.title.toLowerCase().includes(text) ||
      photo.description.toLowerCase().includes(text) ||
      photo.date.includes(text) ||
      photo.keywords.toLowerCase().includes(text)
  );
});
const openLightbox = async (photo, index) => {
  selectedPhoto.value = photo;
  currentIndex.value = index
  await nextTick();
};
const closeLightbox = () => {
  selectedPhoto.value = null;
  currentIndex.value = null;
};

const prevPhoto = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    selectedPhoto.value = filteredPhotos.value[currentIndex.value];
  }
};

const nextPhoto = () => {
  if (currentIndex.value < filteredPhotos.value.length - 1) {
    currentIndex.value++;
    selectedPhoto.value = filteredPhotos.value[currentIndex.value];
  }
};
</script>

<template>
  <div class="main">
    <div class="reuse-box filter">
      <div v-if="isFocused" class="info-box">
        Filtruj podľa opisu, lokácie alebo dátumu
      </div>
      <input
          type="text"
          v-model="filterText"
          placeholder="Filter"
          @focus="isFocused = true"
          @blur="isFocused = false"
      />
    </div>
    <Gallery :photos="filteredPhotos" @photo-click="openLightbox"></Gallery>

  <!-- Lightbox for full sized image -->
    <Lightbox
        v-if="selectedPhoto"
        :photo="selectedPhoto"
        :index="currentIndex"
        :photos="filteredPhotos"
        @close="closeLightbox"
        @prev="prevPhoto"
        @next="nextPhoto"
        :map="true"
        :mini-map-visible="true"
    />
  </div>
</template>

<style scoped>
/* ---------------------- */
/* Global styles */
/* ---------------------- */
.main {
  margin: 0 1rem;
}

.reuse-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
/* ---------------------- */
/* Filter styles */
/* ---------------------- */
.filter{
  justify-content: right;
  margin: 1rem 0;
}

.filter input{
  margin-left: 1rem;
  max-width: 20%;
  border: 2px solid rgba(207, 233, 255, 0.68);
  border-radius: 4px;
  font-size: 1rem;
}

.filter input:focus{
  background-color: rgba(207, 233, 255, 0.68);
  outline: none;
}

.info-box{
  color: darkgray;
  font-weight: lighter;
}
</style>