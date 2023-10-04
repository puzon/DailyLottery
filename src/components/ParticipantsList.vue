<script setup>
import {useLotteryStore} from '@/stores/lottery'
import {ref} from "vue";
import ParticipantItem from "@/components/participantsList/ParticipantItem.vue";
import AddParticipantDialog from "@/components/participantsList/AddParticipantDialog.vue";

const lotteryStore = useLotteryStore();
let dialog = ref(false);

const addNewParticipant = (name) => {
  if (name && name.length > 2) {
    lotteryStore.addParticipant(name);
    dialog.value = false;
  }
}
</script>

<template>
  <v-card class="mx-auto">
    <v-list>
      <ParticipantItem
          v-for="participant in lotteryStore.allParticipants"
          :key="participant.id"
          :name="participant.name"
          :is-lucky-one="lotteryStore.isLuckyOne(participant.id)"
          @deleteParticipant="lotteryStore.removeParticipant(participant.id)"
          @addLuckyOne="lotteryStore.addLuckyOne(participant.id)"

      />
    </v-list>

    <v-row justify="center">
      <AddParticipantDialog
          @add="addNewParticipant"
      />
    </v-row>
  </v-card>
</template>

<style scoped>

</style>
