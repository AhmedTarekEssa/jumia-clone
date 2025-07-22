export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  message: string;
  type: string;
  isFromAdmin: boolean;
  sentAt: string; 
  isRead: boolean;
}
