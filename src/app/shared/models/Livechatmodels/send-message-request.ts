export interface SendMessageRequest {
  chatId?: string; 
  message: string;
  type?: string;
  isFromAdmin?: boolean;
}
