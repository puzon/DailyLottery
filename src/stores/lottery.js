import {defineStore} from "pinia";
import {v4 as uuid} from 'uuid';
import {getRandomGenerator} from "@/services/RandomGeneratorFactory";

const LOTTERY_STATE_NAME = 'lottery';

export const useLotteryStore = defineStore('lottery', {
    state: () => ({
        current: {},
        ticketsForParticipant: 2,
        history: [],
        randomGenerator: getRandomGenerator(),
    }),
    persist: {
        key: LOTTERY_STATE_NAME,
        paths: [
            'current',
            'ticketsForParticipant',
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
        getRandomizedParticipantsToChoose() {
            const participantsTickets = this.participantsToChoose.reduce((resource, participant) => {
                return resource.concat(Array(this.ticketsForParticipant).fill(participant));
            }, []);

            return this.randomGenerator.shuffleArray(participantsTickets);
        }
    },
    getters: {
        allParticipants: (state) => {
            return Object.values(state.current)
        },
        participantsToChoose: (state) => {
            return Object.values(state.current)
                .filter((participant) => {
                    return !participant.wonDate;
                });
        },
    }
});
