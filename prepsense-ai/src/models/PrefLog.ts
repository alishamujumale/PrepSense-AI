import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPerfLog extends Document {
  userId:    mongoose.Types.ObjectId
  examId:    mongoose.Types.ObjectId
  subject:   string
  topic:     string
  score:     number        // 0-10
  maxScore:  number
  mode:      'exam' | 'practice'
  createdAt: Date
}

const PerfLogSchema = new Schema<IPerfLog>({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  examId:   { type: Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
  subject:  { type: String, required: true },
  topic:    { type: String, required: true },
  score:    { type: Number, required: true },
  maxScore: { type: Number, required: true },
  mode:     { type: String, enum: ['exam','practice'], default: 'practice' },
}, { timestamps: true })

const PerfLog: Model<IPerfLog> =
  mongoose.models.PerfLog ?? mongoose.model<IPerfLog>('PerfLog', PerfLogSchema)

export default PerfLog