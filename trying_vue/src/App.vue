<template>
  <div>
    <header>
      <h1>Fotogaléria</h1>
    </header>
    <main>
      <Gallery />
    </main>
  </div>
</template>

<script>
import Gallery from './components/TheWelcome.vue';

export default {
  name: 'App',
  components: {
    Gallery,
  },
};
</script>

<style>
header {
  text-align: center;
  background-color: #333;
  color: white;
  padding: 1em 0;
}

main {
  padding: 20px;
}
</style>
