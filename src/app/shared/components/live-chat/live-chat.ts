import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../../core/services/Livechatservice/chat-service';
import { Chat } from '../../models/Livechatmodels/chat';
import { Message } from '../../models/Livechatmodels/message';
import { FormsModule } from '@angular/forms';
import { SendMessageRequest } from '../../models/Livechatmodels/send-message-request';
import { Subscription } from 'rxjs'; // Import Subscription for managing multiple subscriptions

@Component({
  selector: 'app-live-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './live-chat.html',
  styleUrl: './live-chat.css'
})
export class LiveChat implements OnInit, OnDestroy { // Implement OnDestroy
  isOpen = false;
  currentView = 'list';
  selectedConversation!: Chat | null;
  private chatService = inject(ChatService);
  private cdr = inject(ChangeDetectorRef);
  conversations1!: Chat[];

  chat: any; // Consider typing this more strictly if possible
  messages: Message[] = [];
  newMessage = '';

  private subscriptions = new Subscription(); // Create a Subscription to hold all subscriptions

  ngOnInit(): void {
    // Start SignalR connection when the component initializes
    // This is crucial for receiving real-time updates.
    this.chatService.startConnection();

    // Subscribe to incoming messages.
    // This will now be the only source for new messages.
    this.subscriptions.add(this.chatService.newMessage$.subscribe(message => {
      // Check if the received message belongs to the currently selected conversation
      if (this.selectedConversation && message && message.chatId === this.selectedConversation.id) {
        // Check for duplicates before pushing
        if (!this.messages.some(m => m.id === message.id)) {
          this.messages.push(message);
          this.cdr.detectChanges(); // Manually trigger change detection if needed
        }
      }
    }));

    // Subscribe to chat closed events
    this.subscriptions.add(this.chatService.chatClosed$.subscribe(closedChat => {
        if (this.selectedConversation && closedChat && closedChat.id === this.selectedConversation.id) {
            alert('This chat has been closed by the admin.');
            this.backToList(); // Go back to the chat list or disable input
        }
        // Also update the status in the conversations list
        const closedChatIndex = this.conversations1.findIndex(c => c.id === closedChat.id);
        if (closedChatIndex !== -1) {
            this.conversations1[closedChatIndex].status = closedChat.status; // Update status to "Closed"
            this.cdr.detectChanges();
        }
    }));


    this.chatService.getMyChat().subscribe({
      next: (data) => {
        console.log(data);
        this.conversations1 = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading user chats:', err);
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  loadMessages(): void {
    if (this.selectedConversation?.id) { // Use selectedConversation.id
      this.chatService.getMessagesByChatId(this.selectedConversation.id).subscribe({
        next: (msgs) => {
          this.messages = msgs;
          this.cdr.detectChanges();
          // Optionally, mark messages as read when loaded
          this.chatService.markMessagesAsRead(this.selectedConversation!.id);
        },
        error: (err) => {
          console.error('Error loading messages:', err);
        }
      });
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation?.id) return;

    const sendMessage: SendMessageRequest = {
      message: this.newMessage,
      chatId: this.selectedConversation.id,
      type: 'Text' // Assuming a default message type
    };

    const messageToSend = this.newMessage;
    this.newMessage = ''; // Clear input immediately

    this.chatService.sendMessage(sendMessage).subscribe({
      next: () => {
        // The message will be rendered by the SignalR subscription.
      },
      error: (err) => {
        console.error('Failed to send message', err);
        // Re-populate the input field if the message fails to send
        this.newMessage = messageToSend;
        this.cdr.detectChanges();
      }
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.currentView = 'list';
      if (this.selectedConversation?.id) {
          this.chatService.leaveChatGroup(this.selectedConversation.id);
      }
      this.selectedConversation = null;
      this.messages = [];
      this.cdr.detectChanges();
    }
  }

  startNewConversation(): void {
    this.chatService.createChat().subscribe({
      next: async (chat) => {
        this.selectedConversation = chat;
        this.messages = [];
        this.currentView = 'conversation';
        console.log("New chat created:", chat);
        await this.chatService.joinChatGroup(chat.id);
        this.chat = chat;
        this.loadMessages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to start conversation', err);
      }
    });
  }

  openConversation(conversation: Chat): void { // Ensure type is Chat
    this.selectedConversation = conversation;
    this.currentView = 'conversation';
    if (conversation.id) {
      // Join the specific chat group when opening a conversation
      this.chatService.joinChatGroup(conversation.id);
      this.chatService.getMessagesByChatId(conversation.id).subscribe({
        next: (data) => {
          console.log('Messages loaded:', data);
          this.messages = data;
          this.cdr.detectChanges();
          this.chatService.markMessagesAsRead(conversation.id); // Mark messages as read when opened
        },
        error: (err) => {
          console.error('Error loading messages for conversation:', err);
        }
      });
    }
  }

  backToList(): void {
    // Leave the chat group when going back to the list
    if (this.selectedConversation?.id) {
        this.chatService.leaveChatGroup(this.selectedConversation.id);
    }
    this.currentView = 'list';
    this.selectedConversation = null;
    this.messages = []; // Clear messages
    this.cdr.detectChanges(); // Ensure UI updates
    // Reload conversations list to reflect any changes (e.g., closed chats)
    this.chatService.getMyChat().subscribe({
        next:(data)=>{
            this.conversations1 = data
            this.cdr.detectChanges()
        }
    });
  }

  startNewConversationFromChat(): void {
    this.backToList(); // Go back to list view first and clean up
    this.startNewConversation(); // Then start a new one
  }
}
