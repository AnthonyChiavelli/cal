import Image from "next/image";

interface IResourceNotFoundProps {
  resourceName: string;
  imageUrl?: string;
}

export default function ResourceNotFound(props: IResourceNotFoundProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-700">Resource Not Found</h1>
      <p className="text-gray-500">The {props.resourceName} you are looking for does not exist.</p>
      {props.imageUrl && <Image src={props.imageUrl} alt="Resource not found" />}
    </div>
  );
}
