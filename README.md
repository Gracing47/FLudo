# FLudo - Blockchain Ludo Game 🎲

A modern Ludo board game built with React and Next.js, integrated with the Flare blockchain network.

## Features

- 🎮 Classic Ludo game with 4 players
- ⚡ Built with Next.js 14 and React
- 🎨 Beautiful UI with Tailwind CSS
- 🔗 Flare Network integration via Web3
- 💼 MetaMask wallet connection
- 🌐 Coston2 Testnet support
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MetaMask browser extension

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Gracing47/FLudo.git
cd FLudo
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask wallet to the Flare Coston2 Testnet
2. **Start Game**: Click "Start Game" to begin
3. **Roll Dice**: Click "Roll Dice" to roll the dice on your turn
4. **Move Pieces**: Click on highlighted pieces to move them
5. **Win**: Get all 4 of your pieces to the finish area to win!

## Game Rules

- Roll a 6 to bring a piece out of home
- Roll a 6 to get an extra turn
- Land on an opponent's piece to send it back home (unless on a safe spot)
- Safe spots are marked in green
- Complete the circuit and reach the center to finish

## Flare Network Integration

This game integrates with the Flare Network:

- **Network**: Coston2 Testnet
- **Chain ID**: 114 (0x72)
- **RPC URL**: https://coston2-api.flare.network/ext/C/rpc
- **Explorer**: https://coston2-explorer.flare.network/

### Getting Test FLR

To get test FLR tokens for Coston2:
1. Visit the [Flare Faucet](https://faucet.flare.network/)
2. Connect your wallet
3. Request test tokens

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Web3**: ethers.js v6
- **Blockchain**: Flare Network (Coston2 Testnet)

## Project Structure

```
FLudo/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── LudoGame.tsx   # Main game component
│   ├── GameBoard.tsx  # Game board UI
│   ├── Dice.tsx       # Dice component
│   └── WalletConnect.tsx # Wallet connection
├── lib/               # Game logic and utilities
│   ├── gameTypes.ts   # Type definitions
│   ├── gameLogic.ts   # Game rules and logic
│   └── web3.ts        # Web3 integration
└── hooks/             # Custom React hooks
    └── useWallet.ts   # Wallet hook

```

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Lint Code

```bash
npm run lint
```

## Future Enhancements

- [ ] Smart contract for on-chain game state
- [ ] Multiplayer support with real-time updates
- [ ] NFT-based player avatars
- [ ] Token rewards for winners
- [ ] Tournament mode
- [ ] Game statistics and leaderboard

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.