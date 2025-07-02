import { FormEvent, useState } from "react";
import { Form, Input, Button } from "@heroui/react";

export type FieldDefinition<T> = {
  name: keyof T;
  label: string;
  required?: boolean;
  type?: "text" | "date" | "number" | "checkbox" | "select" | "email" | "password";
  readOnly?: boolean;
  options?: { label: string; value: any }[]; // para selects
};

export type GenericFormProps<T> = {
  fields: FieldDefinition<T>[];
  initialValues: Partial<T>;
  onSubmit: (values: Partial<T>) => void;
  onCancel: () => void;
  onClose?: () => void;
};

export function GenericForm<T>({
  fields,
  initialValues,
  onSubmit,
  onCancel,
}: GenericFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldName: keyof T
  ) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-lg">
        <Form onSubmit={handleSubmit} className="w-full space-y-4">
          {fields.map((field) => (
            <div key={String(field.name)} className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-700">
                {field.label}
              </label>

              {field.type === "select" ? (
                <select
                  name={String(field.name)}
                  value={String(formData[field.name] ?? "")}
                  onChange={(e) => handleChange(e, field.name)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Seleccione...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  isRequired={field.required}
                  name={String(field.name)}
                  type={field.type}
                  readOnly={field.readOnly}
                  value={
                    field.type === "checkbox"
                      ? undefined
                      : String(formData[field.name] ?? "")
                  }
                  checked={
                    field.type === "checkbox"
                      ? Boolean(formData[field.name])
                      : undefined
                  }
                  onChange={(e) => handleChange(e, field.name)}
                  className="w-full"
                  fullWidth
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="submit"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Guardar
            </Button>
            <Button
              type="button"
              variant="flat"
              className="text-green-600 hover:text-green-700"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
