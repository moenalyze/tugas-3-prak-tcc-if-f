import React, { useState, useEffect } from 'react';

function App() {
  const [notes, setNotes] = useState([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [editId, setEditId] = useState(null);

  const API_URL = 'https://backend-053-729492539702.us-central1.run.app/notes';

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setNotes(result.data || result); 
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const saveNote = async (e) => {
    e.preventDefault();
    if (!judul || !isi) return alert("Judul dan isi harus diisi!");

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    try {
      await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judul, isi })
      });
      
      setJudul('');
      setIsi('');
      setEditId(null);
      fetchNotes();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  const editNote = (note) => {
    setJudul(note.judul);
    setIsi(note.isi);
    setEditId(note.id);
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Yakin mau hapus catatan ini?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchNotes();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    }
  };

  // Tampilan UI dengan styling CSS inline sederhana
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>📝 CatatanKu (React Version)</h1>
      
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
        <form onSubmit={saveNote}>
          <input 
            type="text" 
            placeholder="Judul Catatan" 
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <textarea 
            placeholder="Tulis isinya di sini..." 
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ background: '#0056b3', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
            {editId ? 'Update Catatan' : 'Simpan Catatan'}
          </button>
        </form>
      </div>

      <div>
        {notes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Belum ada catatan.</p>
        ) : (
          notes.map(note => (
            <div key={note.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{note.judul}</h3>
              <p style={{ margin: '0 0 15px 0', whiteSpace: 'pre-wrap' }}>{note.isi}</p>
              <div>
                <button onClick={() => editNote(note)} style={{ marginRight: '10px', background: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => deleteNote(note.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;