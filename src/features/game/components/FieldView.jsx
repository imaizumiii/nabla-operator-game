import { BlockMath } from "react-katex";

export default function FieldView({ owner, field, selectedField, onSelectField }) {

  const handleSelect = (id) => {
    const isSelected = selectedField?.owner === owner && selectedField?.id === id;
    const newSelected = isSelected ? null : { owner, id };
    onSelectField(newSelected);

  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {field.map(card => {
        const isSelected = selectedField?.owner === owner && selectedField?.id === card.id;
        return (
          <div
            key={card.id}
            onClick={() => handleSelect(card.id)}
            className={`p-2 border rounded cursor-pointer text-center
            ${isSelected ? "bg-blue-100 dark:bg-blue-800 border-blue-500" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
              `}
          >
            <BlockMath math={card.display} />
          </div>
        )
      })}
    </div>
  )
}