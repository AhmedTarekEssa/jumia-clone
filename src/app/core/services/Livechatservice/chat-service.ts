
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Chat } from '../../../shared/models/Livechatmodels/chat';
import { SendMessageRequest } from '../../../shared/models/Livechatmodels/send-message-request';
import { Message } from '../../../shared/models/Livechatmodels/message';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.BaseUrlPath}`;
  private hubUrl = `http://localhost:5087/chathub`
  private hubConnection!: HubConnection;
  public newMessage$ = new BehaviorSubject<any>(null);
  public chatClosed$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  startConnection(){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .build();

    this.hubConnection.start()
      .then(()=>console.log("signalr connected"))
      .catch((err: any)=> console.error('signalr error' , err));

    this.hubConnection.on('ReceiveMessage',(message: any)=>this.newMessage$.next(message));

    this.hubConnection.on('ChatClosed',(chat: any)=>this.chatClosed$.next(chat));
  }

  async joinChatGroup(conversationId: string) {
  if (!this.hubConnection) {
    console.warn('hubConnection is undefined. Starting connection...');
    await this.startConnection();
  }

  // Wait for connection to be in Connected state
  while (this.hubConnection.state !== HubConnectionState.Connected) {
    console.log('Waiting for SignalR to connect...');
    await new Promise(resolve => setTimeout(resolve, 100)); // wait 100ms
  }

  try {
    console.log(`Joining group: ${conversationId}`);
    await this.hubConnection.invoke("JoinChatGroup", conversationId);
    console.log(`Successfully joined group: ${conversationId}`);
  } catch (err) {
    console.error('Failed to join group', err);
  }
}

  leaveChatGroup(chatId: string) {
    return this.hubConnection.invoke('LeaveChatGroup', chatId);
  }

  markMessagesAsRead(chatId: string) {
    return this.hubConnection.invoke('MarkMessagesAsRead', chatId);
  }


// Rest Api  

  createChat(): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}${environment.Chat.createchat}`,{ initialMessage: "Hi there" },{withCredentials:true});
  }

  getChatById(id: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}${environment.Chat.getChatById(id)}`,{withCredentials:true});
  }

  getAllChatsByUserId(userId: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}${environment.Chat.getAllChatsByUserId(userId)}`,{withCredentials:true});
  }

  getMyChat(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}${environment.Chat.getmychat}`,{withCredentials:true});
  }

  getActiveChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}${environment.Chat.getactivechat}`,{withCredentials:true});
  }

  getAdminChats(adminId: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}${environment.Chat.getadminchat(adminId)}`,{withCredentials:true});
  }

  getMyAdminChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}${environment.Chat.getmyadminchat}`,{withCredentials:true});
  }

  sendMessage(messageData: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}${environment.Chat.sendmessage}`, messageData,{withCredentials:true});
  }

  getMessagesByChatId(chatId: string, page: number = 1, pageSize: number = 50): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.apiUrl}${environment.Chat.getmessagesByChatId(chatId, page, pageSize)}`,{withCredentials:true}
    );
  }

  assignToChat(chatId: string): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}${environment.Chat.assignToChat(chatId)}`, {},{withCredentials:true});
  }

  closeChat(chatId: string): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}${environment.Chat.closeChat(chatId)}`, {},{withCredentials:true});
  }

  markChatAsRead(chatId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}${environment.Chat.markChatAsRead(chatId)}`, {},{withCredentials:true});
  }
}
