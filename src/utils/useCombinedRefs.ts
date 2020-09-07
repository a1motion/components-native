import React from "react";

export default function useCombinedRefs<T>(...refs: Array<React.Ref<T>>) {
  const targetRef = React.useRef<T | null>(null);

  React.useEffect(() => {
    refs.forEach((ref: any) => {
      if (!ref) {
        return;
      }

      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
