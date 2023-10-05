export default class BasicRandomGenerator {
    getRandomNumber(from = 0, to = Number.MIN_SAFE_INTEGER) {
        return from + Math.floor(Math.random() * (to - from));
    }

    shuffleArray(data) {
        if (Array.isArray(data)) {
            for (let i = data.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [data[i], data[j]] = [data[j], data[i]];
            }
        }

        return data;
    }


}
