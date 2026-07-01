import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { api, type Task, type User } from './lib/api';

type Mode = 'login' | 'register';

const emptyTask = { title: '', description: '', status: 'TODO' as const };

export default function App() {
  const [mode, setMode] = useState<Mode>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [taskForm, setTaskForm] = useState(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const isAuthenticated = !!currentUser;

  const sortedTasks = useMemo(() => tasks, [tasks]);

  async function loadSession() {
    try {
      const me = await api.me();
      setCurrentUser(me.data?.user ?? null);
      const taskRes = await api.listTasks();
      setTasks(taskRes.data?.tasks ?? []);
      if (me.data?.user.role === 'ADMIN') {
        const users = await api.adminUsers();
        setAdminUsers(users.data?.users ?? []);
      }
    } catch {
      setCurrentUser(null);
      setTasks([]);
      setAdminUsers([]);
    }
  }

  useEffect(() => {
    void loadSession();
  }, []);

  async function handleAuthSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const payload = mode === 'register'
        ? { name: authForm.name, email: authForm.email, password: authForm.password }
        : { email: authForm.email, password: authForm.password };

      const result = mode === 'register'
        ? await api.register(payload)
        : await api.login(payload as { email: string; password: string });

      setCurrentUser(result.data?.user ?? null);
      setMessage(result.message ?? (mode === 'register' ? 'Registered' : 'Logged in'));
      const taskRes = await api.listTasks();
      setTasks(taskRes.data?.tasks ?? []);

      if (result.data?.user.role === 'ADMIN') {
        const users = await api.adminUsers();
        setAdminUsers(users.data?.users ?? []);
      }

      setAuthForm({ name: '', email: '', password: '' });
      setMode('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setError('');
    setMessage('');
    try {
      await api.logout();
      setCurrentUser(null);
      setTasks([]);
      setAdminUsers([]);
      setTaskForm(emptyTask);
      setEditingTaskId(null);
      setMessage('Logged out');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    }
  }

  async function handleTaskSubmit(e: FormEvent) {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (editingTaskId) {
        await api.updateTask(editingTaskId, {
          title: taskForm.title,
          description: taskForm.description,
          status: taskForm.status
        });
        setMessage('Task updated');
      } else {
        await api.createTask({
          title: taskForm.title,
          description: taskForm.description,
          status: taskForm.status
        });
        setMessage('Task created');
      }

      const taskRes = await api.listTasks();
      setTasks(taskRes.data?.tasks ?? []);
      setTaskForm(emptyTask);
      setEditingTaskId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Task action failed');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(task: Task) {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description ?? '',
      status: task.status
    });
  }

  async function handleDeleteTask(id: string) {
    setError('');
    setMessage('');
    try {
      await api.deleteTask(id);
      const taskRes = await api.listTasks();
      setTasks(taskRes.data?.tasks ?? []);
      setMessage('Task deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Backend Developer Intern Assignment</p>
          <h1>Auth, roles, CRUD, validation, and Swagger in one demo</h1>
          <p className="subtext">
            Built to show clean structure, secure JWT cookies, and simple frontend interaction.
          </p>
        </div>
        <div className="badge">
          <span>Versioned API</span>
          <span>Role-based access</span>
          <span>Postgres / Neon</span>
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <div className="card-header">
            <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
            <button
              className="link-button"
              onClick={() => {
                setMode(mode === 'register' ? 'login' : 'register');
                setError('');
                setMessage('');
              }}
            >
              Switch to {mode === 'register' ? 'login' : 'register'}
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="form">
            {mode === 'register' && (
              <input
                placeholder="Name"
                value={authForm.name}
                onChange={(e) => setAuthForm((s) => ({ ...s, name: e.target.value }))}
              />
            )}
            <input
              placeholder="Email"
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm((s) => ({ ...s, email: e.target.value }))}
            />
            <input
              placeholder="Password"
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm((s) => ({ ...s, password: e.target.value }))}
            />

            <button className="primary" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Login'}
            </button>
          </form>

          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Dashboard</h2>
            <button className="secondary" onClick={handleLogout} disabled={!isAuthenticated}>
              Logout
            </button>
          </div>

          {currentUser ? (
            <>
              <div className="profile">
                <div>
                  <strong>{currentUser.name}</strong>
                  <p>{currentUser.email}</p>
                </div>
                <span className="role">{currentUser.role}</span>
              </div>

              <form onSubmit={handleTaskSubmit} className="form">
                <input
                  placeholder="Task title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm((s) => ({ ...s, title: e.target.value }))}
                />
                <textarea
                  placeholder="Description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm((s) => ({ ...s, description: e.target.value }))}
                />
                <select
                  value={taskForm.status}
                  onChange={(e) =>
                    setTaskForm((s) => ({
                      ...s,
                      status: e.target.value as Task['status']
                    }))
                  }
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>

                <button className="primary" disabled={loading}>
                  {editingTaskId ? 'Update task' : 'Create task'}
                </button>

                {editingTaskId && (
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setEditingTaskId(null);
                      setTaskForm(emptyTask);
                    }}
                  >
                    Cancel edit
                  </button>
                )}
              </form>

              <div className="list">
                <h3>Your tasks</h3>
                {sortedTasks.length === 0 ? (
                  <p className="muted">No tasks yet.</p>
                ) : (
                  sortedTasks.map((task) => (
                    <article className="task" key={task.id}>
                      <div>
                        <strong>{task.title}</strong>
                        <p>{task.description || 'No description'}</p>
                        <small>
                          {task.status} · {task.user?.name ?? 'You'}
                        </small>
                      </div>
                      <div className="actions">
                        <button className="secondary" onClick={() => startEdit(task)}>
                          Edit
                        </button>
                        <button className="danger" onClick={() => void handleDeleteTask(task.id)}>
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {currentUser.role === 'ADMIN' && (
                <div className="list">
                  <h3>Admin-only users</h3>
                  {adminUsers.length === 0 ? (
                    <p className="muted">No admin data loaded.</p>
                  ) : (
                    adminUsers.map((user) => (
                      <div className="mini-row" key={user.id}>
                        <span>{user.name}</span>
                        <span>{user.email}</span>
                        <span>{user.role}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="muted">Log in to see the dashboard and protected APIs.</p>
          )}
        </section>
      </main>

      <section className="footer-note">
        <p>
          Swagger: <code>http://localhost:4000/api-docs</code> · Health: <code>http://localhost:4000/health</code>
        </p>
      </section>
    </div>
  );
}
