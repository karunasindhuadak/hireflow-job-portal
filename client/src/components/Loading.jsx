import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-navy">
      <Tailspin size="60" stroke="5" speed="0.9" color="#00E5FF" />
    </div>
  );
};

export default Loading;
