import { Menu } from "@headlessui/react";
import {
  Dispatch,
  FC,
  forwardRef,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Project, Tech } from "../../../../../shared/Interfaces";

export interface AddTechModalProps {
  project: Project;
  setProject: Dispatch<SetStateAction<Project>>;
  onClose?: () => void;
}

const loadAllTechs = async () => {
  const getPage = async (gt?: string): Promise<Tech[]> => {
    let url = "/api/v1/techs";
    if (gt) {
      url += "?gt=" + gt;
    }
    const resp = await fetch(url);
    if (resp.status === 200 || resp.status === 304) {
      return (await resp.json()) as Tech[];
    } else {
      console.error("failed to get page", resp.status);
      throw new Error("failed to get tech " + resp.status);
    }
  };

  let techs: Tech[] = [];
  let page: Tech[] = [];
  let gt = "";

  do {
    page = await getPage(gt);
    techs = techs.concat(page);
    if (page.length > 0) {
      gt = page[page.length - 1].id;
    }
  } while (page.length > 0);

  return techs;
};

const AddTechModal: FC<AddTechModalProps> = ({
  project,
  setProject,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [techs, setTechs] = useState<Tech[]>([]);
  const [chosenTechs, setChosenTechs] = useState<Tech[]>(project.techs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;

    loadAllTechs()
      .then((techs) => {
        setLoading(false);
        setTechs(techs);
      })
      .catch(console.error);

    fetch("/api/v1/techs").then(async (response) => {
      if (response.status === 200 || response.status === 304) {
        const data = await response.json();

        setLoading(false);
        setTechs(data);
      } else {
        console.error(
          "failed to load techs",
          response.status,
          await response.json()
        );
      }
    });
  });

  const CustomMenuButton = forwardRef<HTMLButtonElement>(
    ({ children }, ref) => (
      <button
        className={"orange-btn " + (loading ? "opacity-50 cursor-wait" : "")}
        onClick={() => !loading && setOpen(!open)}
        ref={ref}
      >
        {children}
      </button>
    )
  );

  const chooseTech = (e: any, chosenTech: Tech) => {
    const updatedTechs = techs.filter((tech) => tech !== chosenTech);
    setTechs(updatedTechs);
    setChosenTechs([...chosenTechs, chosenTech]);
  };

  const removeTech = (e: any, chosenTech: Tech) => {
    const updatedChosenTechs = chosenTechs.filter(
      (tech) => tech !== chosenTech
    );
    setChosenTechs(updatedChosenTechs);
    setTechs([...techs, chosenTech]);
  };

  const updateProject = async () => {
    const resp = await fetch("/api/v1/projects/" + project.id, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ techs: chosenTechs.map((t) => t.id) }),
    });

    if (resp.status === 200) {
      setProject(await resp.json());
    } else {
      console.error("failed to update project", resp.status, await resp.json());
    }
  };

  const saveChanges = async () => {
    if (loading) return;

    setLoading(true);
    await updateProject();
    setLoading(false);

    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed z-10 top-0 left-0 h-screen w-screen backdrop-blur-sm"
      ></div>
      <div className="fixed z-10 inset-0 overflow-y-auto max-w-3xl mx-auto w-full">
        <div className="bg-white mx-2 my-4 p-4 rounded-lg">
          {/* Modal Title */}
          <div className="text-lg font-semibold">Update Tech Stack</div>

          <div className="flex flex-wrap justify-start">
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
              {() => (
                <>
                  <Menu.Button as={CustomMenuButton}>
                    {open ? "Close Techs List" : "Add Technologies"}
                  </Menu.Button>
                  {open && (
                    <Menu.Items
                      static
                      className="bg-white max-w-lg text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4 max-h-48 overflow-y-scroll"
                    >
                      {techs
                        .sort((a: Tech, b: Tech) => (a.name > b.name ? 1 : -1))
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
            <button
              type="submit"
              className={
                "main-btn " + (loading ? " opacity-50 cursor-wait" : "")
              }
              onClick={saveChanges}
            >
              Update
            </button>
            <button type="button" className="main-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTechModal;
