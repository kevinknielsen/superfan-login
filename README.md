# Privy Smart Wallet Next.js Starter

Welcome to this starter kit for building onchain applications! This project demonstrates how to build a modern web3 application using Next.js, Privy, and WAGMI. It's designed to help you understand core web3 concepts and how to implement them in a production-ready application.

## Why These Technologies?

### Next.js

Next.js is a React framework that provides:

- Server-side rendering for better performance and SEO
- File-based routing for easy navigation
- API routes for backend functionality
- Built-in TypeScript support
- Excellent developer experience

### Privy

Privy is a powerful authentication and wallet management solution that offers:

- **Embedded Wallets**: Non-custodial wallets that users can create with just an email or social login
- **Smart Wallets**: Programmable wallets that can execute complex transactions
- Seamless onboarding for web3 newbies
- Secure key management

### WAGMI

WAGMI (We're All Gonna Make It) is a React Hooks library for Ethereum that:

- Provides easy-to-use hooks for interacting with Ethereum
- Handles wallet connections and chain switching
- Manages transaction states and error handling
- Integrates seamlessly with Privy

## What You'll Learn

This starter kit demonstrates:

- How to set up Privy authentication
- Creating and managing embedded wallets
- Using smart wallets for complex transactions
- Signing messages and sending USDC transactions
- Switching between different networks (Base and Base Sepolia)
- Displaying wallet balances
- Building a responsive UI with NextUI

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/builders-garden/privy-advanced-wallets
```

2. Install dependencies:

```bash
yarn install
```

3. Set up your environment variables:

   Create a `.env.local` file in the root directory and add your Privy App ID (learn how to get one [here](https://docs.privy.io/basics/get-started/dashboard/create-new-app)):

```
NEXT_PUBLIC_PRIVY_APP_ID=your_app_id_here
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application in action.

## Project Structure

### Core Application

- `app/`: Contains the main application pages and layout
  - `page.tsx`: Main application page with the dashboard layout
  - `layout.tsx`: Root layout with providers and global styles

### Components

The application is built using modular components that handle specific functionality:

#### Authentication & Wallet Management

- `Header.tsx`: Navigation bar with wallet connection and network switching
- `EmbeddedWallets.tsx`: Manages embedded wallet creation and connection
- `WalletInfo.tsx`: Displays information about the connected embedded wallet
- `SmartWallets.tsx`: Handles smart wallet creation and management
- `SmartWalletInfo.tsx`: Shows details about the connected smart wallet

#### Transaction Components

- `USDCTransaction.tsx`: Handles USDC transfers using embedded wallets
- `SmartUSDCTransaction.tsx`: Manages USDC transfers using smart wallets
- `SignMessage.tsx`: Component for signing messages with embedded wallets
- `SmartSignMessage.tsx`: Component for signing messages with smart wallets

#### UI Components

- `Tabs.tsx`: Tab navigation component for switching between different features
- `Providers.tsx`: Sets up all necessary providers (Privy, WAGMI, etc.)

### Supporting Files

- `lib/`: Core configuration and utility files

  - `constants.ts`: Network configurations and contract addresses
  - `wagmi.ts`: WAGMI client configuration and setup
  - `utils.ts`: Helper functions for common operations

- `public/`: Static assets (images, fonts, etc.)

## Key Features Explained

### Authentication

- Users can sign in using email or social login
- Privy handles the creation of embedded wallets
- WAGMI manages the wallet connection to Base and Base Sepolia
  - [How to integrate Privy with WAGMI](https://docs.privy.io/wallets/connectors/ethereum/integrations/wagmi#integrating-with-wagmi)
- Session management is handled automatically

### Smart Wallets

- Programmable wallets that can execute complex transactions
- Gas sponsorship capabilities
  - [How to setup a Coinbase Paymaster](https://docs.cdp.coinbase.com/paymaster/docs/paymaster-bundler-qs-ui)
- Transaction batching
- Recovery mechanisms

### Transactions

- USDC transfers between wallets
- Message signing for authentication
- Chain switching between Base and Base Sepolia
- Transaction status tracking

## Learning Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Privy Documentation](https://docs.privy.io/)
- [Privy Smart Wallets Guide](https://docs.privy.io/guide/react/wallets/smart-wallets/)
- [WAGMI Documentation](https://wagmi.sh/)
- [NextUI Documentation](https://nextui.org/)

### Tutorials and Guides

- [Privy Quickstart Guide](https://docs.privy.io/guide/quickstart/)
- [WAGMI Getting Started](https://wagmi.sh/react/getting-started)
- [Next.js Learn Course](https://nextjs.org/learn)

### Community Resources

- [Privy Discord](https://discord.gg/privy)
- [WAGMI Discord](https://discord.gg/wagmi)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)

## Deployment

This project is optimized for deployment on Vercel. Here's how to deploy:

1. Push your code to a GitHub repository
2. Sign up for a Vercel account
3. Create a new project and import your repository
4. Add your environment variables in the Vercel dashboard
5. Deploy!

For more detailed deployment instructions, check out:

- [Vercel Deployment Guide](https://vercel.com/docs/deployments)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Need Help?

If you're stuck or have questions:

- Check the documentation links above
- Join the Privy Discord community
- Open an issue in this repository
