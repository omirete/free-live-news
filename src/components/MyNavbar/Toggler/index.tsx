import { useCallback, useState } from "react";
import { NavbarState } from "..";

export interface NavbarTogglerProps {
  setState: React.Dispatch<React.SetStateAction<NavbarState>>;
}

const Toggler: React.FC<NavbarTogglerProps> = ({ setState }) => {
  const [transitionTimeout, setTransitionTimeout] = useState<
    number | undefined
  >();
  const handleToggle = useCallback(() => {
    if (transitionTimeout) {
      clearTimeout(transitionTimeout);
    }
    setState((prev) => {
      if (prev.expanded) {
        return {
          ...prev,
          height: "100px",
        };
      } else {
        return prev;
      }
    });
    setState((prev) => {
      return {
        expanded: !prev.expanded,
        transitioning: true,
        height: prev.expanded ? "" : "100px",
      };
    });
    setTransitionTimeout(
      setTimeout(() => {
        setState((prev) => ({
          expanded: prev.expanded,
          transitioning: false,
          height: "",
        }));
      }, 500)
    );
  }, [transitionTimeout]);
  return (
    <button
      className="navbar-toggler d-block d-md-none"
      type="button"
      aria-expanded="false"
      aria-label="Toggle navigation"
      onClick={handleToggle}
    >
      <span className="navbar-toggler-icon"></span>
    </button>
  );
};

export default Toggler;
