<script setup>
import {useDateFormat} from "@vueuse/core";

const props = defineProps({
  id: String,
  name: String,
  isLuckyOne: Boolean,
  wonDate: Number,
});

const wonDateFormatted = useDateFormat(props.wonDate, 'DD-MM-YYYY HH:mm:ss')

</script>

<template>
  <v-list-item
      :title="name"
  >
    <template v-slot:prepend v-if="isLuckyOne">
      <v-avatar color="green" :title="wonDateFormatted">
        <v-icon color="white">mdi-check</v-icon>
      </v-avatar>
    </template>

    <template v-slot:append>
      <v-btn
          color="grey-lighten-1"
          icon="mdi-delete"
          variant="text"
          @click="$emit('deleteParticipant')"
      ></v-btn>
      <v-btn
          color="grey-lighten-1"
          icon="mdi-arrow-up"
          variant="text"
          title="Promote"
          @click="$emit('addLuckyOne');"
      ></v-btn>
    </template>
  </v-list-item>
</template>

<style scoped>

</style>
