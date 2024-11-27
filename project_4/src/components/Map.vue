<script setup>
import 'leaflet/dist/leaflet.css';
import {ref, onMounted } from 'vue';
import L from 'leaflet';
import locations from '../assets/meta.json';
import * as turf from '@turf/turf';
import Gallery from "@/components/Gallery.vue";

const groupedMarkers = ref([]);
const selectedPhoto = ref(null);
let isGalleryOpen = ref(false);
let currentIndex = ref(null);
let photos = ref([]);
let filteredPhotos = ref([]);
function isWithinRadius(lat1, lon1, lat2, lon2, radius = 20000) {
  const from = turf.point([lon1, lat1]);
  const to = turf.point([lon2, lat2]);
  const options = { units: 'meters' };
  const distance = turf.distance(from, to, options);
  return distance <= radius;
}

const groupLocations = () => {
  const groups = [];

  locations.forEach((location) => {
    let addedToGroup = false;
    for (let group of groups) {
      if (isWithinRadius(group.latitude, group.longitude, location.gps[0], location.gps[1])) {
        group.locations.push(location);
        addedToGroup = true;
        break;
      }
    }
    if (!addedToGroup) {
      groups.push({
        latitude: location.gps[0],
        longitude: location.gps[1],
        locations: [location],
      });
    }
  });
  groupedMarkers.value = groups;
};


onMounted(() => {
  groupLocations();
  console.log(groupedMarkers)
  const map = L.map('map').setView([48.148598, 17.107748], 5);
  map.getPanes().mapPane.style.zIndex = '0';
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  groupedMarkers.value.forEach(location => {
    const marker = L.marker([location.latitude, location.longitude]).addTo(map);
    marker.bindPopup(`Fotky v oblasti: ${location.locations.length}`).on('click', () => {
      photos.value = location.locations;
      if(location.locations.length > 1){
        isGalleryOpen.value = true;
        filteredPhotos.value = location.locations
      }
      else{
        selectedPhoto.value = location.locations[0]
      }
    })
  })
});
const closeGallery = () => {
  isGalleryOpen.value = false;
  selectedPhoto.value = null;
};

const openLightbox = (photo, index) => {
  selectedPhoto.value = photo;
  currentIndex.value = index;
};
const closeLightbox = () => {
  selectedPhoto.value = null;
  currentIndex.value = null;
  filteredPhotos.value = null;
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
    <div id="map" class="map"></div>

    <div v-if="isGalleryOpen" class="gallery-overlay" @click="closeGallery">
      <div class="gallery-content" @click.stop>
        <gallery :photos="photos" @photo-click="openLightbox"></gallery>
      </div>
    </div>

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
      </div>
    </div>
  </div>
</template>

<style scoped>
.main{
  display: flex;
  justify-content: center;
  align-items: center;
}
.map {
  border-radius: .5rem;
  height: 80vh;
  width: 90vw;
  z-index: 1;
}
.gallery-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 888;
}

.gallery-content{
  margin: 1rem;
}

.reuse-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  background: rgba(0, 0, 0, 0.6);
  flex-direction: column;
  justify-content: center;
  z-index: 999;
}

.lightbox-content {
  background: rgba(255, 255, 255, 0.9);
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