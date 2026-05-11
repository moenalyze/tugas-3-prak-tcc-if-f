import React, { useState, useEffect } from 'react';

function App() {
  const [notes, setNotes] = useState([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://backend-053-729492539702.us-central1.run.app/notes';

  // Ambil Data (View)
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Simpan Data (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !isi) return alert("Isi judul dan kontennya dulu!");

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
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  // Hapus Data (Delete)
  const deleteNote = async (id) => {
    if (window.confirm("Yakin mau hapus catatan ini?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchNotes();
      } catch (err) {
        console.error("Error deleting note:", err);
      }
    }
  };

  // Set Mode Edit
  const startEdit = (note) => {
    setJudul(note.judul);
    setIsi(note.isi);
    setEditId(note.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">My Cloud Notes</h1>
          <p className="text-gray-500">Tugas 3 Praktikum TCC - Deployment App Engine & Cloud Run</p>
        </header>

        {/* Form Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-10 border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editId ? '📝 Edit Catatan' : '➕ Tambah Catatan Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Judul Catatan..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
            />
            <textarea
              placeholder="Tuliskan isi catatanmu di sini..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200"
              >
                {editId ? 'Perbarui Catatan' : 'Simpan ke Cloud'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => { setEditId(null); setJudul(''); setIsi(''); }}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Notes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10 text-gray-500 italic">Mengambil data dari Cloud Run...</div>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 truncate border-b pb-2">{note.judul}</h3>
                  <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">{note.isi}</p>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => startEdit(note)}
                    className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-500 hover:text-red-700 font-semibold text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400">Database masih kosong, ayo buat catatan!</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;