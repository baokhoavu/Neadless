# Neadless

A modern, performant blog application built with Next.js 14 and Contentful CMS, designed for seamless content management and optimal user experience.

## 🚀 Features

- **Next.js 14 with App Router**: Leveraging the latest Next.js features for superior performance and developer experience
- **Static Site Generation (SSG)**: Pre-rendered pages for lightning-fast load times and excellent SEO
- **Contentful Headless CMS**: Flexible content management with rich text editing and media handling
- **Draft Mode Preview**: Real-time preview of unpublished content for content creators
- **Responsive Design**: Mobile-first approach with Tailwind CSS for consistent cross-device experience
- **TypeScript**: Full type safety throughout the application for robust development
- **Incremental Static Regeneration (ISR)**: Automatic content updates without full rebuilds
- **Advanced Caching Strategy**: Multi-layer caching to optimize API usage and prevent rate limiting
- **SEO Optimized**: Meta tags, structured data, and performance optimizations out of the box

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Contentful
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

### Project Structure
```
neadless/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes for webhooks
│   ├── blog/              # Blog listing and individual posts
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm
- Contentful account and space

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/baokhoavu/Neadless.git
   cd Neadless
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory:
   ```bash
   # Contentful Configuration
   CONTENTFUL_SPACE_ID=your_contentful_space_id
   CONTENTFUL_ACCESS_TOKEN=your_contentful_delivery_token
   CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_contentful_preview_token
   CONTENTFUL_REVALIDATE_SECRET=your_webhook_secret

   # Optional: Analytics
   NEXT_PUBLIC_GA_TRACKING_ID=your_google_analytics_id
   ```

4. **Contentful Setup**:
   - Create a new Contentful space
   - Import the content model from `contentful-export.json`
   - Generate API tokens in Contentful settings
   - Update your `.env.local` with the credentials

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## 📝 Content Management

### Content Model
The application uses a "Lesson" content type with the following fields:
- **Title**: Blog post title
- **Slug**: URL-friendly identifier
- **Cover Image**: Hero image for the post
- **Date**: Publication date
- **Author**: Post author information
- **Excerpt**: Short description for previews
- **Content**: Rich text content with embedded media

### Draft Mode
Access draft content by appending `?draft=true` to any blog post URL. This allows content creators to preview unpublished changes before going live.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Enable the Contentful integration for automatic deployments
4. Configure webhooks in Contentful to trigger revalidation

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### API Routes
- `POST /api/revalidate` - Webhook endpoint for Contentful content updates
- `GET /api/posts` - Fetch all published posts
- `GET /api/posts/[slug]` - Fetch individual post by slug

## 📊 Performance & Caching

### Caching Layers
1. **Next.js ISR**: Content revalidates every hour in production
2. **Request Memoization**: Prevents duplicate API calls
3. **Contentful CDN**: Images served via Contentful's global CDN
4. **Browser Caching**: Static assets cached for optimal performance

### Monitoring
- API request stats available in development console
- Vercel Analytics integration for production metrics
- Contentful webhook logs for content update tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Contentful](https://www.contentful.com/) for the powerful headless CMS
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel](https://vercel.com/) for the seamless deployment platform

---

**Built by Baokhoa Vu**