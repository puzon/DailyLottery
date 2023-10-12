<script setup>
const props = defineProps({
  isLuckyOne: Boolean,
});
</script>

<template>
  <v-btn
      v-if="isLuckyOne"
      color="grey-lighten-1"
      icon="mdi-sleep"
      variant="text"
      title="Add to lottery"
      @click="$emit('removeFromLuckyOnes');"
  ></v-btn>
  <v-btn
      v-else
      color="grey-lighten-1"
      icon="mdi-star-shooting-outline"
      variant="text"
      title="Mark as Lucky One"
      @click="$emit('addLuckyOne');"
  ></v-btn>

</template>

<style scoped>

</style>
