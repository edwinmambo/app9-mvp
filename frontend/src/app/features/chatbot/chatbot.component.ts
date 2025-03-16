import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../../core/services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  messages: ChatMessage[] = [];
  newMessage = '';
  isLoading = false;
  private shouldScrollToBottom = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Add welcome message
    this.messages.push({
      content:
        "Hello! I'm your personal knowledge assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      this.shouldScrollToBottom = false;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      content: this.newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    this.messages.push(userMessage);
    this.shouldScrollToBottom = true;

    // Clear input and show loading
    const messageToSend = this.newMessage;
    this.newMessage = '';
    this.isLoading = true;

    // Get chat history in format expected by API
    const chatHistory = this.messages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Get AI response using subscribe
    this.chatService.getChatResponse(messageToSend, chatHistory).subscribe({
      next: (response: string) => {
        // Add AI response
        this.messages.push({
          content: response,
          sender: 'ai',
          timestamp: new Date(),
        });
        this.isLoading = false;
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        console.error('Error getting chat response:', error);
        this.messages.push({
          content: 'Sorry, I encountered an error. Please try again later.',
          sender: 'ai',
          timestamp: new Date(),
        });
        this.isLoading = false;
        this.shouldScrollToBottom = true;
      },
    });
  }
}
