import BasicRandomGenerator from "@/services/BasicRandomGenerator";
import RandomOrgGenerator from "@/services/RandomOrgGenerator";

export const getRandomGenerator = () => {
    // return new BasicRandomGenerator();
    return new RandomOrgGenerator();
};

