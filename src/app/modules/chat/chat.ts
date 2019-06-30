export interface ChatMessageDto {
  date: string;
  message: string;
  userId: number;
  sending?: boolean;
  failed?: boolean;
}

export interface ChatModel {
  messagesToRead: number;
  page: number;
  messages: ChatMessageDto[];
}
