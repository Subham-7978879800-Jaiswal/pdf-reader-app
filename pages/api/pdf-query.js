import {Pinecone } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    console.log("Query PDF");

    // Grab the user prompt
    const { input } = req.body;

    if (!input) {
      throw new Error("No input");
    }

    console.log("input received:", input);

    console.log("1");
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
    console.log("2");

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

    console.log("3");

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex }
    );


    const model = new OpenAI();
    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
      k: 3,
      returnSourceDocuments: true,
    });
    const response = await chain.call({ query: input });

    console.log(response);

    return res.status(200).json({ result: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
