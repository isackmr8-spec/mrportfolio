# MR SMILEY Portfolio - Backend Setup

## Prerequisites

1. **Install Node.js** from: https://nodejs.org/
   - Download the LTS (Long Term Support) version
   - Run the installer and follow the steps
   - Restart your computer after installation

## Installation

2. **Open terminal/command prompt** and navigate to the project folder:
```bash
cd mr-smiley-portfolio
```

3. **Install dependencies**:
```bash
npm install
```

## Running the Server

4. **Start the server**:
```bash
npm start
```

5. **Open in browser**:
```
http://localhost:3000
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contact` | POST | Submit contact form |
| `/api/booking` | POST | Submit booking request |
| `/api/payment` | POST | Process payment |
| `/api/subscribe` | POST | Newsletter subscription |
| `/api/gallery/access` | POST | Private gallery access |
| `/api/upload` | POST | Upload single image |
| `/api/upload/multiple` | POST | Upload multiple images |
| `/api/gallery/images` | GET | Get all gallery images |
| `/api/gallery/images/:id` | DELETE | Delete image |

## Testing Gallery Access Codes

Default test codes (in `data/galleries.json`):
- `WEDDING2024` - John & Sarah Wedding
- `CORPORATE2024` - ABC Company Event  
- `PORTRAIT2024` - Michael Portrait Session

## Adding More Gallery Codes

Edit `data/galleries.json` to add more client galleries:
```json
{
  "id": "GAL-004",
  "code": "YOUR-CODE-HERE",
  "clientName": "Client Name",
  "eventDate": "2024-12-01",
  "status": "active"
}
```

## Uploading Images

The server creates these folders automatically:
- `uploads/` - General uploads
- `uploads/gallery/` - Gallery images

Images can be uploaded via the API or through the frontend upload section.

## Troubleshooting

- If port 3000 is in use, change the PORT in server.js
- Make sure antivirus isn't blocking the installation
- Run terminal as Administrator if needed

