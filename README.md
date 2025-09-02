# AI Dispute Resolution System - Frontend

A modern React-based frontend application for submitting and viewing AI-powered dispute resolutions.

## Features

- **Intuitive Dispute Form**: Clean, structured interface for dispute submission
- **Real-time AI Resolution**: Submit disputes and receive instant AI-generated decisions
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Decision Display**: Clear presentation of AI decisions with confidence scoring
- **Admin Dashboard**: Administrative interface for system management
- **TypeScript**: Full type safety and better development experience

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: CSS3 with modern design principles
- **HTTP Client**: Axios for API communication
- **Build Tool**: Create React App
- **Development**: Hot reloading and development tools

## Project Structure

```
frontend/
├── public/                   # Static assets
│   ├── index.html           # Main HTML template
│   └── favicon.ico          # Site icon
├── src/
│   ├── components/          # React components
│   │   ├── DisputeForm.tsx      # Main dispute submission form
│   │   ├── DecisionDisplay.tsx  # AI decision presentation
│   │   ├── AdminDashboard.tsx   # Administrative interface
│   │   └── ArticleModal.tsx     # Article display modal
│   ├── data/
│   │   └── articles.ts      # Static article data
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Application entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open automatically at [http://localhost:3000](http://localhost:3000).

## Available Scripts

### Development

- **`npm start`** - Runs the app in development mode
- **`npm test`** - Launches the test runner in interactive watch mode
- **`npm run build`** - Builds the app for production
- **`npm run eject`** - Ejects from Create React App (one-way operation)

### Production

- **`npm run build`** - Creates optimized production build
- **`npm run serve`** - Serves the production build locally (if serve is installed)

## Usage

### Submitting a Dispute

1. **Fill out the dispute form** with:

   - Unique dispute ID
   - Category (Contract, Service, Product, Other)
   - Parties involved
   - Established facts
   - Evidence summary
   - Claimed relief/remedy

2. **Click "Submit Dispute"** to send to the AI backend

3. **View the AI decision** including:
   - Formal decision
   - Reasoning based on applicable rules
   - Recommended remedy
   - Confidence score

### Admin Dashboard

Access administrative functions through the admin dashboard:

- System monitoring
- User management
- Dispute history
- System configuration

## Configuration

### Backend API

The frontend connects to the backend server. Ensure the backend is running and accessible at the configured URL.

### Environment Variables

Create a `.env` file in the frontend directory if you need to customize:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

## Development

### Adding New Components

1. Create new component files in `src/components/`
2. Follow the existing component structure and naming conventions
3. Add TypeScript interfaces for props and state
4. Include corresponding CSS files for styling

### Styling Guidelines

- Use CSS modules or component-specific CSS files
- Follow modern design principles
- Ensure responsive design for mobile devices
- Maintain consistency with existing UI components

### State Management

- Use React hooks for local component state
- Consider context API for shared state if needed
- Keep state as local as possible to components

## Building for Production

1. **Create production build:**

   ```bash
   npm run build
   ```

2. **The build folder** contains optimized static files ready for deployment

3. **Deploy the build folder** to your web server or hosting platform

## Testing

### Running Tests

```bash
npm test
```

### Test Coverage

```bash
npm test -- --coverage --watchAll=false
```

## Troubleshooting

### Common Issues

1. **Backend Connection Error**: Ensure the backend server is running and accessible
2. **Port Conflicts**: Change the port if 3000 is already in use
3. **Build Errors**: Check for TypeScript errors and resolve before building

### Development Tips

- Use React Developer Tools browser extension
- Check browser console for errors
- Verify API endpoints are correct
- Test on different screen sizes for responsive design

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Test your changes thoroughly
4. Update documentation as needed
5. Ensure responsive design works on all screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized bundle size
- Lazy loading for better performance
- Efficient re-rendering with React hooks
- Minimal external dependencies

## Security

- Input validation on forms
- Secure API communication
- No sensitive data stored in frontend
- Regular dependency updates

## License

[Add your license information here]
# LEX-CLIENT
