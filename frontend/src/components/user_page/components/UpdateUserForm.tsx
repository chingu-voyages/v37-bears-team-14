import React, { useState, forwardRef, useEffect } from "react";
import { Menu } from "@headlessui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Alert from "../../alerts/Alert";
import { Tech } from "../../../shared/Interfaces";
import { useSession } from "../../../hooks/session";

interface Props {
  chosenTechs: Tech[];
  setChosenTechs: React.Dispatch<React.SetStateAction<any[]>>;
  removeTech: (e: any, chosenTech: object) => void;
  techs: Tech[];
  setTechs: React.Dispatch<React.SetStateAction<any[]>>;
  chooseTech: (e: any, chosenTech: object) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userForm: boolean;
  setuserForm: React.Dispatch<React.SetStateAction<boolean>>;
  techUpdated: boolean;
  setTechUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  initializeTechs: (techArray: object[]) => void;
}

interface FormValues {
  username: string;
  displayName: string;
  techs: string[];
}

const UpdateUserSchema = Yup.object().shape({
  username: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  displayName: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
});

const UpdateUserForm: React.FC<Props> = ({
  chosenTechs,
  setChosenTechs,
  removeTech,
  techs,
  setTechs,
  chooseTech,
  loading,
  setLoading,
  userForm,
  setuserForm,
  techUpdated,
  setTechUpdated,
  initializeTechs,
}) => {
  const [customOpen, setCustomOpen] = useState(false);
  const [userUpdated, setuserUpdated] = useState(false);
  const { user } = useSession();

  const CustomMenuButton = forwardRef<HTMLButtonElement>(
    ({ children }, ref) => (
      <button
        className="orange-btn"
        onClick={() => setCustomOpen(!customOpen)}
        ref={ref}
      >
        {children}
      </button>
    )
  );
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    let isMounted = false;

    const fetchData = async () => {
      if (!isMounted && !techUpdated) {
        const resp = await fetch(`/api/v1/users/${user?.id}`);
        const data = await resp.json();

        initializeTechs(data.techs);
        isMounted = true;
        setTechUpdated(true);
      }
    };

    fetchData();
    return () => {
      isMounted = true;
    }; // cleanup
  }, [initializeTechs, setTechUpdated, techUpdated, user?.id]);

  return (
    <>
      <Formik
        initialValues={{
          username: user ? user.username : "",
          displayName: user ? user.displayName : "",
          techs: [],
          //techs: [{"createdAt":"2022-02-10T05:22:12.503Z","description":"Fast, scalable, distributed revision control system","name":"Git","updatedAt":"2022-02-10T06:33:28.243Z","imageUrl":"https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png","id":"6204a105a00bb005827f5b82"}] as Array<any>
        }}
        validationSchema={UpdateUserSchema}
        onSubmit={(values: FormValues, { resetForm }) => {
          // same shape as initial values
          values.techs = chosenTechs.map((t) => t.id);
          function updateUser(values: FormValues) {
            // setLoading(true);

            if (user && user.id) {
              fetch(`/api/v1/users/${user.id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
              }).then((response) => {
                if (response.status === 200) {
                  // setLoading(false);
                  resetForm();
                  //setTechs([...techs, ...chosenTechs]);
                  //setTechs([]);
                  techs.sort((a: Tech, b: Tech) => (a.name > b.name ? 1 : -1));
                  //setChosenTechs([]);
                  setuserUpdated(true);
                  setTimeout(() => {
                    setuserUpdated(false);
                  }, 2000);
                } else {
                  console.error(
                    "failed to update user",
                    response.status,
                    response.json()
                  );
                }
              });
            }
          }
          updateUser(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4 max-h-screen">
            <h2 className="text-xl text-center font-bold">Settings</h2>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Username
              </label>
              <Field
                name="username"
                min="2"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {errors.username && touched.username ? (
              <div>{errors.username}</div>
            ) : null}
            <div className="mb-6">
              <label
                htmlFor="displayName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Display Name
              </label>
              <Field
                min="2"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-h-48"
                name="displayName"
              />
            </div>
            {errors.displayName && touched.displayName ? (
              <div>{errors.displayName}</div>
            ) : null}
            <div className="flex justify-start">
              {chosenTechs.map((tech: Tech, index: number) => (
                <div className="relative m-1" key={index}>
                  <div
                    className="absolute top-0 right-0 cursor-pointer bg-slate-300 border-white rounded-full"
                    onClick={(e) => removeTech(e, tech)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="#64748b"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <img
                    className="h-12 mx-auto flex justify-center"
                    alt={tech.name}
                    src={tech.imageUrl}
                  />
                  <div className="p-1 m-1 text-xs text-slate-600 bg-slate-300 rounded-md flex justify-center font-bold">
                    {tech.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <Menu>
                {({ open }) => (
                  <>
                    <Menu.Button as={CustomMenuButton}>
                      {customOpen ? "Close Techs List" : "Add Technologies"}
                    </Menu.Button>
                    {customOpen && (
                      <Menu.Items
                        static
                        className="bg-white max-w-lg text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4 max-h-48 overflow-y-scroll"
                      >
                        {techs
                          .sort((a: Tech, b: Tech) =>
                            a.name > b.name ? 1 : -1
                          )
                          .map((tech: Tech, index: number) => (
                            <Menu.Item key={index}>
                              {({ active }) => (
                                <>
                                  <div
                                    onClick={(e) => chooseTech(e, tech)}
                                    className="flex justify-between items-center h-12 p-2 cursor-pointer hover:bg-neutral-300 align-baseline"
                                  >
                                    <img
                                      className=" h-10"
                                      src={tech?.imageUrl}
                                      alt={tech.name}
                                    />

                                    <a
                                      className={`block p-2 ${
                                        active && "bg-blue-500"
                                      }`}
                                      href="/account-settings"
                                    >
                                      {tech.name}
                                    </a>
                                  </div>
                                </>
                              )}
                            </Menu.Item>
                          ))}
                      </Menu.Items>
                    )}
                  </>
                )}
              </Menu>
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="main-btn">
                Update User
              </button>
              <button
                type="button"
                className="main-btn"
                onClick={() => setuserForm(() => !userForm)}
              >
                Close
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {userUpdated && (
        <>
          <Alert message={"User updated"} />
        </>
      )}
    </>
  );
};

export default UpdateUserForm;
