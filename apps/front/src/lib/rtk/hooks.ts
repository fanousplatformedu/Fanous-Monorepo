import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@lib/rtk/store";
import { TypedUseSelectorHook } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
