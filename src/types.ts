// Shared types for OG image generation

// User-related types
export interface UserData {
  id?: string;
  name: string;
  handle: string;
  is_verified: boolean;
  total_audio_balance: number;
  profile_picture: Record<string, string>;
  cover_photo?: Record<string, string>;
  profile_type?: string;
  track_count?: number;
}

export interface UserResponse {
  data?: UserData[];
}

// Coin-related types
export interface CoinExtensions {
  [key: string]: any;
}

export interface CoinDynamicBondingCurve {
  [key: string]: any;
}

export interface CoinData {
  name: string;
  ticker?: string;
  mint: string;
  decimals: number;
  owner_id: string;
  logoUri?: string;
  description?: string;
  website?: string;
  createdAt: string;
  address?: string;
  symbol?: string;
  marketCap: number;
  fdv: number;
  extensions?: CoinExtensions;
  liquidity: number;
  lastTradeUnixTime: number;
  lastTradeHumanTime: string;
  price: number;
  history24hPrice: number;
  priceChange24hPercent: number;
  uniqueWallet24h: number;
  uniqueWalletHistory24h: number;
  uniqueWallet24hChangePercent: number;
  totalSupply: number;
  circulatingSupply: number;
  holder: number;
  trade24h: number;
  tradeHistory24h: number;
  trade24hChangePercent: number;
  sell24h: number;
  sellHistory24h: number;
  sell24hChangePercent: number;
  buy24h: number;
  buyHistory24h: number;
  buy24hChangePercent: number;
  v24h: number;
  v24hUSD: number;
  vHistory24h: number;
  vHistory24hUSD?: number;
  v24hChangePercent?: number;
  vBuy24h?: number;
  vBuy24hUSD?: number;
  vBuyHistory24h?: number;
  vBuyHistory24hUSD?: number;
  vBuy24hChangePercent?: number;
  vSell24h?: number;
  vSell24hUSD?: number;
  vSellHistory24h?: number;
  vSellHistory24hUSD?: number;
  vSell24hChangePercent?: number;
  numberMarkets?: number;
  dynamicBondingCurve: CoinDynamicBondingCurve;
}

export interface CoinResponse {
  data?: CoinData;
}
