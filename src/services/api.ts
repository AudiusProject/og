import { Context } from "hono";
// API-specific types
interface UserData {
  data?: {
    id: string;
  };
}

interface Challenge {
  challenge_id: string;
  current_step_count: number;
}

interface ChallengeData {
  data?: Challenge[];
}

export class APIService {
  private baseUrl: string;

  constructor(c: Context) {
    this.baseUrl = c.env.API_URL;
  }

  // Shared utility for making API calls
  async fetch<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  // Keep this as it's used by airdrop feature
  async fetchAllocation(handle: string): Promise<number | null> {
    if (!handle) return null;

    try {
      const userData: UserData = await this.fetch(`/v1/users/handle/${handle}`);

      if (!userData?.data?.id) return null;

      const challengeData: ChallengeData = await this.fetch(`/v1/users/${userData.data.id}/challenges`);

      const totalAllocation =
        challengeData?.data?.find((c: Challenge) => c.challenge_id === "o")?.current_step_count ?? 0;
      return totalAllocation;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }
}
