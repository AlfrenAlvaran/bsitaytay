
import Reveal from "@/components/ui/Reveal";
import DocumentCard from "./DocumentCard";
import EmptyState from "./EmptyState";
import { RequestDocumentItem } from "./services";


type Props = {
  documents: RequestDocumentItem[];
  gridKey: string;
  onReset: () => void;
};

const DocumentGrid = ({ documents, gridKey, onReset }: Props) => {
  if (documents.length === 0) return <EmptyState onReset={onReset} />;

  return (
    <div
      key={gridKey}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {documents.map((doc, i) => (
        <Reveal key={doc.title} delay={Math.min(i, 6) * 50} className="h-full">
          <DocumentCard {...doc} />
        </Reveal>
      ))}
    </div>
  );
};

export default DocumentGrid;