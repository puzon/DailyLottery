import axios from "axios";
import BasicRandomGenerator from "@/services/BasicRandomGenerator";

export default class RandomOrgGenerator {
    /** type {axios} */
    client;

    constructor() {
        this.fallbackGenerator = new BasicRandomGenerator();
        this.client = axios.create({
            baseURL: 'https://www.random.org',
            timeout: 1000,
            params: {
                format: 'plain',
            }
        });
    }

    async getRandomNumber(from = 0, to = Number.MIN_SAFE_INTEGER) {

        const response = await this.client.get('/integers/', {
            params: {
                num: 1,
                min: from,
                max: to,
                col: 1,
                base: 10,
                rnd: 'new',
            },
        });

        console.log(response);

        if (response.data === null) {
            return this.fallbackGenerator.getRandomNumber(from, to);
        }

        return parseInt(response.data);
    }

    async shuffleArray(data) {
        const response = await this.client.get('/sequences/', {
            params: {
                min: 0,
                max: data.length - 1,
                col: 1,
                rnd: 'new',
            },
        });

        if (!response.data) {
            return this.fallbackGenerator.shuffleArray(data);
        }

        const indexes = response.data.trim().split('\n');
        return indexes.map((index) => {
            return data[index];
        });
    }
};
