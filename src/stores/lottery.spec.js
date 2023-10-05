import {createPinia, setActivePinia} from "pinia";
import {useLotteryStore} from "@/stores/lottery";
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {getRandomGenerator} from "@/services/RandomGeneratorFactory";

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

    describe('Randomizing', () => {
        beforeEach(() => {
            vi.restoreAllMocks();
            setActivePinia(createPinia());
        });

        it('should return randomized participants to choose', () => {
            vi.mock('@/services/RandomGeneratorFactory', () => {
                return {
                    getRandomGenerator: vi.fn(),
                }
            });
            const mockRandomGenerator ={
                getRandomNumber: vi.fn(),
                shuffleArray: vi.fn(),
            };
            vi.mocked(getRandomGenerator).mockReturnValue(mockRandomGenerator);
            vi.mocked(mockRandomGenerator.shuffleArray).mockReturnValue(['mockedReturn']);

            let lottery = useLotteryStore();
            lottery.ticketsForParticipant = 2;

            const participantA = lottery.addParticipant('a');
            const participantB = lottery.addParticipant('b');
            const participants = [
                participantA,
                participantA,
                participantB,
                participantB,
            ];

            const participantsToChoose = lottery.getRandomizedParticipantsToChoose();

            expect(getRandomGenerator().shuffleArray).toHaveBeenCalledOnce();
            expect(getRandomGenerator().shuffleArray).toBeCalledWith(participants);
            expect(participantsToChoose).toEqual(['mockedReturn']);
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
