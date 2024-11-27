<script setup>
  import { ref, computed } from 'vue'
  import Home from './components/MyGallery.vue'
  import Map from './components/Map.vue'

  const routes = {
  '/': Home,
  '/Map': Map,
}

  const currentPath = ref(window.location.hash)

  window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

  const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})

  const heading = computed(() => {
    if (currentPath.value === '#/' || currentPath.value === '') {
      return 'Galéria'
    } else if (currentPath.value === '#/Map') {
      return 'Mapa Obrázkov'
    } else {
      return 'Neznáma stránka'
    }
  })
</script>

<template>
  <div class="navbar">
    <h1>{{ heading }}</h1>
    <nav>
      <a href="#/">Galéria</a>
      <a href="#/Map">Mapa obrázkov</a>
    </nav>
  </div>
  <component :is="currentView" />
</template>

<style scoped>
.navbar{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  background-color: rgba(207, 233, 255, 0.68);
}
h1, nav{
  margin-right: 1rem;
  margin-left: 1rem;
}
nav a{
  margin: .5rem;
  color: #000000;
  text-decoration: none;
  text-align: center;

}
nav a:link,a:visited,a:focus {
  color: #000000;
}
</style>
