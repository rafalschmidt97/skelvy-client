export interface ChatMessage {
  date: Date;
  message: string;
  userId: number;
}

export interface ChatModel {
  messagesToRead: number;
  messages: ChatMessage[];
}
