const request = require('supertest');
const app = require('./app');
const { createClient } = require('@libsql/client');

jest.mock('@libsql/client');

describe('Aplikasi Yang Menurut Kamu Lagi Hype Enterprise - Unit Tests', () => {
  let mockExecute;

  beforeEach(() => {
    mockExecute = jest.fn();
    createClient.mockReturnValue({
      execute: mockExecute,
    });
    jest.clearAllMocks();
  });

  describe('Project Management', () => {
    test('POST /api/projects - Berhasil membuat proyek baru', async () => {
      const newProject = {
        name: 'Sistem AI Baru',
        description: 'Membangun core engine AI',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        status: 'Planning',
        budget: 250000000,
        manager_id: 1
      };

      mockExecute.mockResolvedValueOnce({ rowsAffected: 1, lastInsertRowid: 3 });

      const res = await request(app)
        .post('/api/projects')
        .send(newProject);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Proyek berhasil dibuat');
      expect(mockExecute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO projects'),
        expect.any(Array)
      );
    });

    test('GET /api/projects - Berhasil mengambil daftar proyek', async () => {
      const mockProjects = [
        { id: 1, name: 'Website Redesign', status: 'In Progress' },
        { id: 2, name: 'New Product Launch', status: 'Planning' }
      ];

      mockExecute.mockResolvedValueOnce({ rows: mockProjects });

      const res = await request(app).get('/api/projects');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].name).toBe('Website Redesign');
    });
  });

  describe('Task Management', () => {
    test('POST /api/tasks - Berhasil membuat tugas baru', async () => {
      const newTask = {
        project_id: 1,
        name: 'Setup Database',
        description: 'Konfigurasi Turso SQLite',
        due_date: '2024-02-01',
        assigned_to_id: 2,
        status: 'To Do',
        priority: 'High'
      };

      mockExecute.mockResolvedValueOnce({ rowsAffected: 1 });

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Tugas berhasil ditambahkan');
    });

    test('PUT /api/tasks/:id - Berhasil update status tugas', async () => {
      mockExecute.mockResolvedValueOnce({ rowsAffected: 1 });

      const res = await request(app)
        .put('/api/tasks/101')
        .send({ status: 'Done' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Status tugas diperbarui');
    });
  });

  describe('User Management', () => {
    test('GET /api/users - Berhasil mengambil data tim', async () => {
      const mockUsers = [
        { id: 1, name: 'Alice Smith', role: 'Project Manager' },
        { id: 2, name: 'Bob Johnson', role: 'Developer' }
      ];

      mockExecute.mockResolvedValueOnce({ rows: mockUsers });

      const res = await request(app).get('/api/users');

      expect(res.statusCode).toBe(200);
      expect(res.body.data[1].name).toBe('Bob Johnson');
    });
  });

  describe('Error Handling & Validation', () => {
    test('POST /api/projects - Gagal jika field wajib kosong', async () => {
      const invalidProject = { description: 'Tanpa Nama' };

      const res = await request(app)
        .post('/api/projects')
        .send(invalidProject);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Nama proyek wajib diisi');
    });

    test('GET /api/projects/:id - 404 jika proyek tidak ditemukan', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get('/api/projects/999');

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Proyek tidak ditemukan');
    });
  });
});