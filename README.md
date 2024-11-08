# 📦 Modern Shipping Calculator

A professional-grade shipping calculator built with Next.js and TypeScript that provides real-time shipping rates from multiple carriers.

![Shipping Calculator Preview](https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=2000)

## ✨ Features

- **Multi-Carrier Support**
  - UPS, FedEx, USPS, and DHL integration
  - Real-time rate calculation
  - Service comparison across carriers

- **Advanced Package Details**
  - Custom dimensions and weight
  - Multiple packaging options
  - Professional packing services

- **Smart Cost Calculation**
  - Dynamic pricing based on distance
  - Dimensional weight consideration
  - Additional services cost breakdown

- **Carrier Management**
  - Individual carrier configuration
  - API credentials management
  - Service-level toggles

## 🚀 Technical Stack

- **Frontend Framework**: Next.js 13+ with App Router
- **Type Safety**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 💻 Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/shipping-calculator.git
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## 🏗 Project Structure

```
├── app/
│   ├── page.tsx           # Main page component
│   └── layout.tsx         # Root layout
├── components/
│   └── shipping/          # Shipping-related components
│       ├── shipping-calculator.tsx
│       ├── package-details.tsx
│       ├── shipping-options.tsx
│       ├── carrier-settings.tsx
│       └── packing-cost-summary.tsx
├── lib/
│   ├── carriers/         # Carrier API integrations
│   ├── types/           # TypeScript definitions
│   ├── utils.ts         # Utility functions
│   ├── validations/     # Form validations
│   └── shipping-calculator.ts
```

## 🔧 Configuration

The application requires API credentials for each carrier:

- **UPS**: Client ID and Secret
- **FedEx**: API Key and Account Number
- **USPS**: Web Tools API Key
- **DHL**: Client ID and Secret

Configure these in the carrier settings panel within the application.

## 🛡 Security

- All API credentials are securely stored
- Environment-based configuration (test/production)
- Rate limiting on API calls
- Input validation and sanitization

## 📈 Future Enhancements

- [ ] Real-time tracking integration
- [ ] Bulk shipping calculations
- [ ] Custom packaging presets
- [ ] Address validation
- [ ] International shipping support
- [ ] Label generation
- [ ] Shipping insurance options

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.