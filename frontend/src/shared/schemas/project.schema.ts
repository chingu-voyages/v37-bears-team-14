import * as Yup from "yup";

export const ProjectFieldsSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  description: Yup.string().min(2, "Too Short!").max(1000, "Too Long!"),
});
