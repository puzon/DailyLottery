import {createPinia, setActivePinia} from "pinia";
import {useLotteryStore} from "@/stores/lottery";
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {nextTick} from "vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

describe('Lottery store', () => {
    describe('Standard operations', () => {
        beforeEach(() => {
            setActivePinia(createPinia());
            window.localStorage.clear();
        });

        it('adds participants', () => {
            const lottery = useLotteryStore();
            expect(lottery.allParticipants).toHaveLength(0);

            lottery.addParticipant('a');
            lottery.addParticipant('b');

            expect(lottery.allParticipants).toHaveLength(2);
        });

        it('removes participants', () => {
            const lottery = useLotteryStore();
            expect(lottery.allParticipants).toHaveLength(0);

            const participantA = lottery.addParticipant('a');
            lottery.addParticipant('b');
            lottery.removeParticipant(participantA.id);

            expect(lottery.allParticipants).toHaveLength(1);
        });

        it('return participant by id', () => {
            const lottery = useLotteryStore();
            expect(lottery.allParticipants).toHaveLength(0);

            const participantA = lottery.addParticipant('a');
            lottery.addParticipant('b');

            expect(lottery.getParticipantById(participantA.id)).not.toBeNull();
            expect(lottery.getParticipantById(participantA.id).name).equals(participantA.name);
        });

        it('checks, that participant is not lucky one', () => {
            const lottery = useLotteryStore();
            lottery.addParticipant('a');
            const participantB = lottery.addParticipant('b');

            expect(lottery.isLuckyOne(participantB.id)).toBeFalsy();
        });

        it('adds lucky one', () => {
            const lottery = useLotteryStore();
            lottery.addParticipant('a');
            const participantB = lottery.addParticipant('b');
            lottery.addLuckyOne(participantB.id);

            expect(lottery.isLuckyOne(participantB.id)).toBeTruthy();
        });
    });
    describe('Store data types', () => {
        beforeEach(() => {
            vi.restoreAllMocks();
            setActivePinia(createPinia());
            window.localStorage.clear();
        });

        it('should maintain date types', () => {
            let lottery = useLotteryStore();
            lottery.addParticipant('a');
            const participantB = lottery.addParticipant('b');
            lottery.addLuckyOne(participantB.id);
            expect(participantB.wonDate).not.null;

            lottery = useLotteryStore();
            expect(lottery.allParticipants).to.have.length(2);
            expect(participantB.wonDate).not.null;
            expect(participantB.wonDate).equals(lottery.getParticipantById(participantB.id).wonDate);
        });
    });
});
