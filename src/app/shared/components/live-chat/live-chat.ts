import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../../core/services/Livechatservice/chat-service';
import { Chat } from '../../models/Livechatmodels/chat';
import { Message } from '../../models/Livechatmodels/message';
import { FormsModule } from '@angular/forms';
import { SendMessageRequest } from '../../models/Livechatmodels/send-message-request';

@Component({
  selector: 'app-live-chat',
  imports: [CommonModule,FormsModule],
  templateUrl: './live-chat.html',
  styleUrl: './live-chat.css'
})
export class LiveChat implements OnInit  {
  
  isOpen = false;
  currentView = 'list'; 
  selectedConversation!:Chat|null;
  private chatService = inject(ChatService)
  private cdr = inject(ChangeDetectorRef)
  conversations1!:Chat[]

  chat:any;
  messages:Message[]=[];
  newMessage='';
  
  ngOnInit(): void {
   this.chatService.getMyChat().subscribe(
    {
      next:(data)=>{
        console.log(data)
        this.conversations1 = data
        this.cdr.detectChanges()
      }
    }
   )
  }



  experts = [
    { name: 'John', avatar: '👨‍💼' },
    { name: 'Sarah', avatar: '👩‍💼' },
    { name: 'Mike', avatar: '👨‍💻' }
  ];

  loadMessages(){
    this.chatService.getMessagesByChatId(this.chat.id).subscribe((msgs:any)=>{
      this.messages = msgs
    })
  }

  // sendMessage() {
  //   if (!this.newMessage.trim()) return;
  //   this.chatService.sendMessage(this.chat.id, this.newMessage).subscribe(() => {
  //     this.newMessage = '';
  //   });
  // }

sendMessage() {
  if (!this.newMessage.trim()) return;
  const sendMessage:SendMessageRequest={
    message:this.newMessage,
    chatId:this.selectedConversation?.id
    
  }
  this.chatService.sendMessage(sendMessage).subscribe({
    next: (msg) => {
      this.messages.push(msg);
      this.cdr.detectChanges();
      this.newMessage = '';
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Failed to send message', err);
    }
  });
}



  toggleChat() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.currentView = 'list';
      this.selectedConversation = null;
    }
  }

   startNewConversation() {
    this.chatService.createChat().subscribe({
    next: async (chat) => {
      this.selectedConversation = chat;
      this.messages = []; // clear old messages
      this.currentView = 'conversation';
      console.log("shfjkshfkjsahfk")
      await this.chatService.joinChatGroup(chat.id);
      this.chat=chat;
      this.loadMessages();
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Failed to start conversation', err);
    }
  });
   
  }

  openConversation(conversation: any) {
    this.selectedConversation = conversation;
    this.currentView = 'conversation';
    this.chatService.getMessagesByChatId(conversation.id).subscribe(
      {
        next:(data)=>{
          console.log(data)
          this.messages = data;
          this.cdr.detectChanges()
        }
      }
    )
  }

  backToList() {
    this.currentView = 'list';
    this.selectedConversation = null;
  }

  startNewConversationFromChat() {
    this.currentView = 'list';
    this.selectedConversation = null;
    this.startNewConversation();
  }
}
