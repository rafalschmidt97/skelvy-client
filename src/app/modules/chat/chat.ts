export interface ChatMessageDto {
  date: Date;
  message: string;
  userId: number;
}

export interface ChatModel {
  messagesToRead: number;
  page: number;
  messages: ChatMessageDto[];
}
