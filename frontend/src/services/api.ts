import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 5000,
});

export const apiService = {
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  getLocations: async () => {
    const response = await api.get('/locations');
    return response.data;
  },

  getRisk: async (locationId: number, crop: string) => {
    const response = await api.get(`/risk/${locationId}/crop/${crop}`);
    return response.data;
  },

  getAdvisory: async (locationId: number, crop: string, stage: string) => {
    const response = await api.get(`/advisory/${locationId}/${crop}/${stage}`);
    return response.data;
  },

  getMapRisk: async () => {
    const response = await api.get('/map/risk');
    return response.data;
  },

  getBlocks: async () => {
    const response = await api.get('/blocks');
    return response.data;
  },

  getRainfall: async (locationId: number) => {
    const response = await api.get(`/rainfall/${locationId}`);
    return response.data;
  }
};
