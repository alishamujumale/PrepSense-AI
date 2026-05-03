# PrepSense AI

## RAG-Powered Study Intelligence System

PrepSense AI is an intelligent, full-stack learning platform that leverages Retrieval-Augmented Generation (RAG) to transform academic documents into structured, exam-focused insights. The system is designed to assist students in optimizing their preparation through semantic search, data-driven topic analysis, and personalized study planning.

---

## Overview

PrepSense AI goes beyond traditional document-based chat systems by integrating retrieval, analysis, and planning into a unified workflow. It enables users to upload academic materials such as notes, previous year question papers (PYQs), and syllabi, and converts them into actionable study intelligence.

The platform emphasizes:

* Context-aware learning
* Exam-oriented preparation
* Data-driven prioritization
* Personalized feedback and planning

---

## Key Capabilities

### Document Ingestion and Processing

* Supports PDF, PPT, and DOC formats
* Extracts and preprocesses textual data
* Performs semantic chunking for improved retrieval accuracy
* Applies metadata tagging (subject, topic, document type)

### Semantic Search (RAG Engine)

* Enables natural language querying over uploaded documents
* Retrieves relevant context using vector similarity search
* Generates grounded responses using local LLMs
* Formats answers based on academic requirements (short, medium, long answers)

### PYQ Analysis Engine

* Extracts and parses previous year questions
* Identifies recurring topics using NLP techniques
* Computes frequency-based importance scores

Outputs:

* Ranked list of important topics
* Identification of high-probability exam questions

### Personalized Study Planner

* Generates adaptive study schedules based on:

  * Exam timeline
  * Topic importance
  * User-specific weak areas
  * Available study hours

Includes:

* Day-wise planning
* Revision allocation
* Practice scheduling

### Weakness Detection

* Tracks user interactions and performance
* Identifies frequently revisited or incorrectly answered topics
* Provides targeted recommendations for improvement

### Exam Mode

* Generates structured questions (2, 5, 10 marks)
* Evaluates user responses using LLM-based assessment
* Provides scoring, feedback, and improvement suggestions

### Revision Mode

* Summarizes entire subjects into concise, high-yield content
* Highlights critical concepts and expected questions

### Flashcards Generation

* Automatically converts content into question-answer pairs
* Supports rapid revision workflows

### Multi-Document Reasoning

* Synthesizes information across notes, PYQs, and syllabus
* Enables comparative and analytical queries

---

## System Architecture

### Frontend

* Built with Next.js
* Provides interfaces for document upload, chat interaction, and study dashboards

### Backend

* Implemented using Next.js API routes
* Handles document processing, query execution, and analytics

### AI Pipeline

1. Document parsing
2. Semantic chunking
3. Embedding generation
4. Storage in vector database (ChromaDB)
5. Retrieval of relevant context
6. Response generation via local LLM (Ollama)

### Database

* MongoDB Compass

Collections include:

* Users
* Documents
* Processed chunks
* PYQ topic mappings
* Study plans
* User performance logs

---

## Technology Stack

| Layer        | Technology                     |
| ------------ | ------------------------------ |
| Frontend     | Next.js                        |
| Backend      | Next.js API Routes             |
| Vector Store | ChromaDB                       |
| LLM          | Ollama (Llama 3 or equivalent) |
| Database     | MongoDB Compass                |
| Parsing      | PyMuPDF / pdfplumber           |

---

## Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/your-username/prepsense-ai.git
cd prepsense-ai
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure MongoDB Atlas

* Create a cluster
* Obtain the connection string
* Add to `.env`:

```
MONGODB_URI=your_connection_string
```

### 4. Run Local LLM (Ollama)

```
ollama run llama3
```

### 5. Start ChromaDB

```
chroma run
```

### 6. Start Development Server

```
npm run dev
```

---

## Applications

* Academic exam preparation
* Intelligent revision planning
* PYQ-driven topic prioritization
* Concept clarification and reinforcement
* Self-assessment and feedback

---

## Resume Summary

Developed PrepSense AI, a RAG-based study intelligence platform that enables semantic search, PYQ-driven topic analysis, and personalized study plan generation from academic documents.

---

## Future Enhancements

* Voice-enabled interaction
* Collaborative study environments
* Cloud deployment and scaling
* Advanced spaced repetition algorithms
* Mobile application support

---

## Conclusion

PrepSense AI is designed as a scalable, real-world EdTech system that demonstrates expertise in retrieval-augmented generation, full-stack development, and intelligent system design. It reflects practical application of AI in solving real academic challenges.

---

If you find this project valuable, consider starring the repository.
