import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const LoadingToRedirect = () => {
  const [count, setCount] = useState(5);
  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    // Redirect once count is 0
    count === 0 && history.push("/");
    // Cleanup
    return () => clearInterval(interval);
  }, [count, history]);
  return (
    <div className="container p-5 text-center">
      <p>Redirecting you in {count} seconds</p>
    </div>
  );
};

export default LoadingToRedirect;
