export { Button } from "./Button";
export { Input } from "./Input";
export { Label } from "./Label";
export { Select } from "./Select";
export { Textarea } from "./Textarea";

// Define types for event handlers
export type InputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;
export type SelectChangeEvent = (e: React.ChangeEvent<HTMLSelectElement>) => void;
export type TextareaChangeEvent = (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
export type GenericChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
