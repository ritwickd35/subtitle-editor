<script setup lang="ts">
import HomeView from "./views/HomeView.vue";
</script>

<template>
  <Toast />
  <div class="container" id="header-container" style="height: 60px"> 
    <div class="row justify-content-center">
      <h2 class="text-center py-2" style="color:#12121299; margin-top: 20px;">Subtitle Editor</h2>
    </div>
  </div>

  <HomeView></HomeView>
</template>

<style scoped></style>
