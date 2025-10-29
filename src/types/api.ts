    // src/types/api.ts

    // Response padrão da API
    export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
    }

    // Resposta de erro da API C#
    export interface ApiError {
    message: string;
    }

    // Paginação
    export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    }

    // ========== AUTENTICAÇÃO ==========

    export interface LoginRequest {
    email: string;
    password: string;
    }

    export interface LoginResponse {
    token: string;
    }

    // ========== USUÁRIOS ==========

    export interface User {
    id: number;
    name: string;
    email:string;
    image?:string;
    phone?: string;
    createdAt?: string;
    }

    export interface CreateUserRequest {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    }

    export interface UpdateUserRequest {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    }

    // ========== PROCEDIMENTOS (Futuro) ==========

    export interface Report {
    id: number;
    covenant: string;
    title: string;
    patient: string;
    procedureName: string;
    date: string;
    dueDate: string;
    emissionDate: string;
    register: string;
    item: string;
    amount: number;
    totalValue: number;
    paidValue: number;
    pedingValue: number;
    cardTribute: number;
    repasse: number;
    status: 'pending' | 'paid';
    }
