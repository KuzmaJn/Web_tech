<template>
  <div>
    <header>
      <h1>Mapa Fotografií</h1>
    </header>

    <div id="map" class="map-container"></div>

    <div v-if="selectedLocation" class="location-info">
      <h3>{{ selectedLocation.title }}</h3>
      <p>{{ selectedLocation.description }}</p>
      <p>{{ selectedLocation.dateTime }}</p>
      <div class="gallery">
        <img :src="selectedLocation.path" :alt="selectedLocation.title" />
      </div>
      <button @click="toggleRoute">Zobraziť Trasu</button>
    </div>

    <!-- Zobrazenie trasy -->
    <div v-if="showRoute" id="route"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import L from "leaflet";
import galleryData from "../gallery.json";

export default {
  setup() {
    const map = ref(null);
    const markers = ref([]);
    const selectedLocation = ref(null);
    const showRoute = ref(false);
    const routeLine = ref(null);

    const initializeMap = () => {
      map.value = L.map("map").setView([48.14816, 17.10674], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map.value);

      addMarkers();
    };

    const addMarkers = () => {
      galleryData.forEach((image) => {
        const { latitude, longitude, title, description, path } = image;

        const marker = L.marker([latitude, longitude])
            .addTo(map.value)
            .bindPopup(`<b>${title}</b><br>${description}`)
            .on("click", () => selectLocation(image));

        markers.value.push(marker);
      });
    };

    const selectLocation = (location) => {
      selectedLocation.value = location;
    };

    const toggleRoute = () => {
      if (showRoute.value) {
        map.value.removeLayer(routeLine.value);
        showRoute.value = false;
      } else {
        showRoute.value = true;
        drawRoute();
      }
    };

    const drawRoute = () => {
      const routeCoordinates = galleryData.map((image) => [image.gps.latitude, image.gps.longitude]);

      routeLine.value = L.polyline(routeCoordinates, { color: "blue" }).addTo(map.value);
      map.value.fitBounds(routeLine.value.getBounds());
    };

    onMounted(() => {
      initializeMap();
    });

    return {
      selectedLocation,
      showRoute,
      toggleRoute,
    };
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  margin-top: 20px;
}

.location-info {
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.gallery img {
  width: 100%;
  height: auto;
  max-width: 500px;
  margin-top: 20px;
  border-radius: 8px;
}

button {
  margin-top: 20px;
  padding: 10px;
  font-size: 1.2em;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #555;
}

#route {
  margin-top: 20px;
  height: 300px;
  background-color: #f4f4f4;
}
</style>