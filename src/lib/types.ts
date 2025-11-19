// 基础海报数据类型
export interface PosterData {
  githubUrl: string;
  displayName?: string;
  bio?: string;
  skills?: string[];
  highlights?: string[];
  trustScore?: number;
}

// 海报版本信息
export interface PosterVersion {
  version: number;
  blobId: string;
  trustScore: number;
  createdAt: string; // ISO string
}

// 完整的海报详情
export interface PosterDetail {
  posterId: string;
  owner: string;
  latestVersion: PosterVersion;
  versions: PosterVersion[];
}

// AI 生成输入类型
export interface GenerateBioInput {
  githubUrl: string;
  displayName?: string;
  customBio?: string;
}

// AI 生成结果类型
export interface GenerateBioResult {
  bio: string;
  skills: string[];
  highlights: string[];
  trustScore: number; // 0-100
}

// 表单数据类型
export interface PosterFormValues {
  githubUrl: string;
  displayName?: string;
  customBio?: string;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// 钱包连接状态类型
export interface WalletState {
  isConnected: boolean;
  address?: string;
  connecting: boolean;
}