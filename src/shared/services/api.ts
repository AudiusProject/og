import { Context } from "hono";
import { UserData, ChallengeData, CommentResponse, CommentData } from "../types";

export class APIService {
  private baseUrl: string;

  constructor(c: Context) {
    this.baseUrl = c.env.API_URL;
  }

  async fetchAllocation(handle: string): Promise<number | null> {
    if (!handle) return null;

    try {
      const userResponse = await fetch(`${this.baseUrl}/v1/users/handle/${handle}`);
      const userData: UserData = await userResponse.json();

      if (!userData?.data?.id) return null;

      const challengesResponse = await fetch(`${this.baseUrl}/v1/users/${userData.data.id}/challenges`);
      const challengeData: ChallengeData = await challengesResponse.json();

      const totalAllocation = challengeData?.data?.find((c) => c.challenge_id === "o")?.current_step_count ?? 0;
      return totalAllocation;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  async getCommentDataById(id: string): Promise<CommentData> {
    const url = `${this.baseUrl}/v1/full/comments/${id}`;
    const res = await fetch(url);
    const { data, related } = (await res.json()) as CommentResponse;
    const comment = Array.isArray(data) ? data[0] : data;

    if (!comment) throw new Error(`Failed to get comment ${id}`);

    const track = related.tracks.find((t: any) => t.id === comment.entity_id);
    const user = related.users.find((u: any) => u.id === comment.user_id);

    return {
      comment,
      track,
      user,
    };
  }

  // TODO: Implement when track OG images are added
  // async getTrackDataById(id: string): Promise<any> {
  //   const url = `${this.baseUrl}/v1/full/tracks/${id}`;
  //   const res = await fetch(url);
  //   const response = await res.json() as { data: any; related: any };
  //   const { data, related } = response;
  //
  //   if (!data) throw new Error(`Failed to get track ${id}`);
  //
  //   return { data, related };
  // }

  // TODO: Implement when user OG images are added
  // async getUserDataById(id: string): Promise<any> {
  //   const url = `${this.baseUrl}/v1/full/users/${id}`;
  //   const res = await fetch(url);
  //   const response = await res.json() as { data: any; related: any };
  //   const { data, related } = response;
  //
  //   if (!data) throw new Error(`Failed to get user ${id}`);
  //
  //   return { data, related };
  // }

  // TODO: Implement when collection OG images are added
  // async getCollectionDataById(id: string): Promise<any> {
  //   const url = `${this.baseUrl}/v1/full/playlists/${id}`;
  //   const res = await fetch(url);
  //   const response = await res.json() as { data: any; related: any };
  //   const response = await res.json() as { data: any; related: any };
  //   const { data, related } = response;
  //
  //   if (!data) throw new Error(`Failed to get collection ${id}`);
  //
  //   return { data, related };
  // }
}
