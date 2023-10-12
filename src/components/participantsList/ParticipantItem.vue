<script setup>
import {useDateFormat} from "@vueuse/core";
import {computed} from "vue";
import LuckyOneActionButton from "@/components/participantsList/LuckyOneActionButton.vue";

const props = defineProps({
  id: String,
  name: String,
  isLuckyOne: Boolean,
  wonDate: Number,
  editMode: Boolean,
});

const wonDateFormatted = useDateFormat(props.wonDate, 'DD-MM-YYYY HH:mm:ss');

const subtitle = computed(() => {
  if (props.isLuckyOne) {
    return `Selected at ${wonDateFormatted.value}`;
  }

  return 'Counting for luck';
})
</script>

<template>
    <v-list-item
        :title="name"
        :subtitle="subtitle"
    >
      <template v-slot:prepend>
          <v-icon color="green" :title="wonDateFormatted" v-show="isLuckyOne">mdi-check</v-icon>
      </template>

      <template v-slot:append>
        <v-btn
            v-show="editMode"
            color="grey-lighten-1"
            icon="mdi-delete"
            variant="text"
            title="Remove"
            @click="$emit('deleteParticipant')"
        ></v-btn>
        <LuckyOneActionButton
          :is-lucky-one="isLuckyOne"
          @addLuckyOne="$emit('addLuckyOne')"
          @removeFromLuckyOnes="$emit('removeFromLuckyOnes')" />
<!--        <v-btn
            v-show="editMode"
            color="grey-lighten-1"
            icon="mdi-eye"
            variant="text"
            title="Hide"
            @click="$emit('addLuckyOne');"
        ></v-btn>-->
      </template>
    </v-list-item>
</template>

<style scoped>

</style>
