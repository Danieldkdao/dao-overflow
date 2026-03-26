"use client";

import { ErrorBoundary } from "react-error-boundary";
import { ReactNode } from "react";
import { ErrorState } from "@/components/error-state";

type SuspenseErrorBoundaryProps = {
  children: ReactNode;
  title: string;
  description: string;
  fullScreen?: boolean;
  className?: string;
};

export const SuspenseErrorBoundary = ({
  children,
  title,
  description,
  fullScreen,
  className,
}: SuspenseErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorState
          title={title}
          description={description}
          fullScreen={fullScreen}
          className={className}
        />
      }
    >
      {children}
    </ErrorBoundary>
  );
};
