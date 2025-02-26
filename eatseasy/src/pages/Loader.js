import * as React from "react";
import BounceLoader from "react-spinners/BounceLoader";

export default function Loader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center z-[9999] text-center overflow-hidden">
      <BounceLoader
        color={'#a7c3a9'}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
