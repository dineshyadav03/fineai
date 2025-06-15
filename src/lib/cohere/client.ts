import { CohereClient } from 'cohere-ai';

const cohereApiKey = process.env.COHERE_API_KEY!;

const cohere = new CohereClient({
    token: cohereApiKey,
});

export { cohere }; 