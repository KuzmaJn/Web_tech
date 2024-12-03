<script setup>
import 'leaflet/dist/leaflet.css';
import {ref, onMounted } from 'vue';
import L from 'leaflet';
import locations from '../assets/meta.json';
import * as turf from '@turf/turf';
import Gallery from "@/components/Gallery.vue";
import Lightbox from "@/components/Lightbox.vue";

// premenna map aby bola dostupna ku kazdej funkcii
let map = null;
// Pole na uloženie zoskupených značiek podľa lokácie
const groupedMarkers = ref([]);

// Referencia na aktuálne vybranú fotografiu
const selectedPhoto = ref(null);

// Boolean na sledovanie, či je galéria otvorená
let isGalleryOpen = ref(false);

// Index aktuálne vybranej fotografie v galérii
let currentIndex = ref(null);

// Pole na uloženie všetkých fotografií
let photos = ref([]);

// Pole na uloženie filtrovaných fotografií podľa vybranej lokácie
let filteredPhotos = ref([]);

// premenne potrebne pre zobrazenie trasy
let routeLayer = ref(null);
let isRouteVisible = ref(false);
let routeButton = ref("Zobraz trasu");
const totalDist = ref(null);

// vypocet ci dana fotografia patri do rovnakeho miesta
function isWithinRadius(lat1, lon1, lat2, lon2, radius = 20000) {
  const from = turf.point([lon1, lat1]);
  const to = turf.point([lon2, lat2]);
  const options = { units: 'meters' };
  const distance = turf.distance(from, to, options);
  return distance <= radius;
}

// zoskupenie fotografii podla lokacie
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

// zobrazenie mapy a miest na mape
onMounted(() => {
  groupLocations();
  console.log(groupedMarkers)
  map = L.map('map').setView([48.148598, 17.107748], 5);
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
  filteredPhotos.value = null;
};

const openLightbox = (photo, index) => {
  selectedPhoto.value = photo;
  currentIndex.value = index;

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

const toggleRoute = () => {
  if (isRouteVisible.value) {
    // Skryť trasu
    if (routeLayer.value) {
      routeLayer.value.remove();
    }
    isRouteVisible.value = false;
    routeButton.value = "Zobraz trasu"
  } else {
    // Vykresliť trasu
    const sortedLocations = [...locations].sort((a, b) => new Date(a.date) - new Date(b.date)); // Triedenie podľa dátumu
    const routeCoordinates = sortedLocations.map(location => location.gps);

    // Vytvor Polyline pre trasu
    routeLayer.value = L.polyline(routeCoordinates, { color: 'blue' }).addTo(map);

    // Priblížiť mapu na trasu
    map.fitBounds(routeLayer.value.getBounds());

    isRouteVisible.value = true;
    routeButton.value = "Skry trasu"

    totalDist.value = calculateRouteDistance(routeCoordinates);
  }
};

const calculateRouteDistance = (coordinates) => {
  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const from = turf.point(coordinates[i]);
    const to = turf.point(coordinates[i + 1]);
    const options = { units: 'kilometers' };
    totalDistance += turf.distance(from, to, options);
  }
  return totalDistance.toFixed(2); // Dĺžka v kilometroch
};
</script>

<template>
  <div class="main">
    <div class="route-box">
      <span v-if="isRouteVisible" class="route-distance">Celková vzdialenosť: {{ totalDist }}</span>
      <button class="route-btn" @click="toggleRoute">
        {{ routeButton }}
      </button>

    </div>
    <div id="map" class="map"></div>

    <div v-if="isGalleryOpen" class="gallery-overlay" @click="closeGallery">
      <div class="gallery-content" @click.stop>
        <gallery :photos="photos" @photo-click="openLightbox"></gallery>
      </div>
    </div>

    <Lightbox
        v-if="selectedPhoto"
        :photo="selectedPhoto"
        :index="currentIndex"
        :photos="filteredPhotos"
        @close="closeLightbox"
        @prev="prevPhoto"
        @next="nextPhoto"
        :map="false"
        :mini-map-visible="false"
    ></Lightbox>
  </div>
</template>

<style scoped>
.main{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.map {
  margin-bottom: 0.25rem;
  border-radius: .5rem;
  height: 70vh;
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

button {
  min-width: 6.8rem;
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

.route-box{
  width: 90vw;
  margin-bottom: 1rem;
  display: flex;
  justify-content: right;
  align-items: center;
}
</style>