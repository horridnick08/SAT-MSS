import { apiClient } from './client';
import type {
  IAoiWithStats,
  ICreateAoiRequest,
  IUpdateAoiRequest,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '@satmss/shared-types';

export interface ListAoisParams {
  stateCode?: string;
  districtName?: string;
  isActive?: boolean;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  page?: number;
  pageSize?: number;
}

export const aoiApi = {
  list: async (params?: ListAoisParams): Promise<ApiPaginatedResponse<IAoiWithStats>> => {
    const response = await apiClient.get<ApiPaginatedResponse<IAoiWithStats>>('/aois', {
      params,
    });
    return response.data;
  },

  create: async (data: ICreateAoiRequest): Promise<ApiSuccessResponse<IAoiWithStats>> => {
    const response = await apiClient.post<ApiSuccessResponse<IAoiWithStats>>('/aois', data);
    return response.data;
  },

  getById: async (id: string): Promise<ApiSuccessResponse<IAoiWithStats>> => {
    const response = await apiClient.get<ApiSuccessResponse<IAoiWithStats>>(`/aois/${id}`);
    return response.data;
  },

  update: async (id: string, data: IUpdateAoiRequest): Promise<ApiSuccessResponse<IAoiWithStats>> => {
    const response = await apiClient.patch<ApiSuccessResponse<IAoiWithStats>>(`/aois/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiSuccessResponse<{ success: boolean }>> => {
    const response = await apiClient.delete<ApiSuccessResponse<{ success: boolean }>>(`/aois/${id}`);
    return response.data;
  },
};
