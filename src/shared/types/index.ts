export interface UserData {
  data?: {
    id: string;
  };
}

export interface Challenge {
  challenge_id: string;
  current_step_count: number;
}

export interface ChallengeData {
  data?: Challenge[];
}

export interface CommentResponse {
  data: any;
  related: { tracks: any[]; users: any[] };
}

export interface CommentData {
  comment: any;
  track: any;
  user: any;
}

export interface TrackData {
  id: string;
  title: string;
  artwork: Record<string, string>;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  name: string;
  is_verified: boolean;
  total_audio_balance: number;
  profile_picture: Record<string, string>;
}

export interface CollectionData {
  id: string;
  title: string;
  artwork: Record<string, string>;
  user: UserInfo;
  track_count: number;
}

export type BadgeTier = "Bronze" | "Silver" | "Gold" | "Platinum" | null;

export interface OGImageConfig {
  width: number;
  height: number;
  fonts: any[];
}

export interface RenderContext {
  c: any;
  config: OGImageConfig;
}
