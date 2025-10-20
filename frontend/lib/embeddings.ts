import { OpenAIEmbeddings } from "@langchain/openai";

// Initialize the OpenAI embedding model
const embeddingModel = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  dimensions: 1536,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export interface EmbeddingResult {
  embeddings: number[];
  similarity: number;
  isSimilar: boolean;
}

export class EmbeddingService {
  private static instance: EmbeddingService;
  private similarityThreshold = 0.75; // 75% similarity threshold

  static getInstance(): EmbeddingService {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService();
    }
    return EmbeddingService.instance;
  }

  /**
   * Generate embeddings for a given text
   */
  async getEmbeddings(text: string): Promise<number[]> {
    try {
      const embeddings = await embeddingModel.embedQuery(text);
      return embeddings;
    } catch (error) {
      console.error("Error generating embeddings:", error);
      throw new Error("Failed to generate embeddings");
    }
  }

  /**
   * Calculate cosine similarity between two embedding vectors
   */
  calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error("Vectors must have the same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Compare two texts using vector embeddings
   */
  async compareTexts(text1: string, text2: string): Promise<EmbeddingResult> {
    try {
      const [embeddings1, embeddings2] = await Promise.all([
        this.getEmbeddings(text1),
        this.getEmbeddings(text2)
      ]);

      const similarity = this.calculateCosineSimilarity(embeddings1, embeddings2);
      const isSimilar = similarity >= this.similarityThreshold;

      return {
        embeddings: embeddings1, // Return the guess embeddings
        similarity,
        isSimilar
      };
    } catch (error) {
      console.error("Error comparing texts:", error);
      throw new Error("Failed to compare texts");
    }
  }

  /**
   * Set the similarity threshold
   */
  setSimilarityThreshold(threshold: number): void {
    this.similarityThreshold = Math.max(0, Math.min(1, threshold));
  }

  /**
   * Get the current similarity threshold
   */
  getSimilarityThreshold(): number {
    return this.similarityThreshold;
  }
}

// Export singleton instance
export const embeddingService = EmbeddingService.getInstance();

// Utility function for easy use
export async function comparePrompts(guess: string, actualPrompt: string): Promise<EmbeddingResult> {
  return embeddingService.compareTexts(guess, actualPrompt);
}
