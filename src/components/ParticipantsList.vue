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
const addSampleParticipants = () => {
  lotteryStore.addParticipant('aaaa');
  lotteryStore.addParticipant('bbbb');
  lotteryStore.addParticipant('cccc');
  lotteryStore.addParticipant('dddd');
};
</script>

<template>
  <v-dialog width="50%">
    <template v-slot:activator="{props}">
      <v-btn icon="mdi-account" v-bind="props"></v-btn>
    </template>
    <template v-slot:default>
      <v-card theme="dark">
        <v-toolbar theme="dark">
          <v-toolbar-title class="text-h6">
            Participants
          </v-toolbar-title>

          <template v-slot:append>
            <v-btn
                title="Add sample participants"
                icon="mdi-star"
                @click="addSampleParticipants()"></v-btn>
            <AddParticipantDialog @add="addNewParticipant">
              <template v-slot:activator="{props}">
                <v-btn icon="mdi-plus-box" v-bind="props"></v-btn>
              </template>
            </AddParticipantDialog>
          </template>
        </v-toolbar>

        <v-card-text>
          <v-list min-width="300">
            <ParticipantItem
                v-for="participant in lotteryStore.allParticipants"
                :key="participant.id"
                :name="participant.name"
                :is-lucky-one="lotteryStore.isLuckyOne(participant.id)"
                :won-date="participant.wonDate"
                :edit-mode="true"
                @deleteParticipant="lotteryStore.removeParticipant(participant.id)"
                @addLuckyOne="lotteryStore.addLuckyOne(participant.id)"
                @removeFromLuckyOnes="lotteryStore.removeFromLuckyOnes(participant.id)"
            />
          </v-list>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>

/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(50%, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}


.hidden {
  transform: rotateY(180deg);
}
</style>
