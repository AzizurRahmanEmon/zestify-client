"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import type { ToastContainerProps } from "react-toastify";

type ToastContainerComponent = ComponentType<ToastContainerProps>;

const AppToaster = () => {
  const [ToastContainerComponent, setToastContainerComponent] =
    useState<ToastContainerComponent | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadToastify = async () => {
      const [{ ToastContainer }] = await Promise.all([
        import("react-toastify"),
        import("react-toastify/dist/ReactToastify.css"),
      ]);

      if (mounted) {
        setToastContainerComponent(
          () => ToastContainer as ToastContainerComponent,
        );
      }
    };

    loadToastify();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ToastContainerComponent) return null;

  return <ToastContainerComponent />;
};

export default AppToaster;
