import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Tailspin size="60" stroke="5" speed="0.9" color="rgb(77, 145, 255)" />
    </div>
  );
};

export default Loading;
