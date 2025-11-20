"use client";

import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Pick a file first");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/extract-tables`, formData);
      setTables(res.data.tables);
    } catch {
      alert("Upload failed");
    }
    setLoading(false);
  };

  const toggleSelect = (table: any) => {
    if (selected.includes(table)) {
      setSelected(selected.filter((t) => t !== table));
      setTables([...tables, table]);
    } else {
      setSelected([...selected, table]);
      setTables(tables.filter((t) => t !== table));
    }
  };

  return (
    <main className="p-8 space-y-8">

      {/* Header */}
      <h1 className="text-3xl font-bold">Table Extractor</h1>

      {/* Upload Box */}
      <div
        className="border-dotted-thin p-6 rounded-lg flex flex-col items-left justify-center cursor-pointer"
        onClick={() => document.getElementById("inputfile")?.click()}
      >
        <input
          id="inputfile"
          type="file"
          hidden
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
        <p className="text-lg">{file ? file.name : "Click to upload document"}</p>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="mt-4 bg-black text-white px-4 py-2 rounded disabled:opacity-40 justify-left"
        >
          {loading ? "Processing..." : "Extract"}
        </button>
      </div>

      {/* Grids */}
      <div className="grid grid-cols-2 gap-4">

        {/* Unselected */}
        <div className="border-dotted-thin p-2 rounded-lg">
          <p className="font-semibold mb-2">Available</p>
          <div className="grid auto-rows-[minmax(100px,auto)] grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
            {tables.map((t, i) => (
              <img
                key={i}
                src={`${API_URL}${t.png_url}`}
                className="border-thin rounded cursor-pointer hover:opacity-60"
                onClick={() => toggleSelect(t)}
              />
            ))}
          </div>
        </div>

        {/* Selected */}
        <div className="border-dotted-thin p-2 rounded-lg">
          <p className="font-semibold mb-2">Selected</p>
          <div className="grid auto-rows-[minmax(100px,auto)] grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
            {selected.map((t, i) => (
              <img
                key={i}
                src={`${API_URL}${t.png_url}`}
                className="border-thin rounded cursor-pointer hover:opacity-60"
                onClick={() => toggleSelect(t)}
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}