"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { API_URL } from "@/lib/config";

export const SortableImage = ({ id, item, setPreview, container }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: { item, container },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={() => setPreview(item)}
      className="border-thin rounded cursor-pointer hover:opacity-70 p-1"
    >
      <img src={`${API_URL}${item.png_url}`} className="w-full h-full object-contain" />
    </div>
  );
};