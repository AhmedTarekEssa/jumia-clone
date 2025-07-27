
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
  private hubUrl = `http://localhost:5087/chathub` // Ensure this is correct
  private hubConnection!: HubConnection;
  public newMessage$ = new BehaviorSubject<any>(null);
  public chatClosed$ = new BehaviorSubject<any>(null);
  public newChatRequest$ = new BehaviorSubject<Chat | null>(null); // For admin to receive new chat requests
  public chatAssigned$ = new BehaviorSubject<Chat | null>(null); // For admin to know chat is assigned
  public chatAssignedToAdmin$ = new BehaviorSubject<Chat | null>(null); // For all admins to see assignments
  public chatClosedByAdmin$ = new BehaviorSubject<Chat | null>(null); // For admins to see chats closed by other admins

  constructor(private http: HttpClient) { }

  startConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect() // Add automatic reconnect
      .build();

    this.hubConnection.start()
      .then(() => console.log("SignalR connected"))
      .catch((err: any) => console.error('SignalR connection error', err));

    this.hubConnection.on('ReceiveMessage', (message: any) => this.newMessage$.next(message));
    this.hubConnection.on('ChatClosed', (chat: any) => this.chatClosed$.next(chat));
    this.hubConnection.on('NewChatCreated', (chat: Chat) => this.newChatRequest$.next(chat)); // Listen for new chat requests
    this.hubConnection.on('ChatAssigned', (chat: Chat) => this.chatAssigned$.next(chat)); // Listen for chat assignments (specific user/admin)
    this.hubConnection.on('ChatAssignedToAdmin', (chat: Chat) => this.chatAssignedToAdmin$.next(chat)); // Listen for chat assignments (all admins)
    this.hubConnection.on('ChatClosedByAdmin', (chat: Chat) => this.chatClosedByAdmin$.next(chat)); // Listen for chats closed by other admins
    this.hubConnection.on('ForceLeaveChatGroup', (chatId: string) => this.leaveChatGroup(chatId)); // Instruct client to leave group
  }

  async joinChatGroup(conversationId: string) {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      console.warn('hubConnection not connected. Starting connection...');
      await this.startConnection();
      // Wait for connection to be in Connected state
      while (this.hubConnection.state !== HubConnectionState.Connected) {
        console.log('Waiting for SignalR to connect...');
        await new Promise(resolve => setTimeout(resolve, 100)); // wait 100ms
      }
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
    if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected) {
      return this.hubConnection.invoke('LeaveChatGroup', chatId);
    } else {
      return Promise.resolve(); // Or throw an error if connection is required
    }
  }

  markMessagesAsRead(chatId: string) {
    if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected) {
      return this.hubConnection.invoke('MarkMessagesAsRead', chatId);
    } else {
      return Promise.resolve();
    }
  }


  // Rest Api

  createChat(): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}${environment.Chat.createchat}`, { initialMessage: "Hi there" }, { withCredentials: true });
  }

  getChatById(id: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}${environment.Chat.getChatById(id)}`, { withCredentials: true });
  }

  getAllChatsByUserId(userId: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}${environment.Chat.getAllChatsByUserId(userId)}`, { withCredentials: true });
  }

  getMyChat(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}${environment.Chat.getmychat}`, { withCredentials: true });
  }

  getActiveChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}${environment.Chat.getactivechat}`, { withCredentials: true });
  }

  getAdminChats(adminId: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}${environment.Chat.getadminchat(adminId)}`, { withCredentials: true });
  }

  getMyAdminChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}${environment.Chat.getmyadminchat}`, { withCredentials: true });
  }

  sendMessage(messageData: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}${environment.Chat.sendmessage}`, messageData, { withCredentials: true });
  }

  getMessagesByChatId(chatId: string, page: number = 1, pageSize: number = 50): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.apiUrl}${environment.Chat.getmessagesByChatId(chatId, page, pageSize)}`, { withCredentials: true }
    );
  }

  // Admin Specific API calls (using SignalR invoke for real-time actions)
  assignChatToAdmin(chatId: string) {
    if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected) {
      return this.hubConnection.invoke('AssignChat', chatId);
    } else {
      console.error("SignalR connection not established for AssignChat.");
      return Promise.reject("SignalR not connected.");
    }
  }

  closeChatAsAdmin(chatId: string) {
    if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected) {
      return this.hubConnection.invoke('CloseChat', chatId);
    } else {
      console.error("SignalR connection not established for CloseChat.");
      return Promise.reject("SignalR not connected.");
    }
  }
}
