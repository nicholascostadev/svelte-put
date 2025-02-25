declare module '@svelte-put/tooltip' {
  import type { SvelteComponent, ComponentType } from 'svelte';
  import type { Action } from 'svelte/action';
  /// <reference types="svelte" />

  export function prepare<
    Events extends Record<string, any>,
    Slots extends Record<string, any>,
    Props extends TooltipComponentBaseProps,
  >(
    param: TooltipContainer & {
      content: import('svelte').ComponentType<
        import('svelte').SvelteComponent<Props, Events, Slots>
      >;
      compute?:
        | TooltipCompute<Props, import('svelte').SvelteComponent<Props, Events, Slots>>
        | undefined;
    },
  ): PreparedTooltipAction<Props>;

  export function prepare<
    Events extends Record<string, any>,
    Slots extends Record<string, any>,
    Props extends TooltipComponentBaseProps,
  >(
    param: TooltipContainer & {
      content: {
        component: import('svelte').ComponentType<
          import('svelte').SvelteComponent<Props, Events, Slots>
        >;
        props?: Props | undefined;
      };
      compute?:
        | TooltipCompute<Props, import('svelte').SvelteComponent<Props, Events, Slots>>
        | undefined;
    },
  ): PreparedTooltipAction<Props>;

  export function prepare(
    param: TooltipContainer & {
      content: string;
      compute?: TooltipCompute<{}, string>;
    },
  ): PreparedTooltipAction<string>;

  export function tooltip<
    Events extends Record<string, any>,
    Slots extends Record<string, any>,
    Props extends TooltipComponentBaseProps,
    Content extends TooltipContent<Props>,
    ComputeContent extends TooltipComputeContent<Props>,
  >(
    node: Element,
    param: TooltipContainer & {
      content: import('svelte').ComponentType<
        import('svelte').SvelteComponent<Props, Events, Slots>
      >;
      compute?:
        | TooltipCompute<Props, import('svelte').SvelteComponent<Props, Events, Slots>>
        | undefined;
    },
  ): import('svelte/action').ActionReturn<
    TooltipParameter<Props, Content, ComputeContent>,
    TooltipAttributes
  >;

  export function tooltip<
    Events extends Record<string, any>,
    Slots extends Record<string, any>,
    Props extends TooltipComponentBaseProps,
    Content extends TooltipContent<Props>,
    ComputeContent extends TooltipComputeContent<Props>,
  >(
    node: Element,
    param: TooltipContainer & {
      content: {
        component: import('svelte').ComponentType<
          import('svelte').SvelteComponent<Props, Events, Slots>
        >;
        props?: Props | undefined;
      };
      compute?:
        | TooltipCompute<Props, import('svelte').SvelteComponent<Props, Events, Slots>>
        | undefined;
    },
  ): import('svelte/action').ActionReturn<
    TooltipParameter<Props, Content, ComputeContent>,
    TooltipAttributes
  >;

  export function tooltip(
    Node: Element,
    param: TooltipContainer & {
      content: string;
      compute?: TooltipCompute<{}, string> | undefined;
    },
  ): import('svelte/action').ActionReturn<
    TooltipParameter<Props, string, string>,
    TooltipAttributes
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type TooltipComponentBaseProps = Record<string, any>;

  type TooltipContent<Props extends TooltipComponentBaseProps> =
    | string
    | ComponentType<SvelteComponent<Props>>
    | {
        /**
         * Svelte component to render as tooltip
         */
        component: ComponentType<SvelteComponent<Props>>;
        /**
         * Props to pass to component, if any. Note that if required props are not passed down,
         * a runtime error will be thrown.
         */
        props?: Props;
      };

  type TooltipContainer = {
    /**
     * class name(s) to assign to tooltip container. Typically needed depending
     * on the positioning strategy
     */
    class?:
      | string
      | {
          default?: string;
          /** toggled on when tooltip is visible */
          visible?: string;
        };
    /**
     * HTML tag to render the tooltip container.
     * Defaults to `div`
     */
    tag?: string;
    /**
     * `Element` to render the tooltip container as child.
     * Defaults to `parent` of the node action is placed on
     */
    target?: 'parent' | 'self' | 'body' | Element | ((node: Element, tooltip: Element) => void);
    /**
     * number of milliseconds to debounce show / hide state of the tooltip.
     * Defaults to `false` (show / hide immediately)
     */
    debounce?: false | number;
    /**
     * config for handling of `pointer-events` on the container element
     * Defaults to `true`
     *
     * @remarks
     * By default `pointer-events` is set to `none` by default, and `auto` when triggered.
     * Set to `false` to disable default behavior, or provide string(s) to
     * corresponding states
     */
    pointerEvents?:
      | boolean
      | {
          default?: string;
          /** value when tooltip is visible */
          visible?: string;
        };
    /**
     * the attribute to toggle in respond to tooltip's visibility state.
     * Defaults to `data-visible`.
     *
     * @remarks
     * Set to `false` to disable, or provide a string to use as attribute name.
     */
    visibleAttribute?: boolean | string;
    /**
     * config for accessibility
     * Defaults to `true`
     *
     * @remarks
     * By default:
     *   - (for container element) `role` is set to `tooltip`,
     *   - (for container element) `id` is taken from `aria-describedby` of
     *     the node action is placed on (if any),
     *     or auto-generated from a global counter,
     *   - (for node on which action is used) `aria-describedby` is set to the `id` of
     *     the container element (if not already exists)
     *
     * Set to `false` to disable default behavior, or provide string(s) to
     * the corresponding attributes
     */
    aria?:
      | boolean
      | {
          role?: string;
          id?: string;
        };
  };

  type TooltipComputeContent<Props extends TooltipComponentBaseProps> =
    | string
    | SvelteComponent<Props>;

  type TooltipComputeParameter<
    Props extends TooltipComponentBaseProps,
    ComputeContent extends TooltipComputeContent<Props>,
  > = {
    node: Element;
    tooltip: Element;
    content: ComputeContent;
  };

  type TooltipCompute<
    Props extends TooltipComponentBaseProps,
    ComputeContent extends TooltipComputeContent<Props>,
  > = (
    param: TooltipComputeParameter<Props, ComputeContent>,
  ) => void | (() => void) | Promise<void | (() => void)>;

  type TooltipAttributes = {
    /** if provided will be set to `id` of the tooltip element, auto-generated otherwise  */
    'aria-describedby'?: string;
  };

  type PreparedTooltipAction<Parameter> = Action<Element, Parameter | undefined, TooltipAttributes>;

  type TooltipParameter<
    Props extends TooltipComponentBaseProps,
    Content extends TooltipContent<Props>,
    ComputeContent extends TooltipComputeContent<Props>,
  > = TooltipContainer & {
    content: Content;
    compute?: TooltipCompute<TooltipComponentBaseProps, ComputeContent>;
  };
}

//# sourceMappingURL=index.d.ts.map
