
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Chat } from '../../../shared/models/Livechatmodels/chat';
import { SendMessageRequest } from '../../../shared/models/Livechatmodels/send-message-request';
import { Message } from '../../../shared/models/Livechatmodels/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.BaseUrlPath}`;

  constructor(private http: HttpClient) { }

  createChat(): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}${environment.Chat.createchat}`, {});
  }

  getChatById(id: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}${environment.Chat.getChatById(id)}`);
  }

  getAllChatsByUserId(userId: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}${environment.Chat.getAllChatsByUserId(userId)}`);
  }

  getMyChat(): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}${environment.Chat.getmychat}`);
  }

  getActiveChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}${environment.Chat.getactivechat}`);
  }

  getAdminChats(adminId: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}${environment.Chat.getadminchat(adminId)}`);
  }

  getMyAdminChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}${environment.Chat.getmyadminchat}`);
  }

  sendMessage(messageData: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}${environment.Chat.sendmessage}`, messageData);
  }

  getMessagesByChatId(chatId: string, page: number = 1, pageSize: number = 50): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.apiUrl}${environment.Chat.getmessagesByChatId(chatId, page, pageSize)}`
    );
  }

  assignToChat(chatId: string): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}${environment.Chat.assignToChat(chatId)}`, {});
  }

  closeChat(chatId: string): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}${environment.Chat.closeChat(chatId)}`, {});
  }

  markChatAsRead(chatId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}${environment.Chat.markChatAsRead(chatId)}`, {});
  }
}
