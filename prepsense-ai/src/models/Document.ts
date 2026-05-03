import mongoose, { Schema, Document as MongoDoc, Model } from 'mongoose'

export type DocType = 'notes' | 'pyq' | 'syllabus'

export interface IDocument extends MongoDoc {
  userId:           mongoose.Types.ObjectId
  examId:           mongoose.Types.ObjectId
  subject:          string
  type:             DocType
  originalName:     string
  filePath:         string
  chromaCollection: string
  chunkCount:       number
  isProcessed:      boolean
  createdAt:        Date
}

const DocumentSchema = new Schema<IDocument>({
  userId:           { type: Schema.Types.ObjectId, ref: 'User',  required: true, index: true },
  examId:           { type: Schema.Types.ObjectId, ref: 'Exam',  required: true, index: true },
  subject:          { type: String, required: true },
  type:             { type: String, enum: ['notes','pyq','syllabus'], required: true },
  originalName:     { type: String, required: true },
  filePath:         { type: String, required: true },
  chromaCollection: { type: String, required: true },
  chunkCount:       { type: Number, default: 0 },
  isProcessed:      { type: Boolean, default: false },
}, { timestamps: true })

const DocumentModel: Model<IDocument> =
  mongoose.models.Document ??
  mongoose.model<IDocument>('Document', DocumentSchema)

export default DocumentModel