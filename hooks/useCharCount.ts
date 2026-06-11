import { useWatch, Control, FieldValues, Path } from "react-hook-form";

const useCharCount = <T extends FieldValues>(
  control: Control<T>,
  name: Path<T>,
  maxLength: number
) => {
  const value = useWatch({ control, name }) ?? "";
  const current = String(value).length;
  return `${current}/${maxLength}`;
};

export default useCharCount;
