import { FunctionComponent } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { ProjectPageContext } from "../layouts/ProjectPageLayout";

interface ProjectSettingsFormValues {
  name: string;
  description: string;
}

const ProjectSettingsFormSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  description: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
});

const ProjectSettingsForm: FunctionComponent<ProjectPageContext> = ({
  project,
  setProject,
}) => {
  return (
    <Formik
      initialValues={{
        name: project.name,
        description: project.description,
      }}
      validationSchema={ProjectSettingsFormSchema}
      onSubmit={(values: ProjectSettingsFormValues, { resetForm }) => {
        const saveProject = async () => {
          const resp = await fetch("/api/v1/projects/" + project.id, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(values),
          });

          if (resp.status === 200) {
            setProject(await resp.json());
          } else {
            console.error("failed to update project", await resp.json());
          }
        };

        saveProject().catch(console.error);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <Field
              id="name"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.name && touched.name ? (
              <div className="bg-orange-200 rounded p-2 text-sm my-2 text-slate-800">
                {errors.name}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description
            </label>
            <Field
              id="description"
              name="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.description && touched.description ? (
              <div className="bg-orange-200 rounded p-2 text-sm my-2 text-slate-800">
                {errors.description}
              </div>
            ) : null}
          </div>

          <input
            type="submit"
            className="main-btn cursor-pointer"
            value="Update"
          />
        </Form>
      )}
    </Formik>
  );
};

export default ProjectSettingsForm;
