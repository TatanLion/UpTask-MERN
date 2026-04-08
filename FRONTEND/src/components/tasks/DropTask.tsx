import { useDroppable } from "@dnd-kit/core"

interface DropTaskProps {
    status: string;
}

export default function DropTask({ status }: DropTaskProps) {

    const { isOver, setNodeRef } = useDroppable({
        id: status,
    })

    const style = {
        opacity: isOver ? 0.3 : 1,
        backgroundColor: isOver ? "#e5e7eb" : "transparent",
    }

  return (
    <div 
        className="text-xs font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500"
        ref={setNodeRef}
        style={style}
    >
        Soltar tarea aquí
    </div>
  )
}
