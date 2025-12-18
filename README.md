# Neadless

[![CI](https://github.com/baokhoavu/Neadless/actions/workflows/ci.yml/badge.svg)](https://github.com/baokhoavu/Neadless/actions/workflows/ci.yml)

A modern blog application built with Next.js and Contentful CMS.

## Features

- **Static Generation**: Leveraging Next.js's static generation for optimal performance
- **Contentful CMS**: Headless CMS for content management
- **Draft Mode**: Preview unpublished content
- **Responsive Design**: Built with Tailwind CSS
- **TypeScript**: Type-safe development

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/baokhoavu/Neadless.git
   cd Neadless
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.local.example` to `.env.local` and fill in your Contentful credentials:
   ```bash
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
   CONTENTFUL_REVALIDATE_SECRET=your_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contentful Setup

1. Create a Contentful space
2. Create a "Lesson" content type with fields: title, slug, coverImage, date, author, excerpt, content
3. Add and publish lesson entries
4. Generate API keys and update `.env.local`

## CI/CD Setup

For automated builds and deployments, configure the following secrets in your GitHub repository:

1. Go to your repository Settings → Secrets and variables → Actions
2. Add the following repository secrets:
   - `CONTENTFUL_SPACE_ID`: Your Contentful space ID
   - `CONTENTFUL_ACCESS_TOKEN`: Your Contentful delivery API access token
   - `CONTENTFUL_PREVIEW_ACCESS_TOKEN`: Your Contentful preview API access token
   - `CONTENTFUL_REVALIDATE_SECRET`: A secret string for webhook revalidation

The CI workflow will automatically build and test your application using these credentials.

## Caching Strategy

This application implements multiple layers of caching to optimize Contentful API usage and prevent rate limiting:

### **Next.js Caching**
- **Static Generation**: Pages are pre-rendered at build time
- **ISR**: Content revalidates every hour for production, immediately for preview
- **Cache Tags**: Uses `posts` tag for targeted cache invalidation

### **Request Optimization**
- **Request Memoization**: Prevents duplicate API calls within the same request lifecycle
- **Rate Limiting**: Minimum 100ms delay between Contentful requests
- **Parallel Requests**: Uses `Promise.allSettled` for concurrent API calls with graceful failure handling

### **Contentful Integration**
- **Webhook Revalidation**: Automatic cache purging when content changes
- **CDN Optimization**: Contentful images served via their CDN with WebP/AVIF support
- **Error Handling**: Automatic retry on rate limit hits with exponential backoff

### **Monitoring**
Cache performance can be monitored via the API stats available in development.

## Deployment

Deploy to Vercel with the Contentful integration for automatic content updates.

## License

MIT