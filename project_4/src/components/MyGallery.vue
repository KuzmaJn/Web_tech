<script setup>
import 'leaflet/dist/leaflet.css';
import { ref, nextTick, computed } from 'vue';
import photosData from '../assets/meta.json';
import L from "leaflet";
import Gallery from "@/components/Gallery.vue";

const photos = ref(photosData);
const isFocused = ref(false);
const filterText = ref('');
const selectedPhoto = ref(null);
let currentIndex = ref(null);
let map = null;
let marker = null;

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
  if (!map) {
    map = L.map('map').setView(photo.gps, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  }
  if (!marker) {
    marker = L.marker(photo.gps).addTo(map);
  }
};
const closeLightbox = () => {
  if (map) {
    map.remove();
    map = null;
    marker = null;
  }
  selectedPhoto.value = null;
  currentIndex.value = null;
};

const prevPhoto = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    selectedPhoto.value = filteredPhotos.value[currentIndex.value];
    map.setView(selectedPhoto.value.gps, 13);
    marker.setLatLng(selectedPhoto.value.gps);
  }
};

const nextPhoto = () => {
  if (currentIndex.value < filteredPhotos.value.length - 1) {
    currentIndex.value++;
    selectedPhoto.value = filteredPhotos.value[currentIndex.value];
    map.setView(selectedPhoto.value.gps, 13);
    marker.setLatLng(selectedPhoto.value.gps);
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
    <div v-if="selectedPhoto" class="reuse-box lightbox" @click="closeLightbox">
      <div class="reuse-box lightbox-content" @click.stop>
        <div class="lightbox-description">
          <h2>{{ selectedPhoto.title }}</h2>
          <p>{{ selectedPhoto.description }}</p>
          <p>{{ selectedPhoto.date }}</p>
        </div>
        <div class="reuse-box buttons">
          <button class="slider" @click="prevPhoto"> < </button>
          <button class="slider" @click="nextPhoto"> > </button>
          <button @click="closeLightbox">Zavrieť</button>
        </div>
      </div>
      <div class="reuse-box">
        <img :src="`${selectedPhoto.path}`" :alt="selectedPhoto.title" />
        <div id="map" class="map"></div>
      </div>
    </div>
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

/* ---------------------- */
/* Lightbox styles */
/* ---------------------- */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  flex-direction: column;
  justify-content: center;
}

.lightbox-content {
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  width: 98%;
  border-radius: 0.5rem;
}

h2, p {
  font-size: 0.9rem;
  padding: 0.05rem;
  margin: 0.05rem;
}

.lightbox img {
  width: auto;
  max-height: 80vh;
  margin: 1rem;
}
/* ---------------------- */
/* Map styles */
/* ---------------------- */
.map {
  border-radius: 0.5rem;
  height: 50vh;
  width: 30vw;
}

/* ---------------------- */
/* Utility styles */
/* ---------------------- */
button {
  margin-left: 2rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  max-height: 3rem;
}

button:hover {
  background: #0056b3;
}

button.slider{
  margin-left: 0.5rem;
  background: rgba(255, 255, 255, 0);
  color: black;
  font-size: large;
}
button.slider:hover{
  background: rgb(195, 195, 195);
  font-size: x-large;
}
</style>