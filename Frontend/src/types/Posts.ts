export interface User {
    _id: string;
    username: string;
    email: string;
}

export interface Post {
    _id: string;
    mediaURL: string;
    mediaType: string;
    caption: string;
    user: User;
    likesCount: string[];
    createdAt: string;
}
