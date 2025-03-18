// import { useState } from "react";
import { Button, Input, Label, Select } from "@/app/components/ui"
// , Textarea
import React from "react";

// Define types for event handlers
export type InputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;
export type SelectChangeEvent = (e: React.ChangeEvent<HTMLSelectElement>) => void;
export type TextareaChangeEvent = (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
export type GenericChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;

// Define Equipment Type
export interface Equipment {
  name: string;
  type: string;
  manufacturer: string;
  serialNumber: string;
  purchaseDate: string;
  location: string;
  notes?: string;
}

// Define Specification Type
export interface Specification {
  key: string;
  value: string;
}

// Define Props for EquipmentForm Component
export interface EquipmentFormProps {
  dialogTitle: string;
  equipment: Equipment;
  setEquipment: React.Dispatch<React.SetStateAction<Equipment>>;
  specs: Specification[];
  setSpecs: React.Dispatch<React.SetStateAction<Specification[]>>;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  dialogTitle,
  equipment,
  setEquipment,
  specs,
  setSpecs,
  onSubmit,
  onCancel,
}) => {
  const handleDeviceChange: GenericChangeEvent = (e) => {
    setEquipment({ ...equipment, [e.target.name]: e.target.value });
  };

  const handleSpecChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== "key" && name !== "value") return;
    const newSpecs = [...specs];
    newSpecs[index] = { ...newSpecs[index], [name]: value };
    setSpecs(newSpecs);
  };

  const addSpecField = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">{dialogTitle}</h2>
      <div className="mb-4">
        <Label>Name</Label>
        <Input type="text" name="name" value={equipment.name} onChange={handleDeviceChange} required />
      </div>
      <div className="mb-4">
        <Label>Type</Label>
        <Select name="type" value={equipment.type} onChange={handleDeviceChange} required>
          <option value="">Select Type</option>
          <option value="Laptop">Laptop</option>
          <option value="Desktop">Desktop</option>
          <option value="Server">Server</option>
        </Select>
      </div>
      <div className="mb-4">
        <Label>Manufacturer</Label>
        <Input type="text" name="manufacturer" value={equipment.manufacturer} onChange={handleDeviceChange} required />
      </div>
      <div className="mb-4">
        <Label>Serial Number</Label>
        <Input type="text" name="serialNumber" value={equipment.serialNumber} onChange={handleDeviceChange} required />
      </div>
      <div className="mb-4">
        <Label>Purchase Date</Label>
        <Input type="date" name="purchaseDate" value={equipment.purchaseDate} onChange={handleDeviceChange} required />
      </div>
      <div className="mb-4">
        <Label>Location</Label>
        <Input type="text" name="location" value={equipment.location} onChange={handleDeviceChange} required />
      </div>
      <h2 className="text-xl font-semibold mt-6 mb-4">Device Specifications</h2>
      {specs.map((spec, index) => (
        <div key={index} className="mb-4 flex gap-4">
          <Input type="text" name="key" placeholder="Specification Key" value={spec.key} onChange={(e) => handleSpecChange(index, e)} required />
          <Input type="text" name="value" placeholder="Specification Value" value={spec.value} onChange={(e) => handleSpecChange(index, e)} required />
        </div>
      ))}
      <Button type="button" onClick={addSpecField} className="mb-4">Add Specification</Button>
      <Button type="submit">Submit</Button>
      <Button type="button" onClick={onCancel} className="ml-2 bg-red-500 hover:bg-red-600">Cancel</Button>
    </form>
  );
};
