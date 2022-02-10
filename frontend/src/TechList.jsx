import React, { useEffect, useState } from "react";

export default function TechList() {
  const [isLoading, setIsLoading] = useState(true);
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    if (!isLoading) return;

    fetch("/api/v1/techs")
      .then(async (resp) => {
        if (resp.status === 200) {
          setTechs(await resp.json());
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.error("failed to load techs", resp.status, await resp.json());
        }
      })
      .catch(console.error);
  });

  return (
    <div className="mx-12 border-2 rounded-md">
      <div className="overflow-x-scroll w-full flex p-2">
        {techs.map((tech) => (
          <>
            <div className="mr-1">
              <img
                className="min-w-[100px] w-[100px] h-[100px] bg-stone-100 "
                src={tech.imageUrl}
                alt={tech.name}
              />
              <div className="whitespace-nowrap text-xs">{tech.name}</div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
