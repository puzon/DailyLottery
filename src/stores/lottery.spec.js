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

        it('removes participant from lucky ones', () => {
            const lottery = useLotteryStore();
            lottery.addParticipant('a');
            const participantB = lottery.addParticipant('b');
            lottery.addLuckyOne(participantB.id);
            expect(lottery.isLuckyOne(participantB.id)).toBeTruthy();

            lottery.removeFromLuckyOnes(participantB.id);
            expect(lottery.isLuckyOne(participantB.id)).toBeFalsy();
        });

        it('should tell if there\'s not enough participants to choose', () => {
            const lottery = useLotteryStore();
            const participantA = lottery.addParticipant('a');
            lottery.addParticipant('b');

            expect(lottery.canChooseLuckyOne).toBeTruthy();
            lottery.addLuckyOne(participantA.id);
            expect(lottery.canChooseLuckyOne).toBeFalsy();
        });
    });

    describe('Randomizing', () => {
        beforeEach(() => {
            vi.restoreAllMocks();
            setActivePinia(createPinia());
        });

        it('should return randomized participants to choose', async () => {
            vi.mock('@/services/RandomGeneratorFactory', () => {
                return {
                    getRandomGenerator: vi.fn(),
                }
            });
            const mockRandomGenerator = {
                getRandomNumber: vi.fn(),
                shuffleArray: vi.fn(),
            };
            vi.mocked(getRandomGenerator).mockReturnValue(mockRandomGenerator);
            vi.mocked(mockRandomGenerator.shuffleArray).mockReturnValue(['mockedReturn']);

            let lottery = useLotteryStore();

            const participants = [
                lottery.addParticipant('a'),
                lottery.addParticipant('b'),
                lottery.addParticipant('c'),
                lottery.addParticipant('d'),
            ]


            const participantsToChoose = await lottery.getRandomizedParticipantsToChoose();

            expect(getRandomGenerator().shuffleArray).toHaveBeenCalledOnce();
            expect(getRandomGenerator().shuffleArray).toBeCalledWith(participants);
            expect(participantsToChoose).toEqual(['mockedReturn']);
        });


        it('should randomize participants to choose in list', async () => {
            vi.mock('@/services/RandomGeneratorFactory', () => {
                return {
                    getRandomGenerator: vi.fn(),
                }
            });
            const mockRandomGenerator = {
                getRandomNumber: vi.fn(),
                shuffleArray: vi.fn(),
            };
            vi.mocked(getRandomGenerator).mockReturnValue(mockRandomGenerator);

            let lottery = useLotteryStore();

            const participants = [
                lottery.addParticipant('a'),
                lottery.addParticipant('b'),
                lottery.addParticipant('c'),
                lottery.addParticipant('d'),
            ];
            vi.mocked(mockRandomGenerator.shuffleArray).mockReturnValue([
                participants[3],
                participants[1],
                participants[2],
                participants[0],
            ]);
            lottery.addLuckyOne(participants[1].id);
            lottery.addLuckyOne(participants[2].id);


            await lottery.randomizeParticipants();

            expect(getRandomGenerator().shuffleArray).toHaveBeenCalledOnce();
            expect(getRandomGenerator().shuffleArray).toBeCalledWith(participants,);
            expect(lottery.participantsToChoose).toEqual([
                participants[3],
                participants[0],
            ]);
        });

        it('should chooses lucky one', async () => {
            vi.mock('@/services/RandomGeneratorFactory', () => {
                return {
                    getRandomGenerator: vi.fn(),
                }
            });
            const mockRandomGenerator = {
                getRandomNumber: vi.fn(),
                shuffleArray: vi.fn(),
            };
            vi.mocked(getRandomGenerator).mockReturnValue(mockRandomGenerator);
            vi.mocked(mockRandomGenerator.getRandomNumber).mockReturnValue(1);

            let lottery = useLotteryStore();

            lottery.addParticipant('a');
            const participantB = lottery.addParticipant('b');

            const chosenLuckyOneId = await lottery.chooseLuckyOne();

            expect(getRandomGenerator().getRandomNumber).toHaveBeenCalledOnce();
            expect(getRandomGenerator().getRandomNumber).toBeCalledWith(0, 1);
            expect(chosenLuckyOneId).toEqual(participantB.id);
        });

        it('start over new lottery with existing participants', async () => {
            vi.mock('@/services/RandomGeneratorFactory', () => {
                return {
                    getRandomGenerator: vi.fn(),
                }
            });
            const mockRandomGenerator = {
                getRandomNumber: vi.fn(),
                shuffleArray: vi.fn(),
            };
            vi.mocked(getRandomGenerator).mockReturnValue(mockRandomGenerator);


            const lottery = useLotteryStore();
            const participantA = lottery.addParticipant('a');
            const participantB = lottery.addParticipant('b');
            vi.mocked(mockRandomGenerator.shuffleArray).mockReturnValue([participantB, participantA]);

            lottery.addLuckyOne(participantA.id);
            expect(lottery.isLuckyOne(participantA.id)).toBeTruthy();
            expect(lottery.participantsToChoose).toHaveLength(1);

            await lottery.startNewLottery();
            expect(lottery.participantsToChoose).toHaveLength(2);
            expect(lottery.participantsToChoose[0].id).toEqual(participantB.id);
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
