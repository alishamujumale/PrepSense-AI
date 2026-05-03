export interface QueryRequest {
  userId:  string
  examId:  string
  subject: string
  query:   string
  format:  '2mark' | '5mark' | '10mark' | 'explain'
}

export interface QueryResponse {
  answer:       string
  mode:         'rag' | 'curriculum'
  sources:      string[]
  pyqRelevance: number
}

export interface ExamProfile {
  id:       string
  name:     string
  board:    string
  stream:   string
  standard: string
  subjects: string[]
  examDate: string
}

export interface ChunkMetadata {
  userId:      string
  examId:      string
  subject:     string
  docId:       string
  docType:     'notes' | 'pyq' | 'syllabus'
  chunkIndex:  number
  pageNumber?: number
}
