import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/services/Livechatservice/chat-service';
import { Chat } from '../../../shared/models/Livechatmodels/chat';
import { Message } from '../../../shared/models/Livechatmodels/message';
import { Subscription } from 'rxjs';
import { SendMessageRequest } from '../../../shared/models/Livechatmodels/send-message-request';

@Component({
  selector: 'app-admin-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-chat.html',
  styleUrl: './admin-chat.css'
})
export class AdminChat implements OnInit, OnDestroy {
 private chatService = inject(ChatService);
  private cdr = inject(ChangeDetectorRef);

  activeChatRequests: Chat[] = [];
  assignedChats: Chat[] = [];
  selectedChat: Chat | null = null;
  messages: Message[] = [];
  newMessage: string = '';

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.chatService.startConnection(); 
    this.loadActiveChatRequests();
    this.loadMyAdminChats();

    // Subscribe to real-time updates
    this.subscriptions.add(this.chatService.newChatRequest$.subscribe(chat => {
      if (chat && !this.activeChatRequests.some(c => c.id === chat.id)) {
        this.activeChatRequests.push(chat);
        this.cdr.detectChanges();
        console.log('New chat request received:', chat);
      }
    }));


    this.subscriptions.add(this.chatService.chatAssignedToAdmin$.subscribe(chat => {
      if (chat) {
        // Remove from active requests if it was there
        this.activeChatRequests = this.activeChatRequests.filter(c => c.id !== chat.id);
        // Add to assigned chats if it's assigned to THIS admin
        // For simplicity, we'll assume the backend sends "ChatAssignedToAdmin" to all admins.
        // A more robust check might involve comparing chat.AdminId with the current admin's ID.
        if (chat.adminId === /* Get current admin's ID here, e.g., from auth service */ 'currentAdminIdPlaceholder') {
            if(!this.assignedChats.some(c => c.id === chat.id)){
                this.assignedChats.push(chat);
            }
        }
        this.cdr.detectChanges();
        console.log('Chat assigned to an admin:', chat);
      }
    }));

    this.subscriptions.add(this.chatService.chatClosedByAdmin$.subscribe(chat => {
      if (chat) {
        // Remove from active and assigned chats
        this.activeChatRequests = this.activeChatRequests.filter(c => c.id !== chat.id);
        this.assignedChats = this.assignedChats.filter(c => c.id !== chat.id);
        if (this.selectedChat?.id === chat.id) {
          this.selectedChat = null; // Close the active conversation if it was the one closed
          this.messages = [];
        }
        this.cdr.detectChanges();
        console.log('Chat closed by admin:', chat);
      }
    }));

    this.subscriptions.add(this.chatService.newMessage$.subscribe(message => {
      if (this.selectedChat && message && message.chatId === this.selectedChat.id) {
        this.messages.push(message);
        this.cdr.detectChanges();
        console.log('New message in selected chat:', message);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
    onEnterKey(event: KeyboardEvent) {
    if (!event.shiftKey) {
      this.sendMessage();
      this.newMessage = ''; // Clear input after sending
      event.preventDefault();
    }
  }
  // Add this method to your component class
handleKeyDown(event: Event) {
  const keyboardEvent = event as KeyboardEvent;
  if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
    this.sendMessage();
    keyboardEvent.preventDefault();
  }
}



  loadActiveChatRequests(): void {
    this.chatService.getActiveChats().subscribe({
      next: (chats) => {
        this.activeChatRequests = chats.filter(chat => !chat.adminId && chat.status === 'Active'); // Filter for unassigned active chats
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading active chat requests', err)
    });
  }

  loadMyAdminChats(): void {
    this.chatService.getMyAdminChats().subscribe({
      next: (chats) => {
        this.assignedChats = chats.filter(chat => chat.status === 'Active'); // Assigned chats that are still active
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading my assigned chats', err)
    });
  }

  // Admin actions
  assignChat(chat: Chat): void {
    if (chat.id) {
      this.chatService.assignChatToAdmin(chat.id).then(() => {
        console.log(`Chat ${chat.id} assigned.`);
        // The SignalR subscription will update the UI
        // If the assignment is successful and the chat becomes assigned to this admin,
        // it will move from 'activeChatRequests' to 'assignedChats' automatically via SignalR updates.
        this.selectedChat = chat; // Automatically select and open the assigned chat
        this.openChatConversation(chat);
      }).catch(err => console.error('Error assigning chat:', err));
    }
  }

  openChatConversation(chat: Chat): void {
    this.selectedChat = chat;
    if (chat.id) {
      this.chatService.joinChatGroup(chat.id); // Admin joins the specific chat group
      this.chatService.getMessagesByChatId(chat.id).subscribe({
        next: (msgs) => {
          this.messages = msgs;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading chat messages:', err)
      });
      this.chatService.markMessagesAsRead(chat.id); // Mark messages as read when opening
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedChat?.id) return;

    const sendMessageData: SendMessageRequest = {
      message: this.newMessage,
      chatId: this.selectedChat.id,
      type: 'Text' // Assuming default type is Text
    };

    this.chatService.sendMessage(sendMessageData).subscribe({
      next: (msg) => {
        // this.messages.push(msg);
        this.newMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to send message:', err)
    });
  }

  closeChat(): void {
    if (this.selectedChat?.id) {
      this.chatService.closeChatAsAdmin(this.selectedChat.id).then(() => {
        console.log(`Chat ${this.selectedChat!.id} closed.`);
        // SignalR subscription will handle UI update and clear selected chat
      }).catch(err => console.error('Error closing chat:', err));
    }
  }

  backToList(): void {
    if (this.selectedChat?.id) {
      this.chatService.leaveChatGroup(this.selectedChat.id); // Leave the specific chat group
    }
    this.selectedChat = null;
    this.messages = [];
    this.newMessage = '';
    this.loadActiveChatRequests(); // Reload lists to ensure up-to-date status
    this.loadMyAdminChats();
  }
}
