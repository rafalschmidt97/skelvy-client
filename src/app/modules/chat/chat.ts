export interface ChatMessageDto {
  id?: number;
  date: string;
  message: string;
  userId: number;
  sending?: boolean;
  failed?: boolean;
}

export interface ChatModel {
  toRead: number;
  messages: ChatMessageDto[];
}
