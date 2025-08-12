"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

export interface InterviewFormData {
  targetRole: string
  yearsOfExperience: string
  topicsToFocus: string
  description: string
}

export interface InterviewQuestion {
  id: string
  question: string
  answer: string
  category: string
}

export interface InterviewSession {
  id: string
  targetRole: string
  yearsOfExperience: string
  topicsToFocus: string
  description: string
  questions: InterviewQuestion[]
  createdAt: Date
  pinned?: boolean
}

export async function generateInterviewQuestions(formData: InterviewFormData): Promise<InterviewSession> {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("Gemini API key is not set in environment variables")
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: "You are an expert interview coach. Generate exactly 8 realistic, relevant interview questions with comprehensive answers. Respond with a valid JSON array only, containing objects with 'question', 'answer', and 'category' fields. Do not include markdown, backticks, or any text outside the JSON array. Example: [{\"question\": \"Example question\", \"answer\": \"Example answer\", \"category\": \"Technical\"}]"
    })

    const prompt = `Generate exactly 8 interview questions with detailed answers for the following role:

Role: ${formData.targetRole}
Experience Level: ${formData.yearsOfExperience}
Topics to Focus: ${formData.topicsToFocus}
Additional Context: ${formData.description || "None"}

Provide questions appropriate for the experience level, covering the specified topics. Include a mix of:
- 3 Technical questions (e.g., coding, tools like ${formData.topicsToFocus})
- 2 Behavioral questions (e.g., teamwork, conflict resolution)
- 2 Problem-solving scenarios (e.g., system design, debugging)
- 1 Role-specific question (e.g., specific to ${formData.targetRole})

Each question must have:
- question: the interview question (string)
- answer: a comprehensive answer with examples (string, at least 100 words)
- category: one of Technical, Behavioral, Problem-Solving, Role-Specific (string)

Return a JSON array only, e.g., [{"question": "...", "answer": "...", "category": "..."}, ...].`;

    const maxRetries = 3
    let questions: InterviewQuestion[] = []
    let attempt = 0

    while (attempt <= maxRetries && questions.length < 8) {
      try {
        const result = await model.generateContent(prompt)
        const text = result.response.text().trim()
        console.log("Raw Gemini API response:", text)
        console.log("Attempt:", attempt + 1, "Response length:", text.length)

        // Clean response if wrapped in markdown
        let cleanedText = text
        if (text.startsWith("```json")) {
          cleanedText = text.slice(7, -3).trim()
          console.log("Cleaned response (removed markdown):", cleanedText)
        } else if (text.startsWith("```") && text.endsWith("```")) {
          cleanedText = text.slice(3, -3).trim()
          console.log("Cleaned response (removed generic markdown):", cleanedText)
        }

        const parsedQuestions = JSON.parse(cleanedText)
        if (!Array.isArray(parsedQuestions)) {
          throw new Error("Response is not an array")
        }
        if (parsedQuestions.length < 8) {
          console.warn(`Insufficient questions (${parsedQuestions.length}), retrying...`)
          throw new Error(`Insufficient questions (${parsedQuestions.length})`)
        }
        questions = parsedQuestions.map((q: any, index: number) => {
          if (!q.question || !q.answer || !q.category) {
            console.warn(`Invalid question object at index ${index}:`, q)
            return {
              id: `q-${Date.now()}-${index}`,
              question: q.question || "Missing question",
              answer: q.answer || "No answer provided",
              category: q.category || "General",
            }
          }
          return {
            id: `q-${Date.now()}-${index}`,
            question: q.question,
            answer: q.answer,
            category: q.category,
          }
        })
        console.log("Parsed questions:", questions)
        break
      } catch (parseError) {
        console.error(`Attempt ${attempt + 1} failed:`, parseError)
        attempt++
        if (attempt > maxRetries) {
          console.error("Max retries reached, using fallback")
          questions = [
            {
              id: `q-${Date.now()}-1`,
              question: `Describe your experience using ${formData.topicsToFocus} in a ${formData.targetRole} role.`,
              answer: `Use the STAR method (Situation, Task, Action, Result) to structure your response. Describe a specific project where you applied ${formData.topicsToFocus}. For example, outline the situation, your responsibilities, the actions you took (e.g., writing Python code for a machine learning model), and the results achieved (e.g., improved model accuracy). Highlight your ${formData.yearsOfExperience} years of experience and any challenges overcome, such as optimizing SQL queries or deploying models.`,
              category: "Technical",
            },
            {
              id: `q-${Date.now()}-2`,
              question: `How do you handle imbalanced datasets in ${formData.topicsToFocus}?`,
              answer: `Discuss techniques for handling imbalanced datasets, such as oversampling (e.g., SMOTE), undersampling, or using class weights in machine learning models. Provide an example where you encountered an imbalanced dataset in a ${formData.targetRole} role. Describe the situation, the task (e.g., improving model performance), the actions you took (e.g., applying SMOTE in Python), and the results (e.g., improved F1-score). Emphasize best practices like cross-validation and monitoring for bias.`,
              category: "Technical",
            },
            {
              id: `q-${Date.now()}-3`,
              question: `Explain how you would deploy a machine learning model in production.`,
              answer: `Describe the process of deploying a machine learning model, including model training, serialization (e.g., using joblib or pickle in Python), and serving via an API (e.g., Flask, FastAPI). Discuss considerations like scalability, monitoring, and version control. Provide an example from your experience or a hypothetical scenario where you deployed a model, detailing the tools used, challenges like latency, and how you ensured reliability in production.`,
              category: "Role-Specific",
            },
            {
              id: `q-${Date.now()}-4`,
              question: `How do you optimize SQL queries for large datasets?`,
              answer: `Explain techniques for optimizing SQL queries, such as indexing, avoiding SELECT *, and using JOINs efficiently. Provide an example where you optimized a query in a ${formData.targetRole} role. Describe the situation (e.g., slow query performance), the task, the actions (e.g., adding indexes, rewriting subqueries), and the result (e.g., reduced query time). Highlight your experience with ${formData.topicsToFocus} and any tools like query analyzers.`,
              category: "Technical",
            },
            {
              id: `q-${Date.now()}-5`,
              question: `Describe a time you worked in a team to solve a problem related to ${formData.topicsToFocus}.`,
              answer: `Use the STAR method to describe a team project involving ${formData.topicsToFocus}. Outline the situation (e.g., a project requiring machine learning), your task, the actions you took (e.g., collaborating on model development), and the result (e.g., successful project delivery). Highlight your role, communication skills, and how you contributed to the team’s success in your ${formData.yearsOfExperience} years of experience.`,
              category: "Behavioral",
            },
            {
              id: `q-${Date.now()}-6`,
              question: `Tell me about a time you faced a conflict in a ${formData.targetRole} project.`,
              answer: `Use the STAR method to describe a conflict in a ${formData.targetRole} project. Explain the situation (e.g., disagreement on model selection), your task, the actions you took (e.g., facilitating discussion, presenting data-driven arguments), and the result (e.g., team consensus). Emphasize your conflict resolution skills and how you ensured project progress, drawing on your ${formData.yearsOfExperience} years of experience.`,
              category: "Behavioral",
            },
            {
              id: `q-${Date.now()}-7`,
              question: `How would you design a system to handle real-time predictions using ${formData.topicsToFocus}?`,
              answer: `Describe a system design for real-time predictions, including data ingestion, model serving, and monitoring. For example, use Python with FastAPI for an API, a trained ML model, and a database like PostgreSQL for data storage. Discuss scalability (e.g., load balancing), latency, and error handling. Provide a hypothetical scenario or past experience, detailing the components and how you ensured reliability in production.`,
              category: "Problem-Solving",
            },
            {
              id: `q-${Date.now()}-8`,
              question: `How would you debug a machine learning model that’s underperforming in production?`,
              answer: `Outline a systematic approach to debugging a machine learning model, including checking data quality, model metrics, and deployment issues. For example, verify input data consistency, retrain with updated data, or adjust hyperparameters. Provide a scenario where you debugged a model in a ${formData.targetRole} role, detailing the actions (e.g., analyzing feature importance) and results (e.g., improved accuracy). Highlight tools like Python’s logging or monitoring systems.`,
              category: "Problem-Solving",
            },
          ]
        }
      }
    }

    const session: InterviewSession = {
      id: `session-${Date.now()}`,
      targetRole: formData.targetRole,
      yearsOfExperience: formData.yearsOfExperience,
      topicsToFocus: formData.topicsToFocus,
      description: formData.description,
      questions,
      createdAt: new Date(),
      pinned: false
    }

    console.log("Generated session:", session)
    return session
  } catch (error) {
    console.error("Error generating interview questions with Gemini:", error)
    throw new Error("Failed to generate interview questions")
  }
}