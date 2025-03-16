import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: any = {
    name: '',
    email: '',
    contentViewed: 0,
    contentSaved: 0,
    chatSessions: 0,
  };
  userData: any = {};
  recentActivity: any[] = [];
  savedContent: any[] = [];
  recommendations: any[] = [];
  isLoading = true;

  constructor(
    private userService: UserService,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    // Use loadDashboardData instead of individual methods to ensure consistent loading
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load all data separately to handle individual errors
    this.loadUserData();
    this.loadRecentActivity();
    this.loadSavedContent();
    this.loadRecommendations();
  }

  loadUserData(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        if (data) {
          this.userData = data; // Set userData
          this.user = {
            name:
              `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'User',
            email: data.email || 'user@test.com',
            contentViewed: data.stats?.contentViewed || 0,
            contentSaved: data.stats?.contentSaved || 0,
            chatSessions: data.stats?.chatSessions || 0,
          };
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.isLoading = false;
        // Load mock data when API call fails
        this.loadMockData();
      },
    });
  }

  loadRecentActivity(): void {
    this.userService.getUserActivity().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.recentActivity = data.map((item: any) => {
            // Add appropriate icon based on activity type
            let icon = 'bi bi-clock';
            if (item.type === 'view') icon = 'bi bi-eye';
            else if (item.type === 'save') icon = 'bi bi-bookmark';
            else if (item.type === 'chat') icon = 'bi bi-chat';

            return {
              ...item,
              icon,
            };
          });
        }
      },
      error: (error) => {
        console.error('Error loading activity:', error);
        // Use mock activity data from loadMockData when API call fails
        if (this.recentActivity.length === 0) {
          this.loadMockData();
        }
      },
    });
  }

  loadSavedContent(): void {
    this.userService.getSavedContent().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.savedContent = data;
        }
      },
      error: (error) => {
        console.error('Error loading saved content:', error);
        // Use mock saved content data from loadMockData when API call fails
        if (this.savedContent.length === 0) {
          this.loadMockData();
        }
      },
    });
  }

  loadRecommendations(): void {
    // This would typically come from a recommendation service
    // For now, we'll use mock data
    this.contentService.getRecommendedContent().subscribe({
      next: (data) => {
        this.recommendations = data;
      },
      error: (error) => {
        console.error('Error loading recommendations:', error);
        // Load mock data if API call fails
        this.recommendations = [
          {
            id: '1',
            title: 'Introduction to Machine Learning',
            description:
              'Learn the basics of machine learning and how it can be applied to solve real-world problems.',
            type: 'Article',
          },
          {
            id: '2',
            title: 'Effective Leadership Strategies',
            description:
              'Discover proven leadership techniques that can help you manage teams more effectively.',
            type: 'Video',
          },
          {
            id: '3',
            title: 'Productivity Hacks for Busy Professionals',
            description:
              'Simple but powerful techniques to boost your productivity and manage your time better.',
            type: 'Guide',
          },
        ];
      },
    });
  }

  /**
   * Loads mock data when API calls fail
   * This ensures the dashboard still shows useful information
   */
  loadMockData(): void {
    // Mock user data
    this.user = {
      name: 'Test User',
      email: 'user@example.com',
      contentViewed: 24,
      contentSaved: 12,
      chatSessions: 8,
    };

    // Mock activity data
    this.recentActivity = [
      {
        id: '1',
        type: 'view',
        description: 'Viewed "Introduction to Machine Learning"',
        timestamp: new Date(),
        icon: 'bi bi-eye',
      },
      {
        id: '2',
        type: 'save',
        description: 'Saved "Effective Leadership Strategies"',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        icon: 'bi bi-bookmark',
      },
      {
        id: '3',
        type: 'chat',
        description: 'Started a new chat session',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        icon: 'bi bi-chat',
      },
    ];

    // Mock saved content
    this.savedContent = [
      {
        id: '1',
        title: 'Introduction to Machine Learning',
        description:
          'Learn the basics of machine learning and how it can be applied to solve real-world problems.',
        type: 'Article',
        savedAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: '2',
        title: 'Effective Leadership Strategies',
        description:
          'Discover proven leadership techniques that can help you manage teams more effectively.',
        type: 'Video',
        savedAt: new Date(Date.now() - 172800000), // 2 days ago
      },
    ];

    // Mock recommendations are already loaded in loadRecommendations()
  }
}
