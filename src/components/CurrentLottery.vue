<script setup>
import {useLotteryStore} from '@/stores/lottery'
import ParticipantCard from "@/components/currentLottery/ParticipantCard.vue";
import {ref} from "vue";
import LuckyOneCard from "@/components/currentLottery/LuckyOneCard.vue";

const lotteryStore = useLotteryStore();
const choosingLuckyOne = ref(false);
const startingOver = ref(false);
const dimCards = ref(false);
const luckyOneCard = ref(null);

const startLottery = async () => {
  choosingLuckyOne.value = true;
  await lotteryStore.randomizeParticipants();
  setTimeout(() => {
    lotteryStore.chooseLuckyOne()
        .then((luckyOneId) => {
          dimCards.value = true;
          luckyOneCard.value.showLuckyOne(lotteryStore.getParticipantById(luckyOneId).name);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          choosingLuckyOne.value = false;
        });
  }, 1500);
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
              :dimCards="dimCards"
          />
        </v-col>
      </TransitionGroup>
    </v-row>

    <LuckyOneCard
        ref="luckyOneCard"
        @closed="dimCards = false"
    />
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
