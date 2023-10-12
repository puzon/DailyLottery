<script setup>
import {useLotteryStore} from '@/stores/lottery'
import ParticipantCard from "@/components/currentLottery/ParticipantCard.vue";
import {ref} from "vue";

const lotteryStore = useLotteryStore();
const choosingLuckyOne = ref(false);
const startingOver = ref(false);
const startLottery = async () => {
  choosingLuckyOne.value = true;
  lotteryStore.chooseLuckyOne()
      .then((luckyOneId) => {
      })
      .catch((e) => {
        console.log(e);
        alert('Something is no yes');
      })
      .finally(() => {
        choosingLuckyOne.value = false;
      });
}

const startOver = async () => {
  startingOver.value = true;
  lotteryStore.startNewLottery()
      .then(() => {
        startingOver.value = false;
      });
}
</script>

<template>
  <div>
    <v-row
        align="center"
        justify="center"
        class="pa-10">
      <v-btn
          v-if="lotteryStore.canChooseLuckyOne"
          :loading="choosingLuckyOne"
          elevation="8"
          rounded="xl"
          size="x-large"
          variant="elevated"
          @click="startLottery()"
      >
        Choose lucky one
      </v-btn>

      <v-btn
          v-else
          :loading="startingOver"
          elevation="8"
          rounded="xl"
          size="x-large"
          variant="elevated"
          @click="startOver()"
      >Start over
      </v-btn>
    </v-row>

    <v-row
        align="center"
        justify="center">
      <TransitionGroup name="participants">
        <v-col
            v-for="participant in lotteryStore.allParticipants"
            :key="participant.id"
            cols="auto"
        >
          <ParticipantCard
              :name="participant.name"
              :isLuckyOne="participant.isLuckyOne"
              :wonDate="participant.wonDate"
          />
        </v-col>
      </TransitionGroup>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.participants-move,
.participants-enter-active,
.participants-leave-active {
  transition: all .3s ease-in-out;

  @for $i from 1 to 20 {
    &:nth-child(#{$i} of .participants-move) {
      transition-delay: #{$i * 100}ms;
    }
  }
}


.participants-enter-from,
.participants-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.participants-leave-active {
  position: absolute;
}
</style>
