<script setup>
import {ref} from "vue";

const showCard = ref(false);
const luckyName = ref('');

const showLuckyOne = (name) => {
  luckyName.value = name;
  showCard.value = true;
}

defineExpose({
  showLuckyOne,
});
const emit = defineEmits(['closed']);

const onShowCardChanged = (newValue) => {
  if (!newValue) {
    emit('closed');
  }
};
</script>

<template>
  <v-dialog
      v-model="showCard"
      width="auto"
      transition="fab-transition"
      @update:modelValue="onShowCardChanged"
  >
    <template v-slot:default>
      <div class="cardContainer d-flex flex-column align-center">
        <v-icon
            class="crown"
            icon="mdi-crown"/>
        <v-card
            color="success"
            variant="elevated"
            class="elevation-24"
            min-width="300"
        >
          <v-card-item>
            <div class="text-h3 pa-5 mb-1 text-center">
              {{ luckyName }}
            </div>
          </v-card-item>
        </v-card>
      </div>
    </template>
  </v-dialog>
</template>

<style scoped lang="scss">
.cardContainer {
  margin-top: -10rem;
}

.crown {
  font-size: 10rem;
  color: #fff;
}
</style>
