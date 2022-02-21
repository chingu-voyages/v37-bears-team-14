import { useEffect, useState } from "react";

export default function TechListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch("/api/v1/techs")
      .then(async (resp) => {
        if (resp.status >= 200 && resp.status < 300) {
          setIsLoading(false);
          setTechs(await resp.json());
        } else {
          console.error("Failed to load techs", resp);
        }
      })
      .catch((err) => {
        console.error("Failed to load techs", err);
      });
  });

  return (
    <div className="mx-4 my-4 rounded-lg overflow-hidden border-[1px] border-slate-400">
      <table className="border-collapse table-auto w-full">
        <thead className="bg-slate-100 rounded">
          <tr>
            <th className=" py-1 border-b dark:border-slate-600">Team Name</th>
            <th className=" py-1 border-b dark:border-slate-600">Repo URL</th>
          </tr>
        </thead>
        <tbody>
          {techs.map((tech: any) => (
            <tr className="" key={tech.id}>
              <td className="py-1 px-2 border-b dark:border-slate-600">
                <div className="mr-4">
                  {tech.name || <span className="opacity-40">Untitled</span>}
                </div>
              </td>
              <td className="py-1 px-2 border-b dark:border-slate-600">
                {tech.description || (
                  <span className="opacity-40">Untitled</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
