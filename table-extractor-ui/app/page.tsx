"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [unselected, setUnselected] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleUpload = async () => {
    if (!file) return alert("Choose a file first");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/extract-tables`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUnselected(res.data.tables);
    } catch (err) {
      alert("Error processing file");
    }
    setLoading(false);
  };

  const toggleSelect = (table: any) => {
    setUnselected((old) => old.filter((t) => t !== table));
    setSelected((old) => [...old, table]);
  };

  const toggleUnselect = (table: any) => {
    setSelected((old) => old.filter((t) => t !== table));
    setUnselected((old) => [...old, table]);
  };

  const onDragEnd = (e: any) => {
    if (!e.over) return;
    const srcId = e.active.id;
    const destId = e.over.id;

    const all = [...unselected, ...selected];
    const fromIndex = all.findIndex((t) => t.id === srcId);
    const toIndex = all.findIndex((t) => t.id === destId);
    const reordered = arrayMove(all, fromIndex, toIndex);

    const mid = reordered.length - selected.length;
    setUnselected(reordered.slice(0, mid));
    setSelected(reordered.slice(mid));
  };

  return (
    <main className="p-6 space-y-6">
      <section className="border border-black dark:border-white border-dashed p-6 rounded flex flex-col items-left">
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent rounded-full"
          />
        ) : (
          <>
            <input
              type="file"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              className="p-2"
            />
            <button
              onClick={handleUpload}
              className="mt-3 border border-black dark:border-white px-4 py-1 rounded hover:opacity-70 "
            >
              Upload & Extract
            </button>
          </>
        )}
      </section>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-2 gap-4">
          <TableContainer title="Unselected" items={unselected} select={toggleSelect} setModal={setModal} />
          <TableContainer title="Selected" items={selected} select={toggleUnselect} setModal={setModal} />
        </div>
      </DndContext>

      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-left justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
          >
            <motion.img
              src={`${API_URL}${modal}`}
              className="max-h-[90vh] border border-white rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function TableContainer({ title, items, select, setModal }) {
  return (
    <div className="border border-black dark:border-white border-dashed rounded p-3 space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <SortableContext items={items.map((t) => t.id)}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((t) => (
            <TableCard key={t.id} table={t} select={select} setModal={setModal} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function TableCard({ table, select, setModal }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: table.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-black dark:border-white border-dashed rounded p-2 flex flex-col items-center hover:cursor-grab"
      {...attributes}
      {...listeners}
    >
      <img
        src={`${API_URL}${table.png_url}`}
        className="max-h-40 border border-black dark:border-white rounded mb-2 hover:opacity-70"
        onClick={() => setModal(table.png_url)}
      />
      <label className="flex items-center space-x-1">
        <input type="checkbox" onChange={() => select(table)} />
        <span>Select</span>
      </label>
    </div>
  );
}