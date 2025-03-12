# Birthday Memories Gift

A beautiful web application to gift your girlfriend on her birthday, showcasing your memories together through a timeline, gallery, and interactive map.

## Features

- **Timeline**: Chronological display of your relationship milestones
- **Gallery**: Collection of photos and videos from your memories together
- **Memory Map**: Interactive map showing locations of your memories

## Tech Stack

### Frontend
- Next.js 15 (React framework)
- TypeScript
- TailwindCSS (for styling)
- Framer Motion (for animations)
- React Map GL (for map visualization)

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL Database
- AWS S3 (for media storage)

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- AWS account with S3 bucket
- Mapbox account (for the map)

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/memories?schema=public"

# AWS S3
AWS_ACCESS_KEY_ID="your_access_key_id"
AWS_SECRET_ACCESS_KEY="your_secret_access_key"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="your-piw-birthday-bucket"

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/birthday-memories-gift.git
cd birthday-memories-gift
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npx prisma migrate dev --name init
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Adding Content

### Adding Memories
You can add memories through the API:

```bash
curl -X POST http://localhost:3000/api/memories -H "Content-Type: application/json" -d '{
  "title": "Our First Date",
  "description": "We went to that cute cafe downtown",
  "date": "2022-05-15T18:00:00Z",
  "isTimelineEvent": true,
  "importance": 5,
  "location": {
    "name": "Downtown Cafe",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "address": "123 Main St"
  },
  "mediaItems": [
    {
      "url": "https://example.com/image.jpg",
      "type": "IMAGE",
      "caption": "Our first selfie together"
    }
  ]
}'
```

### Uploading Media
You can upload media files through the API:

```bash
curl -X POST http://localhost:3000/api/upload -F "file=@/path/to/your/image.jpg"
```

## Deployment

This project can be easily deployed to Vercel:

```bash
npm install -g vercel
vercel
```

## License

This project is licensed under the MIT License.
