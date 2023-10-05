import BasicRandomGenerator from "@/services/BasicRandomGenerator";

export const getRandomGenerator = () => {
    return new BasicRandomGenerator();
};

