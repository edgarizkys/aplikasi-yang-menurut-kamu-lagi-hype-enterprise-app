// api.js
const API_BASE_URL = '/api'; // Backend API base path

async function apiClient(endpoint, { method = 'GET', body = null, params = {}, tenantId = 'default_tenant' } = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
    };

    const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url.toString(), config);
        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'API request failed');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// --- Projects API ---
export const getAllProjects = (page = 1, limit = 20, tenantId) =>
    apiClient('/projects', { params: { page, limit }, tenantId });
export const getProjectById = (id, tenantId) =>
    apiClient(`/projects/${id}`, { tenantId });
export const createProject = (projectData, tenantId) =>
    apiClient('/projects', { method: 'POST', body: projectData, tenantId });
export const updateProject = (id, projectData, tenantId) =>
    apiClient(`/projects/${id}`, { method: 'PUT', body: projectData, tenantId });
export const deleteProject = (id, tenantId) =>
    apiClient(`/projects/${id}`, { method: 'DELETE', tenantId });

// --- Tasks API ---
export const getAllTasks = (page = 1, limit = 20, tenantId) =>
    apiClient('/tasks', { params: { page, limit }, tenantId });
export const getTaskById = (id, tenantId) =>
    apiClient(`/tasks/${id}`, { tenantId });
export const createTask = (taskData, tenantId) =>
    apiClient('/tasks', { method: 'POST', body: taskData, tenantId });
export const updateTask = (id, taskData, tenantId) =>
    apiClient(`/tasks/${id}`, { method: 'PUT', body: taskData, tenantId });
export const deleteTask = (id, tenantId) =>
    apiClient(`/tasks/${id}`, { method: 'DELETE', tenantId });

// --- Users API ---
export const getAllUsers = (page = 1, limit = 20, tenantId) =>
    apiClient('/users', { params: { page, limit }, tenantId });
export const getUserById = (id, tenantId) =>
    apiClient(`/users/${id}`, { tenantId });
export const createUser = (userData, tenantId) =>
    apiClient('/users', { method: 'POST', body: userData, tenantId });
export const updateUser = (id, userData, tenantId) =>
    apiClient(`/users/${id}`, { method: 'PUT', body: userData, tenantId });
export const deleteUser = (id, tenantId) =>
    apiClient(`/users/${id}`, { method: 'DELETE', tenantId });

// --- Relation Data Fetchers (for dropdowns, etc.) ---
export const getProjectManagers = (tenantId) =>
    apiClient('/users', { params: { role: 'Project Manager', limit: 9999 }, tenantId }); // Fetch all managers
export const getAssignableUsers = (tenantId) =>
    apiClient('/users', { params: { limit: 9999 }, tenantId }); // Fetch all users for task assignment
export const getAllProjectsSimple = (tenantId) =>
    apiClient('/projects', { params: { limit: 9999 }, tenantId }); // Fetch all projects for task relation