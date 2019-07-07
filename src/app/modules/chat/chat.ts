export interface ChatMessageDto {
  id: number;
  date: string;
  message: string;
  userId: number;
}

export interface ChatMessageState {
  id?: number;
  date: string;
  message: string;
  userId: number;
  sending?: boolean;
  failed?: boolean;
}

export interface ChatMessageRequest {
  date: string;
  message: string;
  userId: number;
}
