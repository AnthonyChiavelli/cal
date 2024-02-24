import { FadeLoader } from "react-spinners";

export default function LoadingPane() {
  return (
    <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center z-10 bg-slate-500 bg-opacity-50">
      <FadeLoader />
    </div>
  );
}
