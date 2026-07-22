import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Admin</h2>
        <nav style={styles.nav}>
          <NavLink to="/" end style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>
            Dashboard
          </NavLink>
          <NavLink to="/bookings" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>
            Reservas
          </NavLink>
          <NavLink to="/providers" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>
            Proveedores
          </NavLink>
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>Cerrar sesión</button>
      </aside>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: 240, backgroundColor: '#1a1a2e', color: '#fff', display: 'flex', flexDirection: 'column', padding: 24 },
  logo: { fontSize: 20, marginBottom: 32 },
  nav: { display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  link: { color: '#ccc', textDecoration: 'none', padding: '10px 16px', borderRadius: 8, fontSize: 15 },
  active: { backgroundColor: '#16213e', color: '#fff', fontWeight: 600 },
  logoutBtn: { marginTop: 'auto', background: 'none', border: '1px solid #e53935', color: '#e53935', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  main: { flex: 1, backgroundColor: '#f5f5f5', padding: 32 },
};
