import { object, string } from "yup";

export const labelSchema = object().shape({
  name: string().required().label("label name"),
});
