import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContentService } from '../../core/services/content.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  searchForm: FormGroup;
  searchResults: any[] = [];
  isLoading = false;
  activeFilters: any = {};
  totalResults = 0;
  currentPage = 1;
  itemsPerPage = 9;

  // Available filter options based on seed data
  contentTypes = ['Article', 'Guide', 'Tutorial', 'Research', 'Course'];
  topics = [
    'machine learning',
    'AI',
    'data science',
    'web development',
    'javascript',
    'frontend',
    'backend',
    'blockchain',
    'cryptocurrency',
    'cybersecurity',
    'python',
    'cloud',
    'mobile',
    'security',
  ];

  constructor(private fb: FormBuilder, private contentService: ContentService) {
    this.searchForm = this.fb.group({
      searchQuery: [''],
    });
  }

  ngOnInit(): void {
    // Initialize with featured content instead of recommended (which requires auth)
    this.getFeaturedContent();

    // Set up search with debounce
    this.searchForm
      .get('searchQuery')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        if (query && query.length > 2) {
          this.searchContent(query);
        } else if (!query) {
          this.getFeaturedContent();
        }
      });
  }

  getFeaturedContent(): void {
    this.isLoading = true;
    this.contentService.getFeaturedContent().subscribe({
      next: (data) => {
        this.searchResults = data;
        this.totalResults = data.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching featured content:', error);
        this.isLoading = false;
      },
    });
  }

  getRecommendedContent(): void {
    this.isLoading = true;
    this.contentService.getRecommendedContent().subscribe({
      next: (data) => {
        this.searchResults = data;
        this.totalResults = data.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching recommended content:', error);
        this.isLoading = false;
        // Fallback to featured content if recommendation fails (e.g., not logged in)
        this.getFeaturedContent();
      },
    });
  }

  searchContent(query: string): void {
    this.isLoading = true;
    this.contentService.searchContent(query, this.activeFilters).subscribe({
      next: (data) => {
        this.searchResults = data.results;
        this.totalResults = data.results.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching content:', error);
        this.isLoading = false;
      },
    });
  }

  toggleFilter(type: string, value: string): void {
    if (!this.activeFilters[type]) {
      this.activeFilters[type] = [];
    }

    const index = this.activeFilters[type].indexOf(value);
    if (index > -1) {
      this.activeFilters[type].splice(index, 1);
      if (this.activeFilters[type].length === 0) {
        delete this.activeFilters[type];
      }
    } else {
      this.activeFilters[type].push(value);
    }

    // Re-run search with updated filters
    const query = this.searchForm.get('searchQuery')?.value;
    if (query) {
      this.searchContent(query);
    } else {
      // If no query but has filters, search with empty string to apply filters
      if (Object.keys(this.activeFilters).length > 0) {
        this.searchContent('');
      } else {
        // If no query and no filters, get featured content
        this.getFeaturedContent();
      }
    }
  }

  isFilterActive(type: string, value: string): boolean {
    return this.activeFilters[type]?.includes(value) || false;
  }

  clearFilters(): void {
    this.activeFilters = {};
    const query = this.searchForm.get('searchQuery')?.value;
    if (query) {
      this.searchContent(query);
    } else {
      this.getFeaturedContent();
    }
  }

  getActiveFilterCount(): number {
    let count = 0;
    Object.values(this.activeFilters).forEach((filters: any) => {
      count += filters.length;
    });
    return count;
  }
}
