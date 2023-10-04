import {defineStore} from "pinia";
import {v4 as uuid} from 'uuid';

const LOTTERY_STATE_NAME = 'lottery';

export const useLotteryStore = defineStore('lottery', {
    state: () => ({
        current: {
            participants: {},
            minimumTickets: 6,
        },
        history: [],
    }),
    persist: {
        key: LOTTERY_STATE_NAME,
    },
    actions: {
        addParticipant(name) {
            const newParticipant = {
                id: uuid(),
                name: name,
                wonDate: null,
            };

            this.current.participants[newParticipant.id] = newParticipant;

            return newParticipant;
        },
        removeParticipant(participantId) {
            delete this.current.participants[participantId];
        },
        getParticipantById(id) {
            return this.current.participants[id] ?? null;
        },
        isLuckyOne(participantId) {
            return this.getParticipantById(participantId).wonDate !== null;
        },
        addLuckyOne(participantId) {
            if (!this.isLuckyOne(participantId)) {
                this.getParticipantById(participantId).wonDate = new Date().getTime();
            }
        },
    },
    getters: {
        allParticipants(state) {
            return Object.values(state.current.participants)
        },
    }
});
