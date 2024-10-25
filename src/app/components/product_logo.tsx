import Image from "next/image";

export default function ProductLogo() {
  return (
    <div className="flex flex-row items-end">
      <Image width="40" height="40" src="/cal-face.png" alt="" />
      <span className="ml-3 text-3xl font-bold text-gray-100">Cal</span>
    </div>
  );
}
