import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AiService } from '../../core/services/ai.service';
import { ContentService } from '../../core/services/content.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dailyContent: any = {};
  featuredContent: any[] = [];
  isLoading = true;
  isAuthenticated = false;

  constructor(
    private aiService: AiService,
    private contentService: ContentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.loadHomeContent();
  }

  loadHomeContent(): void {
    this.isLoading = true;

    // Get daily content from AI service
    this.aiService.getDailyContent().subscribe({
      next: (dailyData: any) => {
        this.dailyContent = dailyData;

        // Get featured content
        this.contentService.getFeaturedContent().subscribe({
          next: (featuredData) => {
            this.featuredContent = featuredData;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching featured content:', error);
            this.isLoading = false;
          },
        });
      },
      error: (error: Error) => {
        console.error('Error fetching daily content:', error);
        this.isLoading = false;
      },
    });
  }
}
