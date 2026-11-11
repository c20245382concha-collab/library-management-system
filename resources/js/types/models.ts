
/*
|--------------------------------------------------------------------------
| Common Types
|--------------------------------------------------------------------------
*/

export type ID = number;

export type BorrowingStatus =
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'borrowed'
    | 'returned';

export type DateString = string;


/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string | null;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};


/*
|--------------------------------------------------------------------------
| Role
|--------------------------------------------------------------------------
*/

export type Role = {
    id: ID;
    role_name: string;
    created_at: DateString;
    updated_at: DateString;

    users?: User[];
};


/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

export type User = {
    id: ID;
    role_id: ID;
    name: string;
    email: string;
    email_verified_at: DateString | null;
    created_at: DateString;
    updated_at: DateString;

    role?: Role;

    borrowing_requests?: BorrowingRequest[];
    approved_borrowing_requests?: BorrowingRequest[];
    reviews?: Review[];
};


/*
|--------------------------------------------------------------------------
| Author
|--------------------------------------------------------------------------
*/

export type Author = {
    id: ID;
    name: string;
    created_at: DateString;
    updated_at: DateString;

    profile?: AuthorProfile | null;
    books?: Book[];
};


/*
|--------------------------------------------------------------------------
| Author Profile
|--------------------------------------------------------------------------
*/

export type AuthorProfile = {
    id: ID;
    author_id: ID;
    bio: string | null;
    created_at: DateString;
    updated_at: DateString;

    author?: Author;
};


/*
|--------------------------------------------------------------------------
| Publisher
|--------------------------------------------------------------------------
*/

export type Publisher = {
    id: ID;
    publisher_name: string;
    created_at: DateString;
    updated_at: DateString;

    books?: Book[];
};


/*
|--------------------------------------------------------------------------
| Genre
|--------------------------------------------------------------------------
*/

export type Genre = {
    id: ID;
    genre_name: string;
    created_at: DateString;
    updated_at: DateString;

    books?: Book[];
};


/*
|--------------------------------------------------------------------------
| Book
|--------------------------------------------------------------------------
*/

export type Book = {
    id: ID;
    author_id: ID;
    publisher_id: ID;
    title: string;
    isbn: string | null;
    edition: string | null;
    publication_year: number | null;
    language: string;
    description: string | null;
    cover_image: string | null;
    total_copies: number;
    available_copies: number;
    created_at: DateString;
    updated_at: DateString;

    author?: Author;
    publisher?: Publisher;
    genres?: Genre[];
    borrowing_requests?: BorrowingRequest[];
    reviews?: Review[];
};


/*
|--------------------------------------------------------------------------
| Borrowing Request
|--------------------------------------------------------------------------
*/

export type BorrowingRequest = {
    id: ID;
    user_id: ID;
    book_id: ID;
    approved_by: ID | null;
    status: BorrowingStatus;
    requested_at: DateString;
    approved_at: DateString | null;
    borrowed_at: DateString | null;
    due_date: DateString | null;
    returned_at: DateString | null;
    created_at: DateString;
    updated_at: DateString;

    user?: User;
    book?: Book;
    approver?: User | null;

    is_overdue?: boolean;
};


/*
|--------------------------------------------------------------------------
| Review
|--------------------------------------------------------------------------
*/

export type Review = {
    id: ID;
    user_id: ID;
    book_id: ID;
    stars: number;
    comment: string | null;
    created_at: DateString;
    updated_at: DateString;

    user?: User;
    book?: Book;
};


/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export type AdminDashboardStats = {
    totalBooks: number;
    totalMembers: number;
    totalAuthors: number;
    totalBorrowingRequests: number;
    pendingRequests: number;
    borrowedBooks: number;
    totalReviews: number;
};

export type MemberDashboardStats = {
    totalRequests: number;
    pendingRequests: number;
    borrowedBooks: number;
    totalReviews: number;
};

export type DashboardStats =
    | AdminDashboardStats
    | MemberDashboardStats;


/*
|--------------------------------------------------------------------------
| Select Options
|--------------------------------------------------------------------------
*/

export type SelectOption = {
    value: string | number;
    label: string;
};

