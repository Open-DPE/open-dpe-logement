import ReactMarkdown from 'react-markdown';
import { allContent } from "../lib/content";
import { AlertCircleIcon, InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Props {
  slug: string;
}

export function Content({ slug }: Props) {
  const item = allContent.find((c) => c.slug === slug);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <InfoIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informations</DialogTitle>
        </DialogHeader>
        {
          item ? (
            <article className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 content">
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </article>
          ) : (
            <Alert variant="destructive" className="max-w-md">
              <AlertCircleIcon />
              <AlertTitle>Contenu introuvable</AlertTitle>
              <AlertDescription>
                Le contenu que vous recherchez est introuvable.
              </AlertDescription>
            </Alert>
          )
        }
      </DialogContent>
    </Dialog>
  );
}
