// User type for global use
export interface User {
    id: number;
    email: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    is_active: boolean;
    is_verified: boolean;
    provider: string;
    created_at: string;
    last_login?: string;
}
