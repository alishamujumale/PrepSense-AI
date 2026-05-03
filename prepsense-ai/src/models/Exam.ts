import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IExam extends Document {
  userId:   mongoose.Types.ObjectId
  name:     string
  board:    string
  stream:   string
  standard: string
  subjects: string[]
  examDate: Date
  isActive: boolean
  createdAt: Date
}

const ExamSchema = new Schema<IExam>({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:     { type: String, required: true },
  board:    { type: String, required: true },
  stream:   { type: String, required: true },
  standard: { type: String, required: true },
  subjects: [{ type: String }],
  examDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

const Exam: Model<IExam> =
  mongoose.models.Exam ?? mongoose.model<IExam>('Exam', ExamSchema)

export default Exam