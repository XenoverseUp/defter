import type { ElementType, ForwardedRef, ReactNode } from "react";
import { Fragment, createElement, forwardRef } from "react";

interface Props {
  condition: boolean;
  renderItem: () => ReactNode;
  renderElse?: () => ReactNode;
  wrapper?: ElementType;
}

export const If = forwardRef(function (
  { condition, renderItem, renderElse = () => null, wrapper: Wrapper = Fragment }: Props,
  ref: ForwardedRef<unknown>,
) {
  const children = condition ? renderItem() : renderElse();

  if (Wrapper === Fragment) {
    return <>{children}</>;
  }

  return createElement(Wrapper, { ref }, children);
});

If.displayName = "If";

interface IfValueProps<T> {
  value: T | null | undefined;
  renderItem: (value: T) => ReactNode;
  renderElse?: () => ReactNode;
  wrapper?: ElementType;
}

export function IfValue<T>({ value, renderItem, renderElse = () => null, wrapper: Wrapper = Fragment }: IfValueProps<T>) {
  const children = value != null ? renderItem(value) : renderElse();

  if (Wrapper === Fragment) {
    return <>{children}</>;
  }

  return createElement(Wrapper, {}, children);
}
