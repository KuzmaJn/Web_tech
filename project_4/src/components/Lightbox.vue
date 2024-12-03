<script setup>
import { nextTick } from 'vue';
import L from 'leaflet';

const props = defineProps({
  photo: Object,
  index: Number,
  photos: Array,
  onClose: Function,
  onPrev: Function,
  onNext: Function,
  map: Boolean,
  miniMapVisible: {
    type: Boolean,
    default: true,
  },
});
let map = null;
let marker = null;

const openLightbox = async () => {
  await nextTick();
  if (props.map) {
    if(!map){
      map = L.map('mini-map').setView(props.photo.gps, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
    }
    if (!marker) {
      marker = L.marker(props.photo.gps).addTo(map);
    }
  }

};

const closeLightbox = () => {
  if (map) {
    map.remove();
    map = null;
    marker = null;
  }
  props.onClose();
};

const prevPhoto = () => {
  if (props.index > 0) {
    props.onPrev();
    if(map) {
      map.setView(props.photo.gps, 13);
      marker.setLatLng(props.photo.gps);
    }
  }
};

const nextPhoto = () => {
  if (props.index < props.photos.length - 1) {
    props.onNext();
    if(map){
      map.setView(props.photo.gps, 13);
      marker.setLatLng(props.photo.gps);
    }
  }
};

openLightbox();
</script>

<template>
  <div class="flex-box lightbox" @click="closeLightbox">
    <div class="flex-box lightbox-content" @click.stop>
      <div class="lightbox-description">
        <h2>{{ photo.title }}</h2>
        <p>{{ photo.description }}</p>
        <p>{{ photo.date }}</p>
      </div>
      <div class="flex-box buttons">
        <button class="slider" @click="prevPhoto"> < </button>
        <button class="slider" @click="nextPhoto"> > </button>
        <button @click="closeLightbox">Zavrieť</button>
      </div>
    </div>
    <div class="flex-box">
      <img :src="`${photo.path}`" :alt="photo.title" />
      <div id="mini-map" class="map" :style="{ display: miniMapVisible ? 'block' : 'none' }"></div>
    </div>
  </div>
</template>

<style scoped>
/* Lightbox styles */
.flex-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  flex-direction: column;
  justify-content: center;
  z-index: 999;
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

.map {
  border-radius: 0.5rem;
  height: 50vh;
  width: 30vw;
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

button.slider {
  margin-left: 0.5rem;
  background: rgba(255, 255, 255, 0);
  color: black;
  font-size: large;
}

button.slider:hover {
  background: rgb(195, 195, 195);
  font-size: x-large;
}
</style>