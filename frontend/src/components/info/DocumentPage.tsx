import { FC, useEffect, useState } from "react";
import Document from "../formatting/Document";
// import Readme from "../formatting/Readme";

interface DocumentPageProps {
  contentUrl: string;
}

const DocumentPage: FC<DocumentPageProps> = ({ contentUrl }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    const getContent = async () => {
      const get = await fetch(contentUrl);
      if (get.status === 200 || get.status === 304) {
        setContent(await (await get).text());
      } else {
        console.error("Failed to load content", contentUrl, get.status, get);
      }
    };

    getContent().catch(console.error);
  }, [contentUrl]);

  return (
    <div className="bg-gray-100 py-12">
      <div className="mx-3 md:mx-8">
        <Document>{content}</Document>
      </div>
    </div>
  );
};

export default DocumentPage;
