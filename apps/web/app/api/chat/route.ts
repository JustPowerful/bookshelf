import { NextRequest, NextResponse } from "next/server";
import { OllamaEmbeddings, ChatOllama } from "@langchain/ollama";
import { db } from "@repo/database";
import { documents } from "@repo/database";
import { eq, sql } from "@repo/database";

import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function POST(req: NextRequest) {
  try {
    const { bookshelfId, question } = await req.json();

    if (!bookshelfId || !question) {
      return new NextResponse(
        JSON.stringify({ error: "Bookshelf ID and question are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const embeddings = new OllamaEmbeddings({
      maxRetries: 2,
    });
    const chatModel = new ChatOllama({
      model: "tinyllama",
    });

    const questionEmbedding = await embeddings.embedQuery(question);

    const similarDocs = await db
      .select()
      .from(documents)
      .where(eq(documents.bookshelfId, bookshelfId))
      .orderBy(sql`"embedding" <-> ${JSON.stringify(questionEmbedding)}`)
      .limit(5);

    const context = similarDocs.map((doc) => doc.content).join("\n\n");

    const promptTemplate = PromptTemplate.fromTemplate(`
      You are a helpful AI assistant that answers questions based on the given context.
      Use the following context to answer the question:
      {context}

      Question: {question}

      If you cannot find the answer in the context, say "I don't have enough information to answer that question."
      Answer:
    `);

    const chain = RunnableSequence.from([
      promptTemplate,
      chatModel,
      new StringOutputParser(),
    ]);

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    chain
      .stream({
        context: context,
        question: question,
      })
      .then(async (streamingResponse) => {
        for await (const chunk of streamingResponse) {
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
          );
        }
        await writer.write(encoder.encode("data: [DONE]\n\n"));
        await writer.close();
      })
      .catch(async (error) => {
        console.error("Error in streaming response:", error);
        await writer.abort(error);
      });

    return new NextResponse(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error chatting with bookshelf:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to process your question",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
