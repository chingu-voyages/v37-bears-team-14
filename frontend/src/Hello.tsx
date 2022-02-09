import { useEffect, useState } from "react";

export default function Hello() {
  const [data, setData] = useState({ name: "loading..." });

  useEffect(() => {
    fetch("/api/v1/hello")
      .then((r) => r.json())
      .then((data) => setData(data));
  }, [data]);

  return <div>Hello {data.name}!</div>;
}
