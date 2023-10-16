<script setup>
import {computed} from "vue";
import {useDateFormat} from "@vueuse/core";

const props = defineProps({
  name: String,
  wonDate: Number,
  isLuckyOne: Boolean,
  dimCards: {
    type: Boolean,
    default: false,
  },
});

const isLuckyOne = computed(() => {
  return props.wonDate !== null;
});
const variant = computed(() => {
  return props.wonDate === null ? 'tonal' : 'elevated';
});
const wonDate = computed(() => {
  return useDateFormat(props.wonDate, 'DD-MM-YYYY').value;
});
const cardColor = computed(() => {
  return props.dimCards ? '#646464' : 'success';
});

</script>

<template>
  <v-card
      class="mx-auto"
      :class="{dimmed: dimCards}"
      max-width="344"
      min-width="200"
      min-height="150"
      :color="cardColor"
      :variant="variant"
  >
    <v-card-item>
      <div>
        <v-icon
            v-if="isLuckyOne"
            icon="mdi-crown"/>
        <div class="text-h6 mb-1">
          {{ props.name }}
        </div>
        <div
            v-if="isLuckyOne">
          {{ wonDate }}
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.dimmed {
  opacity: .5;
}
</style>
