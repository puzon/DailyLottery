import {defineStore} from "pinia";
import {v4 as uuid} from 'uuid';
import {getRandomGenerator} from "@/services/RandomGeneratorFactory";

const LOTTERY_STATE_NAME = 'lottery';
const MIN_LOTTERY_PARTICIPANTS = 2;

export const useLotteryStore = defineStore('lottery', {
    state: () => ({
        current: {},
        history: [],
        randomGenerator: getRandomGenerator(),
    }),
    persist: {
        key: LOTTERY_STATE_NAME,
        paths: [
            'current',
            'history',
        ],
    },
    actions: {
        addParticipant(name) {
            const newParticipant = {
                id: uuid(),
                name: name,
                wonDate: null,
            };
            this.current[newParticipant.id] = newParticipant;

            return newParticipant;
        },
        removeParticipant(participantId) {
            delete this.current[participantId];
        },
        getParticipantById(id) {
            return this.current[id] ?? null;
        },
        isLuckyOne(participantId) {
            return this.getParticipantById(participantId).wonDate !== null;
        },
        addLuckyOne(participantId) {
            if (!this.isLuckyOne(participantId)) {
                this.getParticipantById(participantId).wonDate = new Date().getTime();
            }
        },
        removeFromLuckyOnes(participantId) {
            if (this.isLuckyOne(participantId)) {
                this.getParticipantById(participantId).wonDate = null;
            }
        },
        async randomizeParticipants() {
            let randomized = await this.getAllRandomizedParticipants();

            console.log(randomized);
            let newCurrent = {};
            for (let index in randomized) {
                const newParticipant = {...randomized[index]};
                newCurrent[newParticipant.id] = newParticipant;
            }

            this.current = newCurrent;
        },
        async getRandomizedParticipantsToChoose() {
            return await this.randomGenerator.shuffleArray(this.participantsToChoose);
        },
        async getAllRandomizedParticipants() {
            return await this.randomGenerator.shuffleArray(this.allParticipants);
        },
        async chooseLuckyOne() {
            if (!this.canChooseLuckyOne) {
                return false;
            }

            let ids = this.participantsToChoose.map((participant) => participant.id);

            let randomIndex = await this.randomGenerator.getRandomNumber(0, ids.length - 1);

            this.addLuckyOne(ids[randomIndex]);

            return ids[randomIndex];
        },
        async startNewLottery() {
            let currentParticipants = await this.getAllRandomizedParticipants();
            this.history.unshift(this.current);
            let newCurrent = {};
            for (let index in currentParticipants) {
                const newParticipant = {...currentParticipants[index]};
                newParticipant.wonDate = null;
                newCurrent[newParticipant.id] = newParticipant;
            }

            this.current = newCurrent;
        }
    },
    getters: {
        canChooseLuckyOne() {
            return this.participantsToChoose.length >= MIN_LOTTERY_PARTICIPANTS;
        },
        allParticipants: (state) => {
            return Object.values(state.current)
        },
        participantsToChoose: (state) => {
            return Object.values(state.current)
                .filter((participant) => {
                    return !participant.wonDate;
                });
        },
        hasEnoughParticipants() {
            return this.allParticipants.length >= MIN_LOTTERY_PARTICIPANTS;
        },
    }
});
