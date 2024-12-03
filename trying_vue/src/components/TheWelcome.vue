<template>
  <div>
    <!-- Textový vstup na filtrovanie -->
    <input
        type="text"
        v-model="searchQuery"
        class="filter-input"
        placeholder="Zadajte hľadaný výraz"
        @input="filterImages"
    />

    <!-- Zobrazenie galérie s náhľadmi obrázkov -->
    <div class="thumbnail-grid">
      <div
          v-for="(image, index) in filteredImages"
          :key="index"
          class="thumbnail-container"
          @click="openModal(index)"
      >
        <img :src="image.path" :alt="image.title" class="thumbnail" />
      </div>
    </div>

    <!-- Modálne okno na zobrazenie plného obrázku -->
    <div v-if="isModalOpen" class="image-modal" @click="closeModal">
      <div class="modal-content">
        <img :src="images[activeImageIndex].path" :alt="images[activeImageIndex].title" />
        <h3>{{ images[activeImageIndex].title }}</h3>
        <p>{{ images[activeImageIndex].description }}</p>
        <p>{{ images[activeImageIndex].dateTime }}</p>
        <p>
          Miesto: {{ images[activeImageIndex].gps.latitude }}, {{ images[activeImageIndex].gps.longitude }}
        </p>
        <button @click="startSlideshow">Spustiť slideshow</button>
      </div>
      <button class="close-modal" @click="closeModal">X</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import galleryData from "../gallery.json"; // Načítanie dát z JSON súboru

export default {
  setup() {
    const images = ref(galleryData);
    const searchQuery = ref('');
    const isModalOpen = ref(false);
    const activeImageIndex = ref(null);
    const filteredImages = computed(() => {
      if (searchQuery.value === "") {
        return images.value;
      } else {
        const searchStr = searchQuery.value.toLowerCase();
        return images.value.filter((image) => {
          return (
              image.title.toLowerCase().includes(searchStr) ||
              image.description.toLowerCase().includes(searchStr)
          );
        });
      }
    });

    const openModal = (index) => {
      activeImageIndex.value = index;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const filterImages = () => {
      // Computed property will handle filtering
    };

    const startSlideshow = () => {
      let index = activeImageIndex.value;
      const totalImages = filteredImages.value.length;

      // Slideshow funkcia
      const slideshowInterval = setInterval(() => {
        index = (index + 1) % totalImages; // Zabezpečí opakovanie cyklu
        activeImageIndex.value = index;
      }, 3000); // Zmena obrázkov každé 3 sekundy

      // Možnosť zastaviť slideshow po kliknutí na obrázok
      onMounted(() => {
        closeModal();
        clearInterval(slideshowInterval);
      });
    };

    // Po zadaní hľadaného výrazu re-filterujeme obrázky
    watch(searchQuery, filterImages);

    return {
      images,
      searchQuery,
      isModalOpen,
      activeImageIndex,
      filteredImages,
      openModal,
      closeModal,
      filterImages,
      startSlideshow
    };
  }
};
</script>

<style scoped>
/* Základné štýly pre galériu */

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.thumbnail-container {
  cursor: pointer;
  position: relative;
}

.thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease, border 0.3s ease;
}

.thumbnail:hover {
  transform: scale(1.05);
  border: 2px solid #333;
}

.filter-input {
  margin-top: 20px;
  padding: 10px;
  font-size: 1.1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
  display: block;
  outline: none;
}

.filter-input:focus {
  border-color: #333;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

/* Modálne okno na zobrazenie plného obrázku */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.image-modal img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.modal-content {
  color: white;
  text-align: center;
  margin-top: 10px;
}

.modal-content h3 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.modal-content p {
  font-size: 1.1em;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  color: white;
  border: none;
  padding: 10px;
  font-size: 1.5em;
  cursor: pointer;
}

.close-modal:hover {
  background-color: darkred;
}
</style>