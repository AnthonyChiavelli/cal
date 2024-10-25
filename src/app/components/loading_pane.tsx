import { FadeLoader } from "react-spinners";

export default function LoadingPane() {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-slate-500 bg-opacity-50">
      <FadeLoader />
    </div>
  );
}
