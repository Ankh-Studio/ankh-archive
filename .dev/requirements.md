
# Multi-URL Crawl Feature Requirements

## Goal
Take an input of 2 or more URLs and a Template, for each URL utilize the existing web clipping functionality using the provided template to extract and save to Obsidian.

## Core Requirements
- Seamless integration with existing system
- Intuitive and frictionless UI/UX
- Input and execution from anywhere, including side panel and right click context menu
- Minimize changes while fully realizing functionality

## Technical Specifications

### URL Handling
- **Maximum URLs**: 100 per crawl operation
- **Input Method**: Manual input (textarea, one URL per line)
- **URL Validation**: Basic validation and cleaning
- **Processing**: Sequential processing (concurrent optimization backlogged)

### Template System
- **Template Selection**: Single template for all URLs in crawl
- **Template Persistence**: Remember last used template for crawling
- **Integration**: Reuse existing template dropdown and selection logic

### Progress Management
- **Progress Persistence**: Yes, maintain progress across sessions
- **Status Display**: Basic success count with detailed logging for failures
- **Cancellation**: Support for canceling in-progress crawls

### User Interface
- **Primary Access**: Button in popup/side panel (location TBD based on UI/UX best practices)
- **Context Menu**: Available on all pages
- **Modal Interface**: Overlay modal for URL input and progress
- **Cross-browser**: Chrome, Firefox, Safari support

### Error Handling
- **Failed URLs**: Log detailed error responses
- **Retry Logic**: Basic retry capability (implementation details TBD)
- **User Feedback**: Clear status messaging for success/failure states

## User Experience Flow
1. User clicks "Multi-URL Crawl" button or context menu
2. Modal opens with URL input textarea and template selector
3. User enters URLs (one per line) and selects template
4. User clicks "Start Crawl"
5. Progress indicator shows current status
6. Results summary displayed upon completion
7. User can view created notes or retry failed URLs
