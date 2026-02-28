export interface Profile {
    id: string;
    name: string;
    phone: string;
    email?: string;
    division_id: string;
    district_id: string;
    thana?: string;
    village?: string;
    selected_division_id: string;
    selected_district_id: string;
    role: 'user' | 'admin' | 'district_admin';
    avatar_url?: string;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    group_name: string;
    color: string;
    active: boolean;
    display_order: number;
    created_at?: string;
}

export interface ContentItem {
    id: string;
    category_id: string;
    district_id: string;
    division_id: string;
    title: string;
    phone?: string;
    address?: string;
    description?: string;
    status: 'pending' | 'approved' | 'rejected';
    submitted_by?: string;
    submitted_by_name?: string;
    metadata?: Record<string, string>;
    is_sponsored?: boolean;
    sponsored_until?: string;
    images?: string[];
    created_at: string;
    updated_at: string;
    // joined
    categories?: Pick<Category, 'id' | 'name' | 'icon' | 'color'>;
    isSaved?: boolean;
    views?: number;
    calls?: number;
}

export interface Notice {
    id: string;
    content: string;
    active: boolean;
    created_at: string;
}

export interface Banner {
    id: string;
    title?: string;
    image_url: string;
    link?: string;
    district_id: string;
    active: boolean;
    created_at: string;
}

export interface Review {
    id: string;
    content_id: string;
    user_id: string;
    rating: number;
    comment?: string;
    created_at: string;
    profiles?: { name: string; avatar_url?: string }; // joined
}

export interface UserNotification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    action_link?: string;
    created_at: string;
}

export interface Division {
    id: string;
    name: string;
    nameEn: string;
    districts: District[];
}

export interface District {
    id: string;
    name: string;
    nameEn: string;
    image: string;
    thanas: string[];
    divisionId?: string;
    divisionName?: string;
}

export interface DashboardStats {
    totalUsers: number;
    totalCategories: number;
    pending: number;
    approved: number;
    rejected: number;
    totalContent: number;
}

export interface Ad {
    id: string;
    title?: string;
    image_url: string;
    click_url?: string;
    district_id?: string;
    display_size?: string;
    display_group?: string;
    is_active: boolean;
    clicks: number;
    created_at: string;
}
