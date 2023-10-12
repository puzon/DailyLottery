export default class BasicRandomGenerator {
    async getRandomNumber(from = 0, to = Number.MIN_SAFE_INTEGER) {
        return new Promise((resolve) => {
            resolve(from + Math.round(Math.random() * (to - from)));
        });
    }

    async shuffleArray(data) {
        return new Promise((resolve) => {
            if (Array.isArray(data)) {
                for (let i = data.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [data[i], data[j]] = [data[j], data[i]];
                }
            }

            resolve(data);
        });
    }
};
