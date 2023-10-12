<script setup>
import ParticipantsList from "@/components/ParticipantsList.vue";
import {useLotteryStore} from '@/stores/lottery'
import {ref} from "vue";
import CurrentLottery from "@/components/CurrentLottery.vue";

const lotteryStore = useLotteryStore();
const randomizingInProgress = ref(false);

const randomizeParticipants = async () => {
  randomizingInProgress.value = true;
  lotteryStore.randomizeParticipants()
      .then(() => {
        setTimeout(() => {
          randomizingInProgress.value = false
        }, 200);
      });
}
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar
        title="Daily Lottery"
        theme="dark"
        density="compact"
    >
      <template v-slot:append>
        <v-btn icon="mdi-dice-multiple" :loading="randomizingInProgress" @click="randomizeParticipants()"></v-btn>

        <participants-list/>
      </template>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center">
      <CurrentLottery v-if="lotteryStore.hasEnoughParticipants">
      </CurrentLottery>
      <div v-else class="text-h4">
        Add more participants.
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>

</style>
