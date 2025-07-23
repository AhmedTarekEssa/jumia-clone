import { Message } from "./message";

export interface Chat {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string;
  createdAt: string; 
  closedAt: string;
  adminId: string;
  adminName: string;
  unreadCount: number;
  lastMessage: Message;
}
