
import React, { useState } from "react";
import { v4 as uuid } from "uuid";

const defaultField = () => ({
  id: uuid(),
  key: "",
  type: "String",
  children: [],
});

const SchemaField = ({ field, onChange, onDelete }) => {
  const handleKeyChange = (e) => {
    onChange(field.id, { ...field, key: e.target.value });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const updated = {
      ...field,
      type: newType,
      children: newType === "Nested" ? [defaultField()] : [],
    };
    onChange(field.id, updated);
  };

  const handleAddChild = () => {
    const updated = {
      ...field,
      children: [...field.children, defaultField()],
    };
    onChange(field.id, updated);
  };

  const handleChildChange = (childId, updatedChild) => {
    const updatedChildren = field.children.map((child) =>
      child.id === childId ? updatedChild : child
    );
    onChange(field.id, { ...field, children: updatedChildren });
  };

  const handleChildDelete = (childId) => {
    const updatedChildren = field.children.filter((child) => child.id !== childId);
    onChange(field.id, { ...field, children: updatedChildren });
  };

  return (
    <div style={{ marginLeft: "20px", marginTop: "10px", borderLeft: "1px dashed gray", paddingLeft: "10px" }}>
      <input
        placeholder="Key"
        value={field.key}
        onChange={handleKeyChange}
        style={{ marginRight: "10px" }}
      />
      <select value={field.type} onChange={handleTypeChange} style={{ marginRight: "10px" }}>
        <option value="String">String</option>
        <option value="Number">Number</option>
        <option value="Nested">Nested</option>
      </select>
      <button onClick={() => onDelete(field.id)} style={{ marginRight: "10px" }}>Delete</button>

      {field.type === "Nested" && (
        <div>
          {field.children.map((child) => (
            <SchemaField
              key={child.id}
              field={child}
              onChange={handleChildChange}
              onDelete={handleChildDelete}
            />
          ))}
          <button onClick={handleAddChild}>Add Nested Field</button>
        </div>
      )}
    </div>
  );
};

const generateJSON = (fields) => {
  const result = {};
  for (let field of fields) {
    if (!field.key) continue;
    if (field.type === "Nested") {
      result[field.key] = generateJSON(field.children);
    } else {
      result[field.key] = field.type === "String" ? "" : 0;
    }
  }
  return result;
};

export default function App() {
  const [fields, setFields] = useState([defaultField()]);

  const handleChange = (id, updatedField) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? updatedField : field))
    );
  };

  const handleDelete = (id) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleAdd = () => {
    setFields([...fields, defaultField()]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>JSON Schema Builder</h2>
      {fields.map((field) => (
        <SchemaField
          key={field.id}
          field={field}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      ))}
      <button onClick={handleAdd} style={{ marginTop: "10px" }}>
        Add Field
      </button>

      <h3>Generated JSON Schema:</h3>
      <pre>{JSON.stringify(generateJSON(fields), null, 2)}</pre>
    </div>
  );
}
