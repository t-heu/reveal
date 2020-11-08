export interface IPostDTO {
  id: string;
  text: string;
  userId: string;
  dateTimePosted: Date;
  viewer_has_liked: boolean;
  viewer_count_comments: number;
  viewer_count_likes: number;
  viewer_has_hidePost: boolean;
  user?: {
    avatar_url: string;
  };
}
