import { CommonModule } from '@angular/common';
import {Component,OnInit,OnDestroy,ChangeDetectorRef,inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../../core/services/Livechatservice/chat-service';
import { Chat } from '../../../../shared/models/Livechatmodels/chat';
import { Message } from '../../../../shared/models/Livechatmodels/message';
import { SendMessageRequest } from '../../../../shared/models/Livechatmodels/send-message-request';

// import { ChatService } from '../';
// import { Chat }        from '../../models/Livechatmodels/chat';
// import { Message }     from '../../models/Livechatmodels/message';
// import { SendMessageRequest } from '../../models/Livechatmodels/send-message-request';
@Component({
  selector: 'app-seller-live-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-live-chat.html',
  styleUrl: './seller-live-chat.css'
})
export class SellerLiveChat implements OnInit, OnDestroy {
  // Views: list of chats or active conversation
  currentView: 'list' | 'conversation' = 'list';

  // Data models
  conversations: Chat[]       = [];
  selectedConversation: Chat | null = null;
  messages: Message[]         = [];
  newMessage = '';

  // Services & utilities
  private chatService = inject(ChatService);
  private cdr         = inject(ChangeDetectorRef);
  private subs        = new Subscription();

  ngOnInit(): void {
    // Start SignalR connection
    this.chatService.startConnection();

    // Load initial chat list
    this.subs.add(
      this.chatService.getMyChat().subscribe({
        next: data => {
          this.conversations = data;
          this.cdr.detectChanges();
        },
        error: err => console.error('Error loading seller chats:', err)
      })
    );

    // Listen for incoming messages
    this.subs.add(
      this.chatService.newMessage$.subscribe(msg => {
        if (this.selectedConversation?.id === msg.chatId) {
          this.messages.push(msg);
          this.cdr.detectChanges();
        }
      })
    );

    // Listen for chats closed by admin
    this.subs.add(
      this.chatService.chatClosed$.subscribe(closed => {
        // If the open chat was closed, go back to list
        if (this.selectedConversation?.id === closed.id) {
          alert('This chat has been closed by admin.');
          this.backToList();
        }
        // Update status in list
        const idx = this.conversations.findIndex(c => c.id === closed.id);
        if (idx > -1) {
          this.conversations[idx].status = closed.status;
          this.cdr.detectChanges();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    // Optionally: this.chatService.stopConnection();
  }

  // Load all messages for the selected chat
  loadMessages(): void {
    if (!this.selectedConversation?.id) return;

    this.chatService.getMessagesByChatId(this.selectedConversation.id).subscribe({
      next: msgs => {
        this.messages = msgs;
        this.cdr.detectChanges();
        this.chatService.markMessagesAsRead(this.selectedConversation!.id);
      },
      error: err => console.error('Error loading messages:', err)
    });
  }

  // Send a text message
  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation?.id) return;

    const payload: SendMessageRequest = {
      chatId: this.selectedConversation.id,
      message: this.newMessage,
      type: 'Text'
    };

    // Optimistic update
    const temp: Message = {
      id: 'temp-' + Date.now(),
      chatId: this.selectedConversation.id,
      senderId: 'seller',
      senderName: 'You',
      message: this.newMessage,
      type: 'Text',
      isFromAdmin: false,
      sentAt: new Date().toLocaleString(),
      isRead: false
    };
    this.messages.push(temp);
    this.cdr.detectChanges();

    this.chatService.sendMessage(payload).subscribe({
      next: msg => {
        const i = this.messages.findIndex(m => m.id === temp.id);
        if (i > -1) this.messages[i] = msg;
        else if (!this.messages.some(m => m.id === msg.id)) {
          this.messages.push(msg);
        }
        this.newMessage = '';
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Send failed:', err);
        this.messages = this.messages.filter(m => m.id !== temp.id);
        this.cdr.detectChanges();
      }
    });
  }

  // Start a new chat
  startNewConversation(): void {
    this.chatService.createChat().subscribe({
      next: async chat => {
        this.selectedConversation = chat;
        this.currentView = 'conversation';
        this.messages = [];
        await this.chatService.joinChatGroup(chat.id);
        this.loadMessages();
        this.cdr.detectChanges();
      },
      error: err => console.error('Start chat failed:', err)
    });
  }

  // Open existing conversation
  openConversation(chat: Chat): void {
    this.selectedConversation = chat;
    this.currentView = 'conversation';
    this.chatService.joinChatGroup(chat.id);

    this.chatService.getMessagesByChatId(chat.id).subscribe({
      next: msgs => {
        this.messages = msgs;
        this.chatService.markMessagesAsRead(chat.id);
        this.cdr.detectChanges();
      },
      error: err => console.error('Load conversation failed:', err)
    });
  }

  // Back to list view
  backToList(): void {
    if (this.selectedConversation?.id) {
      this.chatService.leaveChatGroup(this.selectedConversation.id);
    }
    this.currentView = 'list';
    this.selectedConversation = null;
    this.messages = [];
    this.cdr.detectChanges();

    // Refresh chat list
    this.chatService.getMyChat().subscribe({
      next: data => {
        this.conversations = data;
        this.cdr.detectChanges();
      }
    });
  }

  // Close and start new
  startNewConversationFromChat(): void {
    this.backToList();
    this.startNewConversation();
  }
}
