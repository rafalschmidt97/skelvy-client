export interface ChatMessage {
  date: Date;
  message: string;
  userId: number;
}

export interface ChatModel {
  messagesSeen: number;
  messages: ChatMessage[];
}
