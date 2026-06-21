import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notaApi } from '../lib/api.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home' atau 'nota'
  
  const [notasList, setNotasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filter state
  const [filterDate, setFilterDate] = useState('');

  // Form State (tanpa ID)
  const [formData, setFormData] = useState({
    tanggal: '',
    no_nota: '',
    grade: '',
    week: '',
    ikat: '',
    gompi: ''
  });
  
  const [editId, setEditId] = useState(null);

  const EXPIRE_DAYS = 7; // Durasi kadaluarsa 7 hari (bisa disesuaikan)

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
      fetchNotas();
    }
  }, [navigate]);

  const fetchNotas = async () => {
    try {
      const data = await notaApi.getAll();
      setNotasList(data);
    } catch (err) {
      console.error('Failed to fetch nota:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (nota) => {
    setEditId(nota.id);
    const dateFormatted = nota.tanggal ? new Date(nota.tanggal).toISOString().split('T')[0] : '';
    setFormData({
      tanggal: dateFormatted,
      no_nota: nota['no-nota'],
      grade: nota.grade,
      week: nota.week,
      ikat: nota.ikat,
      gompi: nota.gompi
    });
    // Scroll to top/form area if needed, or switch tab to nota (should already be there)
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ tanggal: '', no_nota: '', grade: '', week: '', ikat: '', gompi: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        tanggal: formData.tanggal,
        no_nota: formData.no_nota,
        grade: formData.grade,
        week: formData.week,
        ikat: parseInt(formData.ikat, 10) || 0,
        gompi: parseInt(formData.gompi, 10) || 0,
      };

      if (editId) {
        await notaApi.update(editId, payload);
      } else {
        await notaApi.create(payload);
      }
      
      // Reset form
      setEditId(null);
      setFormData({ tanggal: '', no_nota: '', grade: '', week: '', ikat: '', gompi: '' });
      // Refresh list
      fetchNotas();
    } catch (err) {
      setError(`Gagal ${editId ? 'mengupdate' : 'menyimpan'} nota.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{
        width: '250px',
        background: '#1e293b',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#f8fafc' }}>SIBIT</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>Sistem Inventaris Bunga</p>
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 0' }}>
          <button 
            onClick={() => setActiveTab('home')}
            style={{ ...sidebarButtonStyle, background: activeTab === 'home' ? '#334155' : 'transparent' }}
          >
            🏠 Home Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('nota')}
            style={{ ...sidebarButtonStyle, background: activeTab === 'nota' ? '#334155' : 'transparent' }}
          >
            📝 Isi Nota
          </button>
        </nav>
        
        <div style={{ padding: '1.5rem', borderTop: '1px solid #334155' }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
            User: <strong>{user.name}</strong>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER TOP BAR */}
        <header style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>
            {activeTab === 'home' ? 'Dashboard Overview' : 'Manajemen Nota'}
          </h1>
        </header>

        {/* CONTENT DYNAMIC */}
        <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div style={{
              background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '800px'
            }}>
              <h2 style={{ color: '#1e293b', marginTop: 0 }}>Selamat Datang!</h2>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                Pilih menu "Isi Nota" di sidebar untuk mulai memasukkan data hasil panen.
              </p>
              <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                 <div style={{ padding: '1.5rem', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Total Record Nota</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#6366f1' }}>{notasList.length}</p>
                 </div>
              </div>

              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ color: '#1e293b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  Status Kesegaran (Kadaluarsa {EXPIRE_DAYS} Hari)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {notasList.map((nota, i) => {
                    if (!nota.tanggal) return null;
                    const dateNota = new Date(nota.tanggal);
                    const today = new Date();
                    // reset time to midnight for accurate day diff
                    dateNota.setHours(0,0,0,0);
                    today.setHours(0,0,0,0);
                    const diffTime = today - dateNota;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    
                    let progress = (diffDays / EXPIRE_DAYS) * 100;
                    if (progress < 0) progress = 0;
                    
                    let color = '#22c55e'; // fresh (hijau)
                    if (progress >= 100) {
                      progress = 100;
                      color = '#ef4444'; // expired (merah)
                    } else if (progress >= 70) {
                      color = '#eab308'; // warning (kuning)
                    }
                    
                    const daysLeft = EXPIRE_DAYS - diffDays;
                    const statusText = daysLeft <= 0 ? 'Sudah Kadaluarsa' : `Sisa ${daysLeft} hari`;

                    return (
                      <div key={i} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>
                            Nota: {nota['no-nota']} <span style={{ fontWeight: 'normal', color: '#64748b', fontSize: '0.875rem' }}>(Tgl: {new Date(nota.tanggal).toLocaleDateString('id-ID')})</span>
                          </span>
                          <span style={{ color: color, fontWeight: 'bold', fontSize: '0.875rem' }}>{statusText}</span>
                        </div>
                        <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: color,
                            transition: 'width 0.5s ease-in-out'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                  {notasList.length === 0 && (
                    <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Belum ada data nota.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTA */}
          {activeTab === 'nota' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
              
              {/* PANEL KIRI: FORM INPUT */}
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ color: '#1e293b', marginTop: 0, marginBottom: '1.5rem' }}>{editId ? 'Edit Nota' : 'Input Nota Baru'}</h2>
                
                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#475569' }}>Tanggal</label>
                    <input type="date" name="tanggal" value={formData.tanggal} onChange={handleInputChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#475569' }}>No Nota</label>
                    <input type="text" name="no_nota" value={formData.no_nota} onChange={handleInputChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#475569' }}>Grade</label>
                    <input type="text" name="grade" value={formData.grade} onChange={handleInputChange} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#475569' }}>Week</label>
                    <input type="text" name="week" value={formData.week} onChange={handleInputChange} required style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#475569' }}>Ikat</label>
                      <input type="number" name="ikat" value={formData.ikat} onChange={handleInputChange} required style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#475569' }}>Gompi</label>
                      <input type="number" name="gompi" value={formData.gompi} onChange={handleInputChange} required style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      type="submit" 
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: loading ? '#94a3b8' : (editId ? '#eab308' : '#6366f1'),
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {loading ? 'Menyimpan...' : (editId ? 'Update Nota' : 'Simpan Nota')}
                    </button>
                    {editId && (
                      <button 
                        type="button" 
                        onClick={cancelEdit}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* PANEL KANAN: TABEL DATA */}
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ color: '#1e293b', margin: 0 }}>Daftar Nota</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: '#475569' }}>Filter Tanggal:</label>
                    <input 
                      type="date" 
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      style={{
                        padding: '0.375rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        outline: 'none',
                        fontSize: '0.875rem'
                      }}
                    />
                    {filterDate && (
                      <button 
                        onClick={() => setFilterDate('')}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Tanggal</th>
                      <th style={thStyle}>No Nota</th>
                      <th style={thStyle}>Grade</th>
                      <th style={thStyle}>Week</th>
                      <th style={thStyle}>Ikat</th>
                      <th style={thStyle}>Gompi</th>
                      <th style={thStyle}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notasList
                      .filter(nota => {
                        if (!filterDate) return true;
                        if (!nota.tanggal) return false;
                        // Bandingkan YYYY-MM-DD
                        const d = new Date(nota.tanggal);
                        const dateString = d.toISOString().split('T')[0];
                        return dateString === filterDate;
                      })
                      .map((nota, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e2e8f0', background: editId === nota.id ? '#f0fdf4' : 'transparent' }}>
                        <td style={tdStyle}>{nota.id}</td>
                        <td style={tdStyle}>{nota.tanggal ? new Date(nota.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                        <td style={tdStyle}>{nota['no-nota']}</td>
                        <td style={tdStyle}>{nota.grade}</td>
                        <td style={tdStyle}>{nota.week}</td>
                        <td style={tdStyle}>{nota.ikat}</td>
                        <td style={tdStyle}>{nota.gompi}</td>
                        <td style={tdStyle}>
                          <button 
                            onClick={() => handleEditClick(nota)}
                            style={{
                              background: '#eab308',
                              color: 'white',
                              border: 'none',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '0.75rem'
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    {notasList.length === 0 && (
                      <tr>
                        <td colSpan="8" style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                          Belum ada data nota.
                        </td>
                      </tr>
                    )}
                    {notasList.length > 0 && filterDate && !notasList.some(n => n.tanggal && new Date(n.tanggal).toISOString().split('T')[0] === filterDate) && (
                      <tr>
                        <td colSpan="8" style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                          Tidak ada nota pada tanggal {filterDate}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

const sidebarButtonStyle = {
  width: '100%',
  padding: '1rem 1.5rem',
  color: '#cbd5e1',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'background 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem'
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  outline: 'none'
};

const thStyle = {
  padding: '0.75rem 1rem',
  color: '#475569',
  fontWeight: 600,
  fontSize: '0.875rem'
};

const tdStyle = {
  padding: '0.75rem 1rem',
  color: '#1e293b',
  fontSize: '0.875rem'
};
