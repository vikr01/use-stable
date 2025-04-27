import { useRef } from "react";
import builder, { type UseStable } from "./builder";

const useStable: UseStable = builder(useRef);

export default useStable;
